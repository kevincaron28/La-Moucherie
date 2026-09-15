import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { CURRENCY } from "@/lib/constants";
import {
  discountCents as computeDiscount,
  eligibleQuantity,
  eligibleSubtotalCents,
  totalQuantity,
} from "@/lib/discount";
import { resolveShippingRate } from "@/lib/shipping-quote";
import {
  SHIPPING_METHODS,
  PROVINCES,
  isFreeShipping,
  effectiveMethod,
} from "@/lib/shipping";

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
    // A known province code, not free text: the shipping zone is derived from
    // it, so an unrecognised value would silently pick a rate.
    province: z.enum(PROVINCES.map((p) => p.code) as [string, ...string[]]),
    postalCode: z.string().min(1).max(20),
    // Canada only for now — a US address would be charged a domestic rate.
    country: z.literal("CA"),
  }),
  shippingMethod: z.enum(SHIPPING_METHODS),
  notes: z.string().max(500).optional(),
  locale: z.enum(["fr", "en"]),
});

export async function POST(request: Request) {
  const session = await auth();
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { items, email, customerName, shipping, shippingMethod, notes, locale } =
    parsed.data;

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
    variantSnapshotFr: string;
    variantSnapshotEn: string;
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
      // The hook size, frozen at purchase: without it a paid order can't tell
      // you what to tie or pull from the bin.
      variantSnapshotFr: variant.nameFr,
      variantSnapshotEn: variant.nameEn,
      sku: variant.sku,
      unitPriceCents,
      quantity: item.quantity,
    });
  }

  // Bulk pricing is decided here too — the browser never sends a discount, and
  // the categories come from the database rather than the cart payload.
  const priced = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return {
      quantity: item.quantity,
      category: variant.product.category as string,
      unitPriceCents: variant.priceCents ?? variant.product.basePriceCents,
    };
  });
  const discountCents = computeDiscount(
    eligibleSubtotalCents(priced),
    eligibleQuantity(priced)
  );
  amountTotalCents -= discountCents;

  // The browser sends only which method was picked; the price of that method
  // and whether it's free are decided here, from the subtotal this route
  // computed itself. Free shipping is judged after the discount, on what the
  // customer actually pays for flies.
  const subtotalCents = amountTotalCents;
  const parcelFlyCount = totalQuantity(items);
  // Re-derived here rather than trusted from the browser: a request could
  // claim shippingMethod "LETTER" for eighty flies, and this is what stops
  // that from actually being charged the flat rate.
  const method = effectiveMethod(shippingMethod, subtotalCents, parcelFlyCount);
  // Live Canada Post quote where possible, static zone rate when the API is
  // unreachable. Either way it's decided here, never taken from the browser —
  // the quote the customer saw is a preview, this is the charge.
  const shippingCents = isFreeShipping(subtotalCents)
    ? 0
    : (
        await resolveShippingRate(
          method,
          shipping.province,
          shipping.postalCode,
          parcelFlyCount
        )
      ).cents;
  amountTotalCents += shippingCents;

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amountTotalCents,
      currency: CURRENCY,
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      // Mirrored onto the PaymentIntent so the Stripe dashboard shows where the
      // order ships to. The Order row below stays the source of truth for
      // fulfillment; this copy exists so packing slips can be pulled from
      // either side without cross-referencing.
      shipping: {
        name: customerName,
        address: {
          line1: shipping.line1,
          line2: shipping.line2 || undefined,
          city: shipping.city,
          state: shipping.province,
          postal_code: shipping.postalCode,
          country: shipping.country,
        },
      },
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
      shippingMethod: method,
      shippingCents,
      notes: notes?.trim() || null,
      discountCents,
      amountTotalCents,
      currency: CURRENCY,
      locale,
      items: { create: orderItems },
    },
  });

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { shippingLine1: true },
    });
    if (user && !user.shippingLine1) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          shippingLine1: shipping.line1,
          shippingLine2: shipping.line2 || null,
          shippingCity: shipping.city,
          shippingProvince: shipping.province,
          shippingPostalCode: shipping.postalCode,
          shippingCountry: shipping.country,
        },
      });
    }
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  });
}
