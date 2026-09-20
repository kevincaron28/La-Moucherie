import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

// Lists every named water from the database, so it must not be frozen at build
// time — adding a river would otherwise need a deploy to show up.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WaterPage" });
  return {
    title: t("indexMetaTitle"),
    description: t("indexMetaDescription"),
  };
}

export default async function WatersIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("WaterPage");

  const waters = await prisma.fishingWater.findMany({
    orderBy: [{ featured: "desc" }, { nameFr: "asc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/shop" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToShop")}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("indexTitle")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("indexIntro")}</p>

      {waters.length === 0 ? (
        <p className="mt-10 text-ink/60">{t("indexEmpty")}</p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {waters.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/shop/water/${w.slug}`}
                className="block rounded-xl border border-forest/15 bg-cream/40 p-5 transition hover:border-forest/40 hover:bg-cream/70"
              >
                <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {pick(w.regionFr, w.regionEn, locale)}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-forest">
                  {pick(w.nameFr, w.nameEn, locale)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/70">
                  {pick(w.descriptionFr, w.descriptionEn, locale)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
