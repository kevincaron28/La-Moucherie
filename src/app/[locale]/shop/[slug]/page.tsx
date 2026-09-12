import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/ProductDetail";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Product");

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { createdAt: "asc" } } },
  });

  if (!product || !product.active) {
    notFound();
  }

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/shop"
        className="text-sm font-medium text-forest/70 hover:text-rust"
      >
        &larr; {t("back")}
      </Link>
      <div className="mt-2">
        <ProductDetail
          product={product}
          reviewCount={reviews.length}
          averageRating={averageRating}
        />
      </div>
      <ReviewsSection productId={product.id} reviews={reviews} locale={locale} />
    </div>
  );
}
