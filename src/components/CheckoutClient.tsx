"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe-client";
import { PaymentForm } from "@/components/PaymentForm";
import { TrustBadges } from "@/components/TrustBadges";
import {
  discountCents as computeDiscount,
  eligibleQuantity,
  eligibleSubtotalCents,
  totalQuantity,
  tierFor,
  nextTier,
} from "@/lib/discount";
import {
  PROVINCES,
  isProvinceCode,
  rateFor,
  FREE_SHIPPING_THRESHOLD_CENTS,
  shippingCostCents,
  effectiveMethod,
  isFreeShipping,
  type ShippingMethod,
} from "@/lib/shipping";
import type { Locale } from "@/i18n/routing";

type ShippingForm = {
  email: string;
  customerName: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

const emptyForm: ShippingForm = {
  email: "",
  customerName: "",
  line1: "",
  line2: "",
  city: "",
  province: "QC",
  postalCode: "",
  country: "CA",
};

export type Suggestion = {
  productId: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  category: string;
  image: string;
  variantId: string;
  variantNameFr: string;
  variantNameEn: string;
  sku: string;
  unitPriceCents: number;
};

export function CheckoutClient({ suggestions = [] }: { suggestions?: Suggestion[] }) {
  const t = useTranslations("Checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { items, subtotalCents, addItem } = useCart();
  const { status: sessionStatus } = useSession();

  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("LETTER");
  const [notes, setNotes] = useState("");
  // A live Canada Post quote for the tracked option. Stored with the inputs it
  // was fetched for, so a stale quote is ignored by comparison rather than
  // cleared from an effect — changing the postal code shouldn't need a render
  // pass just to forget the previous answer.
  const [liveRate, setLiveRate] = useState<{
    key: string;
    cents: number;
    source: string;
    serviceName?: string;
  } | null>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    let cancelled = false;

    fetch("/api/account/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (cancelled || !profile) return;
        setForm((f) => ({
          ...f,
          email: f.email || profile.email || "",
          customerName: f.customerName || profile.name || "",
          line1: f.line1 || profile.shippingLine1 || "",
          line2: f.line2 || profile.shippingLine2 || "",
          city: f.city || profile.shippingCity || "",
          // Addresses saved before provinces became a fixed list may hold free
          // text ("Québec"), which no option matches — keep the default instead
          // of leaving the select showing something the form can't submit.
          province: isProvinceCode(profile.shippingProvince)
            ? profile.shippingProvince
            : f.province,
          postalCode: f.postalCode || profile.shippingPostalCode || "",
          country: profile.shippingCountry || f.country,
        }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amountTotalCents, setAmountTotalCents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Curated boxes are already priced as a bundle, so they sit outside the tiers.
  const flyCount = eligibleQuantity(items);
  // Packaging follows everything in the box, assortments included — a curated
  // box of twelve still weighs twelve flies even though it skips the tiers.
  const parcelFlyCount = totalQuantity(items);
  const discount = computeDiscount(eligibleSubtotalCents(items), flyCount);
  const tier = tierFor(flyCount);
  const upcoming = nextTier(flyCount);
  const discountedSubtotal = subtotalCents - discount;

  const freeShipping = isFreeShipping(discountedSubtotal);
  const chosenMethod = effectiveMethod(shippingMethod, discountedSubtotal);

  const quoteKey = `${form.province}:${form.postalCode
    .trim()
    .toUpperCase()
    .replace(/\s/g, "")}:${parcelFlyCount}`;

  // A quote fetched for different inputs is simply not applicable, rather than
  // something an effect has to clear.
  const applicableLiveRate =
    liveRate && liveRate.key === quoteKey && !freeShipping ? liveRate : null;

  const zoneShippingCents = shippingCostCents(
    chosenMethod,
    discountedSubtotal,
    form.province
  );
  const shippingCents =
    chosenMethod === "TRACKED" && applicableLiveRate
      ? applicableLiveRate.cents
      : zoneShippingCents;
  const total = discountedSubtotal + shippingCents;
  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - discountedSubtotal;

  const postalReady = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(
    form.postalCode.trim()
  );

  useEffect(() => {
    if (!postalReady || shippingMethod !== "TRACKED" || freeShipping) return;
    let cancelled = false;
    // Debounced: the postal code fires this on every keystroke otherwise, and
    // each miss is an upstream API call.
    const timer = setTimeout(() => {
      fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "TRACKED",
          province: form.province,
          postalCode: form.postalCode.trim(),
          flyCount: Math.max(1, parcelFlyCount),
          subtotalCents: discountedSubtotal,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled && data && typeof data.cents === "number") {
            setLiveRate({ ...data, key: quoteKey });
          }
        })
        .catch(() => {});
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    postalReady,
    quoteKey,
    form.postalCode,
    form.province,
    shippingMethod,
    freeShipping,
    parcelFlyCount,
    discountedSubtotal,
  ]);

  const inCart = new Set(items.map((i) => i.variantId));
  const offers = suggestions
    .filter((s) => !inCart.has(s.variantId))
    .sort((a, b) => {
      const boxA = a.category === "ASSORTMENT" ? 0 : 1;
      const boxB = b.category === "ASSORTMENT" ? 0 : 1;
      return boxA - boxB;
    })
    .slice(0, 3);

  function update<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          email: form.email,
          customerName: form.customerName,
          shipping: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
            country: form.country,
          },
          shippingMethod: chosenMethod,
          notes: notes.trim() || undefined,
          locale,
        }),
      });

      if (!res.ok) {
        setError(t("errorGeneric"));
        setLoading(false);
        return;
      }

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setAmountTotalCents(total);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-ink/60">{t("emptyCartRedirect")}</p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="mt-6 rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("title")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr]">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>

        {!clientSecret ? (
          <form onSubmit={handleContinue} className="mt-6 space-y-6">
            <fieldset className="space-y-3">
              <legend className="font-display font-semibold text-forest">
                {t("contactTitle")}
              </legend>
              <Field
                label={t("email")}
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
              />
              <Field
                label={t("fullName")}
                value={form.customerName}
                onChange={(v) => update("customerName", v)}
                required
              />
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="font-display font-semibold text-forest">
                {t("shippingTitle")}
              </legend>
              <Field
                label={t("addressLine1")}
                value={form.line1}
                onChange={(v) => update("line1", v)}
                required
              />
              <Field
                label={t("addressLine2")}
                value={form.line2}
                onChange={(v) => update("line2", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t("city")}
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  required
                />
                <div>
                  <label className="text-sm font-medium text-forest">
                    {t("province")}
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => update("province", e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {locale === "fr" ? p.nameFr : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t("postalCode")}
                  value={form.postalCode}
                  onChange={(v) => update("postalCode", v)}
                  required
                />
                <div>
                  <label className="text-sm font-medium text-forest">
                    {t("country")}
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
                  >
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="font-display font-semibold text-forest">
                {t("shippingMethod")}
              </legend>
              {freeShipping ? (
                <p className="rounded-lg border border-halo/30 bg-halo/5 px-4 py-3 text-sm text-ink/80">
                  {t("shippingFreeApplied")}
                </p>
              ) : (
                (["LETTER", "TRACKED"] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                      shippingMethod === method
                        ? "border-halo bg-halo/5"
                        : "border-forest/20 hover:border-forest/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method}
                      checked={shippingMethod === method}
                      onChange={() => setShippingMethod(method)}
                      className="mt-1 accent-halo"
                    />
                    <span className="flex-1">
                      <span className="flex justify-between gap-3">
                        <span className="text-sm font-medium text-forest">
                          {t(method === "LETTER" ? "shippingLetter" : "shippingTracked")}
                        </span>
                        <span className="text-sm font-medium text-forest">
                          {method === "TRACKED" && applicableLiveRate
                            ? formatPrice(applicableLiveRate.cents, locale)
                            : formatPrice(rateFor(method, form.province), locale)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-ink/60">
                        {t(
                          method === "LETTER"
                            ? "shippingLetterHint"
                            : "shippingTrackedHint"
                        )}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </fieldset>

            <div>
              <label className="font-display font-semibold text-forest">
                {t("notesLabel")}
              </label>
              <p className="mt-1 text-xs text-ink/55">{t("notesHint")}</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={3}
                className="mt-2 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>

            {error && <p className="text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest py-3 text-sm font-semibold text-cream transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t("processing") : t("paymentTitle")}
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <h2 className="font-display font-semibold text-forest">
              {t("paymentTitle")}
            </h2>
            <Elements
              stripe={getStripe()}
              options={{ clientSecret, locale: locale === "fr" ? "fr-CA" : "en" }}
            >
              <PaymentForm
                amountTotalCents={amountTotalCents}
                returnUrl={`${window.location.origin}/${locale}/order/confirmation?order=${orderId}`}
              />
            </Elements>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-6">
      {offers.length > 0 && !clientSecret && (
        <div className="rounded-2xl border border-forest/10 bg-parchment p-6">
          <h2 className="font-display font-semibold text-forest">{t("addToOrder")}</h2>
          <p className="mt-1 text-xs text-ink/55">{t("addToOrderHint")}</p>
          <ul className="mt-4 space-y-3">
            {offers.map((s) => (
              <li key={s.variantId} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg border border-forest/10 bg-cream/50 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-forest">
                    {pick(s.nameFr, s.nameEn, locale)}
                  </p>
                  <p className="text-xs text-ink/55">
                    {formatPrice(s.unitPriceCents, locale)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem(
                      {
                        productId: s.productId,
                        variantId: s.variantId,
                        slug: s.slug,
                        nameFr: s.nameFr,
                        nameEn: s.nameEn,
                        variantNameFr: s.variantNameFr,
                        variantNameEn: s.variantNameEn,
                        sku: s.sku,
                        category: s.category,
                        unitPriceCents: s.unitPriceCents,
                        image: s.image,
                      },
                      1
                    )
                  }
                  className="shrink-0 rounded-full border border-forest/25 px-3 py-1.5 text-xs font-semibold text-forest transition hover:border-forest/60 hover:bg-forest/5"
                >
                  {t("addOne")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-forest/10 bg-cream/60 p-6">
        <h2 className="font-display font-semibold text-forest">{t("orderSummary")}</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {pick(item.nameFr, item.nameEn, locale)}
                {(item.variantNameFr || item.variantNameEn) && (
                  <span className="text-ink/50">
                    {" "}
                    ({pick(item.variantNameFr, item.variantNameEn, locale)})
                  </span>
                )}{" "}
                &times; {item.quantity}
              </span>
              <span className="font-medium text-forest">
                {formatPrice(item.unitPriceCents * item.quantity, locale)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-forest/10 pt-4 text-sm">
          {discount > 0 && tier && (
            <div className="flex justify-between text-halo">
              <span>{t("bulkDiscount", { percent: tier.percent })}</span>
              <span>-{formatPrice(discount, locale)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink/70">
            <span>{t("shipping")}</span>
            <span>
              {freeShipping ? (
                <span className="font-medium text-halo">{t("shippingFree")}</span>
              ) : (
                formatPrice(shippingCents, locale)
              )}
            </span>
          </div>
          {!freeShipping && remainingForFree > 0 && (
            <p className="text-xs text-ink/55">
              {t("freeShippingHint", {
                amount: formatPrice(remainingForFree, locale),
              })}
            </p>
          )}
          {upcoming && (
            <p className="text-xs text-ink/55">
              {t("bulkHint", {
                count: upcoming.minQuantity - flyCount,
                percent: upcoming.percent,
              })}
            </p>
          )}
          <div className="flex justify-between font-display text-base font-semibold text-forest">
            <span>{t("total")}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        </div>
        <TrustBadges className="mt-6 border-t border-forest/10 pt-4" />
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-forest">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
      />
    </div>
  );
}
