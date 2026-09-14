import { getTranslations, setRequestLocale } from "next-intl/server";
import { formatPrice } from "@/lib/format";
import {
  LETTER_RATE_CENTS,
  TRACKED_RATE_BY_ZONE_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/lib/shipping";
import type { Locale } from "@/i18n/routing";

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Shipping");

  // Prices come from the same module the checkout charges from, so this page
  // can't drift out of date the way copied-in numbers would.
  const letter = formatPrice(LETTER_RATE_CENTS, locale);
  const rates = Object.values(TRACKED_RATE_BY_ZONE_CENTS);
  const tracked = `${formatPrice(Math.min(...rates), locale)} – ${formatPrice(
    Math.max(...rates),
    locale
  )}`;
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-6 text-ink/75">{t("intro")}</p>

      <h2 className="mt-10 font-display text-xl font-semibold text-forest">
        {t("optionsTitle")}
      </h2>
      <dl className="mt-4 space-y-4">
        <div className="rounded-lg border border-forest/15 bg-cream/40 px-4 py-3">
          <dt className="flex justify-between text-sm font-medium text-forest">
            <span>{t("letterTitle")}</span>
            <span>{letter}</span>
          </dt>
          <dd className="mt-1 text-sm text-ink/70">{t("letterBody")}</dd>
        </div>
        <div className="rounded-lg border border-forest/15 bg-cream/40 px-4 py-3">
          <dt className="flex justify-between text-sm font-medium text-forest">
            <span>{t("trackedTitle")}</span>
            <span>{tracked}</span>
          </dt>
          <dd className="mt-1 text-sm text-ink/70">{t("trackedBody")}</dd>
          <dd className="mt-1 text-xs text-ink/55">{t("trackedZoneNote")}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-ink/75">{t("freeNote", { amount: threshold })}</p>

      <h2 className="mt-10 font-display text-xl font-semibold text-forest">
        {t("returnsTitle")}
      </h2>
      <p className="mt-4 text-ink/75">{t("returnsBody")}</p>
    </div>
  );
}
