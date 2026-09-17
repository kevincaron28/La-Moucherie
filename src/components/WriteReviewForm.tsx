"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRatingInput } from "@/components/StarRating";
import { SPECIES } from "@/lib/angling";
import type { ReviewEligibility } from "@/lib/review-eligibility";

export function WriteReviewForm({
  productId,
  eligibility,
}: {
  productId: string;
  eligibility: ReviewEligibility;
}) {
  const t = useTranslations("Reviews");
  const tAngling = useTranslations("Angling");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    rating: 0,
    title: "",
    body: "",
    speciesCaught: "",
    waterName: "",
    hookSize: "",
    conditions: "",
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
      setForm({
        rating: 0,
        title: "",
        body: "",
        speciesCaught: "",
        waterName: "",
        hookSize: "",
        conditions: "",
      });
    } catch {
      setStatus("error");
    }
  }

  if (eligibility === "signed_out") {
    return (
      <p className="text-sm text-ink/60">
        {t("signInToReview")}{" "}
        <Link
          href="/account/login"
          className="font-medium text-rust underline underline-offset-2 hover:text-rust-dark"
        >
          {t("signIn")}
        </Link>
      </p>
    );
  }

  if (eligibility === "already_reviewed" || status === "success") {
    return (
      <p className="text-sm font-medium text-forest">
        {status === "success" ? t("success") : t("alreadyReviewed")}
      </p>
    );
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
        <label className="text-sm font-medium text-forest">{t("reviewTitle")}</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-forest">{t("reviewBody")}</label>
        <textarea
          required
          rows={4}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-forest/10 bg-parchment/60 p-4">
        <div>
          <p className="text-sm font-medium text-forest">{t("catchDetailsTitle")}</p>
          <p className="text-xs text-ink/50">{t("catchDetailsHint")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-forest">{t("speciesCaught")}</label>
            <select
              value={form.speciesCaught}
              onChange={(e) => setForm((f) => ({ ...f, speciesCaught: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
            >
              <option value="">{t("speciesCaughtPlaceholder")}</option>
              {SPECIES.map((species) => (
                <option key={species} value={species}>
                  {tAngling(`species.${species}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-forest">{t("waterName")}</label>
            <input
              type="text"
              value={form.waterName}
              onChange={(e) => setForm((f) => ({ ...f, waterName: e.target.value }))}
              placeholder={t("waterNamePlaceholder")}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-halo"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-forest">{t("hookSize")}</label>
            <input
              type="text"
              value={form.hookSize}
              onChange={(e) => setForm((f) => ({ ...f, hookSize: e.target.value }))}
              placeholder={t("hookSizePlaceholder")}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-halo"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-forest">{t("conditions")}</label>
            <input
              type="text"
              value={form.conditions}
              onChange={(e) => setForm((f) => ({ ...f, conditions: e.target.value }))}
              placeholder={t("conditionsPlaceholder")}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-halo"
            />
          </div>
        </div>
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
