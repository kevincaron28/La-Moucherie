import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Wholesale" });
  return { title: t("title"), description: t("intro") };
}

export default async function WholesalePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Wholesale");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-4 text-ink/75">{t("intro")}</p>
      <p className="mt-4 text-ink/75">{t("who")}</p>

      <div className="mt-8 rounded-2xl border border-forest/15 bg-cream/40 p-6">
        <p className="text-sm text-ink/70">{t("cta")}</p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("contactCta")}
        </Link>
      </div>
    </div>
  );
}
