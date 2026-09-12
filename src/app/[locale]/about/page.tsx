import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/brand/logo-512.png"
          alt="La Moucherie"
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-gold/30"
        />
        <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-rust">
          {t("kicker")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-forest sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      <div className="mt-10 space-y-6 text-ink/80">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
      </div>

      <blockquote className="mt-12 border-l-2 border-rust pl-6 font-display text-xl italic text-forest">
        {t("quote")}
      </blockquote>
    </div>
  );
}
