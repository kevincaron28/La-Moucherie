import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/ProductDetail";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AnglerSpecs } from "@/components/AnglerSpecs";
import { getReviewEligibility } from "@/lib/review-eligibility";
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
    include: {
      variants: { orderBy: { createdAt: "asc" } },
      waters: { select: { slug: true, nameFr: true, nameEn: true } },
    },
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
  const eligibility = await getReviewEligibility(product.id);

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
      <AnglerSpecs
        locale={locale}
        species={product.species}
        seasons={product.seasons}
        waterTypes={product.waterTypes}
        techniques={product.techniques}
        imitatesFr={product.imitatesFr}
        imitatesEn={product.imitatesEn}
        sizes={product.variants.map((v) =>
          locale === "fr" ? v.nameFr : v.nameEn
        )}
        howToFish={locale === "fr" ? product.howToFishFr : product.howToFishEn}
        proTip={locale === "fr" ? product.proTipFr : product.proTipEn}
        waters={product.waters}
      />
      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        locale={locale}
        eligibility={eligibility}
      />
    </div>
  );
}
