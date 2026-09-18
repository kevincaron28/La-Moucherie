import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { placeholderForCategory } from "@/lib/localize";

/**
 * Rebuilds a cart from an abandoned order. The recovery token is the only
 * credential — it's random, single-purpose and never exposes the order id — so
 * it's rate limited and only ever returns line items, never the customer's
 * address or totals.
 */
export async function GET(request: Request) {
  const allowed = await checkRateLimit(`recover:${clientIp(request)}`, 30, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { recoveryToken: token },
    select: {
      status: true,
      items: {
        select: {
          quantity: true,
          variant: {
            select: {
              id: true,
              nameFr: true,
              nameEn: true,
              sku: true,
              priceCents: true,
              stock: true,
              product: {
                select: {
                  id: true,
                  slug: true,
                  nameFr: true,
                  nameEn: true,
                  category: true,
                  basePriceCents: true,
                  images: true,
                  active: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // A paid order has nothing to recover, and neither does a swept one.
  if (!order || order.status !== "PENDING") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Rebuilt from today's catalogue, not the snapshot: a pattern that has since
  // been retired or sold out shouldn't reappear in someone's cart, and the
  // price they pay should be the current one.
  const items = order.items
    .filter((i) => i.variant && i.variant.product.active && i.variant.stock > 0)
    .map((i) => {
      const v = i.variant!;
      return {
        productId: v.product.id,
        variantId: v.id,
        slug: v.product.slug,
        nameFr: v.product.nameFr,
        nameEn: v.product.nameEn,
        variantNameFr: v.nameFr,
        variantNameEn: v.nameEn,
        sku: v.sku,
        category: v.product.category as string,
        unitPriceCents: v.priceCents ?? v.product.basePriceCents,
        image: v.product.images[0] ?? placeholderForCategory(v.product.category),
        quantity: Math.min(i.quantity, v.stock),
      };
    });

  return NextResponse.json({ items });
}
