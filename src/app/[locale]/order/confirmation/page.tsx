"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

type OrderData = {
  id: string;
  status: string;
  amountTotalCents: number;
  currency: string;
  items: {
    nameSnapshotFr: string;
    nameSnapshotEn: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const t = useTranslations("OrderConfirmation");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const { clear } = useCart();

  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let attempts = 0;
    const secret = clientSecret;

    async function poll() {
      const query = secret
        ? `?payment_intent_client_secret=${encodeURIComponent(secret)}`
        : "";
      const res = await fetch(`/api/orders/${orderId}${query}`);
      if (cancelled || !res.ok) return;
      const data: OrderData = await res.json();
      setOrder(data);
      attempts += 1;
      if (data.status === "PENDING" && attempts < 5) {
        setTimeout(poll, 1500);
      }
    }
    poll();

    return () => {
      cancelled = true;
    };
  }, [orderId, clientSecret]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-3 text-ink/70">{t("subtitle")}</p>

      {order && (
        <div className="mt-8 rounded-2xl border border-forest/10 bg-cream/60 p-6 text-left">
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {t("orderNumber")}
          </p>
          <p className="font-mono text-sm text-forest">{order.id}</p>
          <ul className="mt-4 space-y-2 border-t border-forest/10 pt-4">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {pick(item.nameSnapshotFr, item.nameSnapshotEn, locale)} &times;{" "}
                  {item.quantity}
                </span>
                <span className="font-medium text-forest">
                  {formatPrice(item.unitPriceCents * item.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-forest/10 pt-4 font-display font-semibold text-forest">
            <span>{formatPrice(order.amountTotalCents, locale, order.currency)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-full border border-forest/25 px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest/50"
        >
          {t("backHome")}
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
