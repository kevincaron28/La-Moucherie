"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export function PaymentForm({
  amountTotalCents,
  returnUrl,
}: {
  amountTotalCents: number;
  returnUrl: string;
}) {
  const t = useTranslations("Checkout");
  const locale = useLocale() as Locale;
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? t("errorGeneric"));
      setSubmitting(false);
      return;
    }

    window.location.href = returnUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {error && <p className="mt-4 text-sm text-rust">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-6 w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? t("processing")
          : t("payButton", { amount: formatPrice(amountTotalCents, locale) })}
      </button>
    </form>
  );
}
