import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation, sendOrderNotificationToOwner } from "@/lib/email";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // These two failures look identical from Stripe's side — both are a 400 — but
  // they have completely different fixes, so say which one happened. Everything
  // downstream (order marked paid, stock drawn down, confirmation email) hangs
  // off this check, so a silent rejection strands orders in PENDING.
  if (!webhookSecret) {
    console.error(
      "[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set — every event will be rejected."
    );
    return NextResponse.json({ error: "secret_not_configured" }, { status: 400 });
  }

  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(
      "[stripe-webhook] signature verification failed — the STRIPE_WEBHOOK_SECRET " +
        "deployed here does not match the endpoint that sent this event.",
      err instanceof Error ? err.message : err
    );
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
  const justPaid = await markPaidAndDrawDownStock(paymentIntentId);
  if (!justPaid) return;

  // Outside the transaction: email is slow and failure-prone, and must never
  // roll back a payment that already succeeded. Both calls swallow their own
  // errors, so a mail outage costs a notification, not an order.
  await sendOrderConfirmation(justPaid);
  await sendOrderNotificationToOwner(justPaid);
}

async function markPaidAndDrawDownStock(paymentIntentId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { items: true },
    });

    // Only a still-unfulfilled order draws down stock. Stripe retries failed
    // deliveries (and the dashboard can resend by hand), so anything already
    // moved past PENDING has had its stock counted and must not be counted
    // twice — including orders since marked FULFILLED/REFUNDED.
    if (!order || order.status !== "PENDING") {
      return null;
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

    return order;
  });
}
