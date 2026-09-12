"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { StarRatingInput } from "@/components/StarRating";

export function WriteReviewForm({ productId }: { productId: string }) {
  const t = useTranslations("Reviews");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    rating: 0,
    title: "",
    body: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.rating < 1) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ customerName: "", email: "", rating: 0, title: "", body: "" });
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-forest/25 px-6 py-2.5 text-sm font-semibold text-forest transition hover:border-forest/50"
      >
        {t("writeReview")}
      </button>
    );
  }

  if (status === "success") {
    return <p className="text-sm font-medium text-forest">{t("success")}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4 rounded-2xl border border-forest/10 bg-cream/50 p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-forest">{t("writeReview")}</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink/50 hover:text-rust"
        >
          {t("hideForm")}
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("rating")}</label>
        <div className="mt-1">
          <StarRatingInput
            value={form.rating}
            onChange={(rating) => setForm((f) => ({ ...f, rating }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("yourName")}</label>
        <input
          type="text"
          required
          value={form.customerName}
          onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("yourEmail")}</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
        />
        <p className="mt-1 text-xs text-ink/50">{t("emailHint")}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("reviewTitle")}</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("reviewBody")}</label>
        <textarea
          required
          rows={4}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
        />
      </div>

      {status === "error" && <p className="text-sm text-rust">{t("error")}</p>}

      <button
        type="submit"
        disabled={status === "sending" || form.rating < 1}
        className="rounded-full bg-rust px-8 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
