import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

// The confirmation page needs to read an order seconds after checkout, when a
// guest has no session to prove ownership with. Rather than leave the endpoint
// open to anyone holding an id, a guest must present the PaymentIntent client
// secret Stripe just handed their browser — proof they are the one who paid.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      stripePaymentIntentId: true,
      status: true,
      amountTotalCents: true,
      currency: true,
      createdAt: true,
      items: {
        select: {
          nameSnapshotFr: true,
          nameSnapshotEn: true,
          variantSnapshotFr: true,
          variantSnapshotEn: true,
          quantity: true,
          unitPriceCents: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const session = await auth();
  const ownsOrder = Boolean(
    session?.user && order.userId && session.user.id === order.userId
  );

  let provedPayment = false;
  const clientSecret = new URL(request.url).searchParams.get("payment_intent_client_secret");
  if (!ownsOrder && clientSecret) {
    try {
      const intent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      provedPayment = intent.client_secret === clientSecret;
    } catch (err) {
      console.error("[order-lookup:stripe-failed]", err);
    }
  }

  if (!ownsOrder && !provedPayment) {
    // Same shape as a missing order: don't confirm that an id exists to someone
    // who can't demonstrate they own it.
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    amountTotalCents: order.amountTotalCents,
    currency: order.currency,
    createdAt: order.createdAt,
    items: order.items,
  });
}
