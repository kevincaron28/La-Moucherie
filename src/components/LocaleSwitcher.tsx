"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-forest/30">/</span>}
          <button
            type="button"
            onClick={() =>
              router.replace(
                // @ts-expect-error -- params shape varies by route
                { pathname, params },
                { locale: loc }
              )
            }
            className={
              loc === locale
                ? "text-rust underline underline-offset-4"
                : "text-forest/70 hover:text-forest"
            }
            aria-current={loc === locale}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
