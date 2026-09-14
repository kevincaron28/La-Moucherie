import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const waters = await prisma.fishingWater.findMany({ select: { slug: true } });
  return waters.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const water = await prisma.fishingWater.findUnique({ where: { slug } });
  if (!water) return {};
  const t = await getTranslations({ locale, namespace: "WaterPage" });
  const name = pick(water.nameFr, water.nameEn, locale);
  return {
    title: t("metaTitle", { water: name }),
    description: pick(water.descriptionFr, water.descriptionEn, locale).slice(0, 160),
  };
}

export default async function WaterPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("WaterPage");

  const water = await prisma.fishingWater.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: {
          variants: { orderBy: { createdAt: "asc" } },
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
        orderBy: [{ featured: "desc" }],
      },
      reports: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      },
    },
  });

  if (!water) notFound();

  const others = await prisma.fishingWater.findMany({
    where: { slug: { not: slug } },
    select: { slug: true, nameFr: true, nameEn: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/shop" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToShop")}
      </Link>

      <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold">
        {pick(water.regionFr, water.regionEn, locale)}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {pick(water.nameFr, water.nameEn, locale)}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/75">
        {pick(water.descriptionFr, water.descriptionEn, locale)}
      </p>

      <h2 className="mt-12 font-display text-xl font-semibold text-forest">
        {t("fliesFor", { water: pick(water.nameFr, water.nameEn, locale) })}
      </h2>
      {water.products.length === 0 ? (
        <p className="mt-4 text-ink/60">{t("empty")}</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {water.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {water.reports.length > 0 && (
        <section className="mt-14 border-t border-forest/10 pt-8">
          <h2 className="font-display text-xl font-semibold text-forest">
            {t("recentReports")}
          </h2>
          <ul className="mt-4 space-y-2">
            {water.reports.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/reports/${r.slug}`}
                  className="text-ink/75 underline decoration-forest/25 underline-offset-2 hover:text-forest hover:decoration-forest"
                >
                  {pick(r.titleFr, r.titleEn, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-14 border-t border-forest/10 pt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest">
          {t("otherWaters")}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {others.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/shop/water/${w.slug}`}
                className="text-ink/70 underline decoration-forest/20 underline-offset-2 hover:text-forest hover:decoration-forest"
              >
                {pick(w.nameFr, w.nameEn, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
