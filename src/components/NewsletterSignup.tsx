"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function NewsletterSignup({ className = "" }: { className?: string }) {
  const t = useTranslations("Newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className={`text-sm font-medium text-gold ${className}`}>{t("success")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="text-xs font-semibold uppercase tracking-wide text-cream/70">
        {t("signupLabel")}
      </label>
      <p className="mt-1 text-sm text-cream/70">{t("signupHint")}</p>
      <div className="mt-3 flex max-w-sm gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="min-w-0 flex-1 rounded-full border border-cream/25 bg-forest-light/40 px-4 py-2 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-forest transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? t("submitting") : t("submit")}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-rust">{t("error")}</p>
      )}
    </form>
  );
}
