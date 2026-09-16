"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/format";
import {
  PROVINCES,
  LETTER_RATE_CENTS,
  LETTER_MAX_FLIES,
  canUseLetter,
  isFreeShipping,
} from "@/lib/shipping";
import type { Locale } from "@/i18n/routing";

type ServiceOption = {
  serviceCode: string;
  serviceName: string;
  cents: number;
  transitDays: number | null;
};

type QuoteResult = {
  key: string;
  cents: number;
  source: string;
  serviceName?: string;
  services?: ServiceOption[];
};

/**
 * A standalone "what would this cost to ship" widget — province + postal
 * code only, no name/email/address required. Lets someone check before
 * they've committed to checkout, unlike the live quote inside CheckoutClient
 * which is part of filling in the actual shipping address.
 */
export function ShippingEstimator({
  flyCount,
  subtotalCents,
}: {
  /** Total pieces in the parcel — decides packaging weight, same as checkout. */
  flyCount: number;
  /** Post-discount subtotal — decides whether free shipping applies. */
  subtotalCents: number;
}) {
  const t = useTranslations("ShippingEstimator");
  const locale = useLocale() as Locale;

  const [province, setProvince] = useState("QC");
  const [postalCode, setPostalCode] = useState("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const postalReady = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(
    postalCode.trim()
  );
  const key = `${province}:${postalCode
    .trim()
    .toUpperCase()
    .replace(/\s/g, "")}:${locale}`;

  useEffect(() => {
    // Nothing to reset here: an incomplete postal code just means `key`
    // won't match any previously-fetched quote, so the stale one is already
    // ignored below rather than needing to be cleared out.
    if (!postalReady) return;
    let cancelled = false;
    // Debounced, same reasoning as checkout: every keystroke would otherwise
    // be an upstream Canada Post call.
    const timer = setTimeout(() => {
      setLoading(true);
      setError(false);
      fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "TRACKED",
          province,
          postalCode: postalCode.trim(),
          flyCount: Math.max(1, flyCount),
          subtotalCents,
          locale,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled) return;
          if (data && typeof data.cents === "number") {
            setQuote({ ...data, key });
          } else {
            setError(true);
          }
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [postalReady, key, province, postalCode, flyCount, subtotalCents, locale]);

  const applicable = quote && quote.key === key ? quote : null;
  const services = applicable?.services ?? null;
  const free = isFreeShipping(subtotalCents);
  const letterEligible = canUseLetter(flyCount) && !free;

  return (
    <div className="rounded-2xl border border-forest/15 bg-cream/50 p-4">
      <h2 className="font-display text-sm font-semibold text-forest">{t("title")}</h2>
      <p className="mt-1 text-xs text-ink/55">{t("hint")}</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-forest">{t("province")}</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
          >
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {locale === "fr" ? p.nameFr : p.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-forest">{t("postalCode")}</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="J0L 2N0"
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
          />
        </div>
      </div>

      {!postalReady ? (
        <p className="mt-3 text-xs text-ink/50">{t("prompt")}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {loading && !applicable && (
            <p className="text-xs text-ink/50">{t("loading")}</p>
          )}

          {free && <p className="text-xs font-medium text-halo">{t("freeApplies")}</p>}

          {letterEligible && (
            <div className="flex items-center justify-between rounded-lg border border-forest/15 bg-parchment/60 px-3 py-2 text-sm">
              <span className="font-medium text-forest">{t("letter")}</span>
              <span className="font-medium text-forest">
                {formatPrice(LETTER_RATE_CENTS, locale)}
              </span>
            </div>
          )}
          {!canUseLetter(flyCount) && !free && (
            <p className="text-xs text-ink/50">
              {t("letterMaxHint", { max: LETTER_MAX_FLIES })}
            </p>
          )}

          {services && services.length > 0
            ? services.map((svc, idx) => {
                const svcFree = idx === 0 && free;
                return (
                  <div
                    key={svc.serviceCode}
                    className="flex items-center justify-between rounded-lg border border-forest/15 bg-parchment/60 px-3 py-2 text-sm"
                  >
                    <span>
                      <span className="block font-medium text-forest">
                        {svc.serviceName}
                      </span>
                      {svc.transitDays != null && (
                        <span className="block text-xs text-ink/55">
                          {t("transitDays", { days: svc.transitDays })}
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-forest">
                      {svcFree ? (
                        <span className="text-halo">{t("free")}</span>
                      ) : (
                        formatPrice(svc.cents, locale)
                      )}
                    </span>
                  </div>
                );
              })
            : applicable && (
                <div className="flex items-center justify-between rounded-lg border border-forest/15 bg-parchment/60 px-3 py-2 text-sm">
                  <span className="font-medium text-forest">{t("tracked")}</span>
                  <span className="font-medium text-forest">
                    {applicable.cents === 0 ? (
                      <span className="text-halo">{t("free")}</span>
                    ) : (
                      formatPrice(applicable.cents, locale)
                    )}
                  </span>
                </div>
              )}

          {error && <p className="text-xs text-rust">{t("errorGeneric")}</p>}
        </div>
      )}
    </div>
  );
}
