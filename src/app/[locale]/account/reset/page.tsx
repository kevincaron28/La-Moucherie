"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const t = useTranslations("Account");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "invalid" | "limited" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.status === 429) return setStatus("limited");
      if (res.status === 400) return setStatus("invalid");
      if (!res.ok) throw new Error();
      setStatus("success");
      setPassword("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">
        {t("resetTitle")}
      </h1>

      {!token || status === "invalid" ? (
        <>
          <p className="mt-4 text-sm text-rust">{t("resetInvalidToken")}</p>
          <p className="mt-6 text-sm">
            <Link
              href="/account/forgot"
              className="font-medium text-rust hover:text-rust-dark"
            >
              {t("forgotTitle")}
            </Link>
          </p>
        </>
      ) : status === "success" ? (
        <>
          <p className="mt-6 rounded-2xl border border-forest/10 bg-cream/50 p-6 text-sm font-medium text-forest">
            {t("resetSuccess")}
          </p>
          <p className="mt-6 text-center text-sm">
            <Link
              href="/account/login"
              className="font-medium text-rust hover:text-rust-dark"
            >
              {t("signIn")}
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-forest">
              {t("newPassword")}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
            />
            <p className="mt-1 text-xs text-ink/50">{t("passwordHint")}</p>
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
            {status === "sending" ? t("resetting") : t("resetSubmit")}
          </button>
        </form>
      )}
    </div>
  );
}
