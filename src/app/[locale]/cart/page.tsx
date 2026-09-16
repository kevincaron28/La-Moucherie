"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import {
  discountCents as computeDiscount,
  totalFreeUnits,
  closestToNextDozen,
  totalQuantity,
  DOZEN_SIZE,
} from "@/lib/discount";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/shipping";
import { ShippingEstimator } from "@/components/ShippingEstimator";
import type { Locale } from "@/i18n/routing";

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartPageContent />
    </Suspense>
  );
}

function CartPageContent() {
  const t = useTranslations("Cart");
  const locale = useLocale() as Locale;
  const { items, removeItem, setQuantity, subtotalCents, mergeItems } = useCart();
  const recoverToken = useSearchParams().get("recover");

  // Packaging follows everything in the box, assortments included — same
  // distinction checkout makes between the dozen-deal count and the
  // shipping-weight count.
  const parcelFlyCount = totalQuantity(items);
  const discount = computeDiscount(items);
  const freeUnits = totalFreeUnits(items);
  // The single pattern closest to its next free pair — there's no point
  // nudging toward all of them at once.
  const dozenHint = closestToNextDozen(items);
  const dozenHintItem = dozenHint
    ? items.find((i) => i.productId === dozenHint.productId)
    : null;
  const discountedSubtotal = subtotalCents - discount;
  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - discountedSubtotal;
  const freePercent = Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100));
  const dozenProgressPercent = dozenHint
    ? Math.round(((DOZEN_SIZE - dozenHint.remaining) / DOZEN_SIZE) * 100)
    : freeUnits > 0
      ? 100
      : 0;

  // Arriving from an abandoned-cart email: rebuild the basket from the order,
  // re-priced against today's catalogue rather than the old snapshot.
  useEffect(() => {
    if (!recoverToken) return;
    let cancelled = false;
    fetch(`/api/cart/recover?token=${encodeURIComponent(recoverToken)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.items?.length) mergeItems(data.items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [recoverToken, mergeItems]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-forest">{t("title")}</h1>
        <p className="mt-3 text-ink/60">{t("empty")}</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-forest/15 bg-cream/50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-forest">
            <span>
              {dozenHint && dozenHintItem
                ? t("dozenDealProgress", {
                    count: dozenHint.remaining,
                    pattern: pick(dozenHintItem.nameFr, dozenHintItem.nameEn, locale),
                  })
                : freeUnits > 0
                  ? t("dozenDealApplied", { count: freeUnits })
                  : t("dozenDealIntro")}
            </span>
            {dozenHint && (
              <span className="font-mono text-ink/60">
                {DOZEN_SIZE - dozenHint.remaining}/{DOZEN_SIZE}
              </span>
            )}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className="h-full bg-rust transition-all duration-500 ease-out"
              style={{ width: `${dozenProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-forest/15 bg-cream/50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-forest">
            <span>
              {remainingForFree <= 0
                ? t("freeShippingQualified")
                : t("freeShippingProgress", {
                    amount: formatPrice(remainingForFree, locale),
                  })}
            </span>
            <span className="font-mono text-ink/60">{freePercent}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className="h-full bg-forest transition-all duration-500 ease-out"
              style={{ width: `${freePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ShippingEstimator flyCount={parcelFlyCount} subtotalCents={discountedSubtotal} />
      </div>

      <div className="mt-8 divide-y divide-forest/10 border-y border-forest/10">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
              <Image
                src={item.image}
                alt={pick(item.nameFr, item.nameEn, locale)}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/shop/${item.slug}`}
                className="font-display font-semibold text-forest hover:text-rust"
              >
                {pick(item.nameFr, item.nameEn, locale)}
              </Link>
              <p className="text-sm text-ink/60">
                {pick(item.variantNameFr, item.variantNameEn, locale)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.variantId)}
                className="mt-1 text-xs font-medium text-rust/80 underline underline-offset-2 hover:text-rust"
              >
                {t("remove")}
              </button>
            </div>
            <div className="flex items-center rounded-full border border-forest/25">
              <button
                type="button"
                aria-label="-"
                onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                className="h-8 w-8 text-forest transition hover:text-rust"
              >
                &minus;
              </button>
              <span className="w-7 text-center text-sm font-medium text-forest">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="+"
                onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                className="h-8 w-8 text-forest transition hover:text-rust"
              >
                +
              </button>
            </div>
            <p className="w-24 shrink-0 text-right font-medium text-forest">
              {formatPrice(item.unitPriceCents * item.quantity, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3">
        {discount > 0 ? (
          <>
            <div className="flex items-center gap-4 text-sm text-ink/70">
              <span>{t("subtotal")}</span>
              <span className="line-through">{formatPrice(subtotalCents, locale)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-rust">
              <span>{t("dozenDealApplied", { count: freeUnits })}</span>
              <span>-{formatPrice(discount, locale)}</span>
            </div>
            <div className="flex items-center gap-4 text-xl font-semibold text-forest border-t border-forest/10 pt-2">
              <span>{t("subtotal")}</span>
              <span className="font-display">
                {formatPrice(discountedSubtotal, locale)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 text-lg">
            <span className="text-ink/70">{t("subtotal")}</span>
            <span className="font-display font-semibold text-forest">
              {formatPrice(subtotalCents, locale)}
            </span>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/shop"
            className="rounded-full border border-forest/25 px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest/50"
          >
            {t("continueShopping")}
          </Link>
          <Link
            href="/checkout"
            className="rounded-full bg-rust px-8 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
          >
            {t("checkoutCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
