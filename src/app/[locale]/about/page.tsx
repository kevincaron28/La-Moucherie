import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title"), description: t("metaDescription") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const tHome = await getTranslations("Home");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-forest/10 shadow-xl shadow-forest/10">
          <Image
            src="/about/claudya-steelhead.jpg"
            alt={tHome("heroImageAlt")}
            fill
            sizes="(min-width: 768px) 32rem, 90vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
            {t("kicker")}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest sm:text-4xl">
            {t("title")}
          </h1>
          <blockquote className="mt-6 border-l-2 border-rust pl-5 font-display text-lg italic leading-snug text-forest">
            {t("quote")}
          </blockquote>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl space-y-6 text-ink/80">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
      </div>
    </div>
  );
}
