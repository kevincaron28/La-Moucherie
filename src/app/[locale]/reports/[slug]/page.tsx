import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const report = await prisma.fishingReport.findUnique({ where: { slug } });
  if (!report || !report.published) return {};
  return {
    title: `${pick(report.titleFr, report.titleEn, locale)} — La Moucherie`,
    description: pick(report.conditionsFr, report.conditionsEn, locale).slice(0, 160),
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reports");

  const report = await prisma.fishingReport.findUnique({
    where: { slug },
    include: {
      water: { select: { slug: true, nameFr: true, nameEn: true } },
      products: {
        where: { active: true },
        include: {
          variants: { orderBy: { createdAt: "asc" } },
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
      },
    },
  });

  if (!report || !report.published) notFound();

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/reports" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToReports")}
      </Link>

      <p className="mt-4 text-xs uppercase tracking-wide text-ink/50">
        {dateFormatter.format(report.publishedAt)}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        {pick(report.titleFr, report.titleEn, locale)}
      </h1>
      {report.water && (
        <Link
          href={`/shop/water/${report.water.slug}`}
          className="mt-2 inline-block text-sm text-rust underline underline-offset-2"
        >
          {pick(report.water.nameFr, report.water.nameEn, locale)}
        </Link>
      )}

      <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 px-5 py-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest">
          {t("conditions")}
        </h2>
        <p className="mt-1 text-ink/75">
          {pick(report.conditionsFr, report.conditionsEn, locale)}
        </p>
      </div>

      <div className="mt-6 whitespace-pre-line text-ink/80">
        {pick(report.bodyFr, report.bodyEn, locale)}
      </div>

      {report.products.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-forest">
            {t("whatsWorking")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {report.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
