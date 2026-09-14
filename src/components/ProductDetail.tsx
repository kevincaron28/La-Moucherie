"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";
import type { Locale } from "@/i18n/routing";
import type { ProductWithVariants } from "@/components/ProductCard";

export function ProductDetail({
  product,
  reviewCount = 0,
  averageRating = 0,
}: {
  product: ProductWithVariants;
  reviewCount?: number;
  averageRating?: number;
}) {
  const t = useTranslations("Product");
  const tReviews = useTranslations("Reviews");
  const locale = useLocale() as Locale;
  const { addItem } = useCart();

  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  const priceCents = variant?.priceCents ?? product.basePriceCents;
  const inStock = (variant?.stock ?? 0) > 0;
  const image = product.images[0] ?? "/products/placeholder-fly.svg";

  function handleAddToCart() {
    if (!variant) return;
    addItem(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        nameFr: product.nameFr,
        nameEn: product.nameEn,
        variantNameFr: variant.nameFr,
        variantNameEn: variant.nameEn,
        sku: variant.sku,
        category: product.category,
        unitPriceCents: priceCents,
        image,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        <Image
          src={image}
          alt={pick(product.nameFr, product.nameEn, locale)}
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col">
        <h1 className="font-display text-3xl font-semibold text-forest">
          {pick(product.nameFr, product.nameEn, locale)}
        </h1>
        {reviewCount > 0 && (
          <a
            href="#reviews"
            className="mt-2 flex items-center gap-2 text-sm text-ink/60 hover:text-rust"
          >
            <StarRating value={averageRating} size="sm" />
            <span>{tReviews("basedOnCount", { count: reviewCount })}</span>
          </a>
        )}
        <p className="mt-2 text-xl font-medium text-rust">
          {formatPrice(priceCents, locale, product.currency)}
        </p>

        <p className="mt-6 whitespace-pre-line text-ink/75">
          {pick(product.descriptionFr, product.descriptionEn, locale)}
        </p>

        {product.variants.length > 1 && (
          <div className="mt-6">
            <label className="text-sm font-semibold text-forest">
              {t("chooseVariant")}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  disabled={v.stock <= 0}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    v.id === variantId
                      ? "border-forest bg-forest text-cream"
                      : "border-forest/25 text-forest hover:border-forest/60"
                  }`}
                >
                  {pick(v.nameFr, v.nameEn, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <label className="text-sm font-semibold text-forest" htmlFor="quantity">
            {t("quantity")}
          </label>
          <div className="flex items-center rounded-full border border-forest/25">
            <button
              type="button"
              aria-label="-"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 text-forest transition hover:text-rust"
            >
              &minus;
            </button>
            <span id="quantity" className="w-8 text-center text-sm font-medium text-forest">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="+"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="h-9 w-9 text-forest transition hover:text-rust"
            >
              +
            </button>
          </div>
          <span className="text-sm text-ink/60">
            {inStock ? t("inStock", { count: variant?.stock ?? 0 }) : t("outOfStock")}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="mt-8 w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:bg-forest/30 sm:w-auto sm:px-10"
        >
          {justAdded ? t("added") : t("addToCart")}
        </button>

        {variant && (
          <p className="mt-4 text-xs uppercase tracking-wide text-ink/40">
            {t("sku")}: {variant.sku}
          </p>
        )}
      </div>
    </div>
  );
}
