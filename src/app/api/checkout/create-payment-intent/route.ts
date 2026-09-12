import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { SHIPPING_FLAT_CENTS, CURRENCY } from "@/lib/constants";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
  email: z.string().email(),
  customerName: z.string().min(1).max(200),
  shipping: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(120),
    province: z.string().min(1).max(120),
    postalCode: z.string().min(1).max(20),
    country: z.string().length(2),
  }),
  locale: z.enum(["fr", "en"]),
});

export async function POST(request: Request) {
  const session = await auth();
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { items, email, customerName, shipping, locale } = parsed.data;

  const variantIds = items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== new Set(variantIds).size) {
    return NextResponse.json({ error: "product_not_found" }, { status: 400 });
  }

  let amountTotalCents = 0;
  const orderItems: {
    productId: string;
    variantId: string;
    nameSnapshotFr: string;
    nameSnapshotEn: string;
    sku: string;
    unitPriceCents: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || !variant.product.active) {
      return NextResponse.json({ error: "product_not_found" }, { status: 400 });
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        { error: "insufficient_stock", sku: variant.sku },
        { status: 409 }
      );
    }
    const unitPriceCents = variant.priceCents ?? variant.product.basePriceCents;
    amountTotalCents += unitPriceCents * item.quantity;
    orderItems.push({
      productId: variant.productId,
      variantId: variant.id,
      nameSnapshotFr: variant.product.nameFr,
      nameSnapshotEn: variant.product.nameEn,
      sku: variant.sku,
      unitPriceCents,
      quantity: item.quantity,
    });
  }

  amountTotalCents += SHIPPING_FLAT_CENTS;

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amountTotalCents,
      currency: CURRENCY,
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: { source: "la-moucherie-web" },
    });
  } catch (err) {
    console.error("Stripe PaymentIntent creation failed:", err);
    return NextResponse.json({ error: "payment_provider_error" }, { status: 502 });
  }

  const order = await prisma.order.create({
    data: {
      stripePaymentIntentId: paymentIntent.id,
      userId: session?.user?.id,
      email,
      customerName,
      shippingLine1: shipping.line1,
      shippingLine2: shipping.line2,
      shippingCity: shipping.city,
      shippingProvince: shipping.province,
      shippingPostalCode: shipping.postalCode,
      shippingCountry: shipping.country,
      amountTotalCents,
      currency: CURRENCY,
      locale,
      items: { create: orderItems },
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  });
}
