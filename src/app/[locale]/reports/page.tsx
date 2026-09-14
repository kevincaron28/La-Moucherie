import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reports");

  const reports = await prisma.fishingReport.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { water: { select: { slug: true, nameFr: true, nameEn: true } } },
    take: 30,
  });

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-ink/70">{t("intro")}</p>

      {reports.length === 0 ? (
        <p className="mt-10 text-ink/60">{t("empty")}</p>
      ) : (
        <ul className="mt-10 divide-y divide-forest/10 border-y border-forest/10">
          {reports.map((r) => (
            <li key={r.id} className="py-5">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                {dateFormatter.format(r.publishedAt)}
                {r.water && ` · ${pick(r.water.nameFr, r.water.nameEn, locale)}`}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-forest">
                <Link href={`/reports/${r.slug}`} className="hover:text-rust">
                  {pick(r.titleFr, r.titleEn, locale)}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-ink/70">
                {pick(r.conditionsFr, r.conditionsEn, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
