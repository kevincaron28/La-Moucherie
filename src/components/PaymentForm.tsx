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

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? t("errorGeneric"));
      setSubmitting(false);
      return;
    }

    // Redirect-based methods come back to return_url with these appended by
    // Stripe. Cards resolve here without a redirect, so carry the client secret
    // over ourselves — the confirmation page uses it to prove a guest with no
    // account is the person who actually paid for this order.
    const url = new URL(returnUrl);
    if (paymentIntent?.client_secret) {
      url.searchParams.set("payment_intent_client_secret", paymentIntent.client_secret);
    }
    window.location.href = url.toString();
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
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/50">
        <LockIcon />
        {t("trustSecurePayment")}
      </p>
    </form>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
  );
}
