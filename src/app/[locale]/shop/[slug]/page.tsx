import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/ProductDetail";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AnglerSpecs } from "@/components/AnglerSpecs";
import { ProductCard } from "@/components/ProductCard";
import { getReviewEligibility } from "@/lib/review-eligibility";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { createdAt: "asc" } } },
  });
  if (!product || !product.active) return {};

  const tAngling = await getTranslations({ locale, namespace: "Angling" });
  const name = locale === "fr" ? product.nameFr : product.nameEn;
  const primarySpecies = product.species[0] ? tAngling(`species.${product.species[0]}`) : null;
  const title = primarySpecies
    ? locale === "fr"
      ? `${name} — Mouche pour ${primarySpecies}`
      : `${name} — ${primarySpecies} Fly`
    : name;
  const sizeRange = product.variants.length > 0
    ? (locale === "fr" ? product.variants[0].nameFr : product.variants[0].nameEn)
    : null;
  const baseDescription = (locale === "fr" ? product.descriptionFr : product.descriptionEn).slice(0, 140);
  const description = sizeRange
    ? `${baseDescription} ${locale === "fr" ? `Tailles disponibles : ${sizeRange}${product.variants.length > 1 ? " et plus" : ""}.` : `Sizes available: ${sizeRange}${product.variants.length > 1 ? " and more" : ""}.`}`
    : baseDescription;
  const image = product.images[0] ?? "/brand/logo-512.png";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/shop/${slug}`,
      languages: {
        fr: `${baseUrl}/fr/shop/${slug}`,
        en: `${baseUrl}/en/shop/${slug}`,
      },
    },
    openGraph: {
      title: `${name} — La Moucherie`,
      description,
      url: `${baseUrl}/${locale}/shop/${slug}`,
      images: [{ url: image }],
    },
  };
}

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

  // Same category first — the shopper is already thinking in that mode.
  // Falls back to species overlap only when the category alone can't fill 3,
  // so a niche category never shows unrelated flies just to pad the count.
  const sameCategory = await prisma.product.findMany({
    where: { active: true, category: product.category, id: { not: product.id } },
    include: { variants: true, reviews: { where: { status: "APPROVED" }, select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const pairsWellWith =
    sameCategory.length >= 3 || product.species.length === 0
      ? sameCategory
      : [
          ...sameCategory,
          ...(await prisma.product.findMany({
            where: {
              active: true,
              id: { notIn: [product.id, ...sameCategory.map((p) => p.id)] },
              species: { hasSome: product.species },
            },
            include: {
              variants: true,
              reviews: { where: { status: "APPROVED" }, select: { rating: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 3 - sameCategory.length,
          })),
        ];

  const prices = product.variants.map((v) => v.priceCents ?? product.basePriceCents);
  const minPrice = prices.length ? Math.min(...prices) : product.basePriceCents;
  const hasStock = product.variants.some((v) => v.stock > 0);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: locale === "fr" ? product.nameFr : product.nameEn,
    description: locale === "fr" ? product.descriptionFr : product.descriptionEn,
    image: product.images.length > 0 ? product.images : [`${siteUrl}/products/placeholder-fly.svg`],
    brand: {
      "@type": "Brand",
      name: "La Moucherie",
    },
    offers: {
      "@type": "Offer",
      price: (minPrice / 100).toFixed(2),
      priceCurrency: product.currency.toUpperCase(),
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/${locale}/shop/${product.slug}`,
    },
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      {pairsWellWith.length > 0 && (
        <section className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-display text-xl font-semibold text-forest">
            {t("pairsWellWith")}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {pairsWellWith.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        locale={locale}
        eligibility={eligibility}
      />
    </div>
  );
}
