"use client";

import { useLocale, useTranslations } from "next-intl";

export function SearchBox({
  className = "",
  defaultQuery = "",
}: {
  className?: string;
  defaultQuery?: string;
}) {
  const t = useTranslations("Nav");
  const locale = useLocale();

  return (
    <form action={`/${locale}/shop`} method="GET" className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        {t("search")}
      </label>
      <input
        id="site-search"
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-full border border-forest/20 bg-parchment py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-forest"
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
      </svg>
    </form>
  );
}
