import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/CheckoutClient";
import { placeholderForCategory } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // A pool of candidates rather than a finished list: the cart lives in the
  // browser, so only the client can tell what's already in it. Assortments come
  // first — a box is the single easiest add at this point, and it's the biggest
  // jump in order value available.
  const suggestions = await prisma.product.findMany({
    where: { active: true, variants: { some: { stock: { gt: 0 } } } },
    orderBy: [{ category: "asc" }, { featured: "desc" }],
    take: 12,
    select: {
      id: true,
      slug: true,
      nameFr: true,
      nameEn: true,
      category: true,
      basePriceCents: true,
      images: true,
      variants: {
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { id: true, nameFr: true, nameEn: true, sku: true, priceCents: true },
      },
    },
  });

  return (
    <CheckoutClient
      suggestions={suggestions
        .filter((p) => p.variants.length > 0)
        .map((p) => ({
          productId: p.id,
          slug: p.slug,
          nameFr: p.nameFr,
          nameEn: p.nameEn,
          category: p.category as string,
          image: p.images[0] ?? placeholderForCategory(p.category),
          variantId: p.variants[0].id,
          variantNameFr: p.variants[0].nameFr,
          variantNameEn: p.variants[0].nameEn,
          sku: p.variants[0].sku,
          unitPriceCents: p.variants[0].priceCents ?? p.basePriceCents,
        }))}
    />
  );
}
