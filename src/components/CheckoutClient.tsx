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
import { SHIPPING_FLAT_CENTS } from "@/lib/constants";
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
  province: "",
  postalCode: "",
  country: "CA",
};

export function CheckoutClient() {
  const t = useTranslations("Checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { items, subtotalCents } = useCart();
  const { status: sessionStatus } = useSession();

  const [form, setForm] = useState<ShippingForm>(emptyForm);

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
          province: f.province || profile.shippingProvince || "",
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

  const total = subtotalCents + SHIPPING_FLAT_CENTS;

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
                <Field
                  label={t("province")}
                  value={form.province}
                  onChange={(v) => update("province", v)}
                  required
                />
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
                    className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
                  >
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>
            </fieldset>

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

      <aside className="h-fit rounded-2xl border border-forest/10 bg-cream/60 p-6">
        <h2 className="font-display font-semibold text-forest">{t("orderSummary")}</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {pick(item.nameFr, item.nameEn, locale)} &times; {item.quantity}
              </span>
              <span className="font-medium text-forest">
                {formatPrice(item.unitPriceCents * item.quantity, locale)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-forest/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>{t("shipping")}</span>
            <span>{formatPrice(SHIPPING_FLAT_CENTS, locale)}</span>
          </div>
          <div className="flex justify-between font-display text-base font-semibold text-forest">
            <span>{t("total")}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        </div>
        <TrustBadges className="mt-6 border-t border-forest/10 pt-4" />
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
        className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
      />
    </div>
  );
}
