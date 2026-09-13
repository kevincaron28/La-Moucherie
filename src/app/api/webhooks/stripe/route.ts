import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await fulfillOrder(paymentIntent.id);
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(paymentIntentId: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { items: true },
    });

    // Only a still-unfulfilled order draws down stock. Stripe retries failed
    // deliveries (and the dashboard can resend by hand), so anything already
    // moved past PENDING has had its stock counted and must not be counted
    // twice — including orders since marked FULFILLED/REFUNDED.
    if (!order || order.status !== "PENDING") {
      return;
    }

    for (const item of order.items) {
      if (!item.variantId) continue;
      // Floor at zero: if the same last unit sold twice in the window between
      // checkout and payment confirmation, oversell it rather than record a
      // negative stock count that breaks the "out of stock" logic everywhere.
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        select: { stock: true },
      });
      if (!variant) continue;
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: Math.max(0, variant.stock - item.quantity) },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });
  });
}
