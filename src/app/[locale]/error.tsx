"use client";

// Without this file, any thrown error in a page renders Next's own unstyled
// error screen on a live storefront. That is not hypothetical here: this README
// documents a real window after a migration where the pooled connection 500s on
// a column that does exist, and the fix is to try again a minute later — which
// is exactly what this page tells someone to do, in their own language, instead
// of showing them a stack trace on a white background.
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    // The digest is what ties this to the server-side log entry; without it a
    // report of "the site broke" is unmatchable to anything.
    console.error("[render-error]", error.digest ?? "(no digest)", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-3 text-ink/70">{t("body")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-forest/25 px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest/50"
        >
          {t("home")}
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-ink/40">
          {t("reference")} {error.digest}
        </p>
      )}
    </div>
  );
}
