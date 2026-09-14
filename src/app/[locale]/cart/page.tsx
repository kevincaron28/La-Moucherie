"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
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

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex items-center gap-4 text-lg">
          <span className="text-ink/70">{t("subtotal")}</span>
          <span className="font-display font-semibold text-forest">
            {formatPrice(subtotalCents, locale)}
          </span>
        </div>
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
