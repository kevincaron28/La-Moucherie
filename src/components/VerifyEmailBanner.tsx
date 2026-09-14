"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function VerifyEmailBanner({ email }: { email: string }) {
  const t = useTranslations("Account");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  return (
    <div className="mt-6 rounded-2xl border border-rust/30 bg-rust/5 px-5 py-4">
      <p className="text-sm text-ink/80">{t("verifyBanner", { email })}</p>
      {state === "sent" ? (
        <p className="mt-2 text-sm font-medium text-forest">{t("verifyResent")}</p>
      ) : (
        <button
          type="button"
          disabled={state === "sending"}
          onClick={async () => {
            setState("sending");
            await fetch("/api/auth/resend-verification", { method: "POST" }).catch(
              () => {}
            );
            setState("sent");
          }}
          className="mt-2 text-sm font-semibold text-rust underline underline-offset-2 disabled:opacity-60"
        >
          {state === "sending" ? t("sending") : t("verifyResend")}
        </button>
      )}
    </div>
  );
}
