import type { Product, ProductVariant } from "@prisma/client";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";
import type { Locale } from "@/i18n/routing";

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
  reviews?: { rating: number }[];
};

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const t = useTranslations("Shop");
  const tProduct = useTranslations("Product");
  const locale = useLocale() as Locale;

  const prices = product.variants.map((v) => v.priceCents ?? product.basePriceCents);
  const minPrice = prices.length ? Math.min(...prices) : product.basePriceCents;
  const hasStock = product.variants.some((v) => v.stock > 0);
  const reviews = product.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-parchment transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-forest/10"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <Image
          src={product.images[0] ?? "/products/placeholder-fly.svg"}
          alt={pick(product.nameFr, product.nameEn, locale)}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {!hasStock && (
          <span className="absolute right-2 top-2 rounded-full bg-forest/90 px-2 py-1 text-[11px] font-medium text-cream">
            {tProduct("outOfStock")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold text-forest">
          {pick(product.nameFr, product.nameEn, locale)}
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={averageRating} size="sm" />
            <span className="text-xs text-ink/50">({reviews.length})</span>
          </div>
        )}
        <p className="text-sm text-ink/60">
          {t("from")} {formatPrice(minPrice, locale, product.currency)}
        </p>
      </div>
    </Link>
  );
}
