"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const t = useTranslations("Account");
  const token = useSearchParams().get("token");
  // A missing token is knowable at render time, so it's the initial state
  // rather than something an effect corrects a moment later.
  const [state, setState] = useState<"working" | "done" | "failed">(
    token ? "working" : "failed"
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!cancelled) setState(res.ok ? "done" : "failed");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-forest">
        {t("verifyTitle")}
      </h1>
      <p className="mt-3 text-ink/70">
        {state === "working"
          ? t("verifyWorking")
          : state === "done"
            ? t("verifyDone")
            : t("verifyFailed")}
      </p>
      {state !== "working" && (
        <Link
          href="/account"
          className="mt-6 inline-block rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("myAccount")}
        </Link>
      )}
    </div>
  );
}
