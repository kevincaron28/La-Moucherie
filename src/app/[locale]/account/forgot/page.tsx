"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations("Account");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "limited" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.status === 429) {
        setStatus("limited");
        return;
      }
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">
        {t("forgotTitle")}
      </h1>
      <p className="mt-2 text-ink/70">{t("forgotSubtitle")}</p>

      {status === "sent" ? (
        <p className="mt-8 rounded-2xl border border-forest/10 bg-cream/50 p-6 text-sm font-medium text-forest">
          {t("resetEmailSent")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-forest">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
            />
          </div>

          {status === "limited" && (
            <p className="text-sm text-rust">{t("rateLimited")}</p>
          )}
          {status === "error" && <p className="text-sm text-rust">{t("errorGeneric")}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("sendResetLink")}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link
          href="/account/login"
          className="font-medium text-rust hover:text-rust-dark"
        >
          {t("backToSignIn")}
        </Link>
      </p>
    </div>
  );
}
