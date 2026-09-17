import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { HATCHES } from "@/lib/hatches";
import { chipClass } from "@/lib/chip";
import type { Locale } from "@/i18n/routing";

// No dynamic segment here, so this route would otherwise be fully static-
// generated at build time and frozen until the next deploy — wrong for a
// page whose whole content (published reports) is meant to change from the
// admin dashboard alone, with no code change or redeploy involved.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Reports" });
  return { title: t("title"), description: t("intro") };
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reports");
  const tHatch = await getTranslations("HatchReport");

  const [reports, hatchReports] = await Promise.all([
    prisma.fishingReport.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { water: { select: { slug: true, nameFr: true, nameEn: true } } },
      take: 30,
    }),
    prisma.hatchReport.findMany({
      where: { approved: true },
      orderBy: { observedOn: "desc" },
      take: 25,
      select: {
        id: true,
        anglerName: true,
        observedOn: true,
        hatchId: true,
        hookSize: true,
        intensity: true,
        note: true,
        fromShop: true,
        waterOther: true,
        water: { select: { nameFr: true, nameEn: true } },
        product: { select: { slug: true, nameFr: true, nameEn: true } },
      },
    }),
  ]);

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

      {/* Angler-submitted reports, kept visibly separate from the shop's own
          writing so the two voices aren't confused for one another. */}
      <section className="mt-16 border-t border-forest/15 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              {tHatch("sectionTitle")}
            </h2>
            <p className="mt-1 text-sm text-ink/65">{tHatch("sectionIntro")}</p>
          </div>
          <Link
            href="/reports/submit"
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-dark"
          >
            {tHatch("submitCta")}
          </Link>
        </div>

        {hatchReports.length === 0 ? (
          <p className="mt-8 text-sm text-ink/60">{tHatch("sectionEmpty")}</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {hatchReports.map((r) => {
              const hatch = HATCHES.find((h) => h.id === r.hatchId);
              const where =
                (r.water && pick(r.water.nameFr, r.water.nameEn, locale)) ||
                r.waterOther ||
                null;
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-forest/10 bg-cream/40 p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-display font-semibold text-forest">
                      {where ?? tHatch("unknownWater")}
                    </p>
                    <p className="text-xs text-ink/50">
                      {dateFormatter.format(r.observedOn)}
                    </p>
                  </div>

                  {(hatch || r.intensity || r.product) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {hatch && (
                        <span className={chipClass("solid")}>
                          {pick(hatch.nameFr, hatch.nameEn, locale)}
                          {r.hookSize ? ` #${r.hookSize}` : ""}
                        </span>
                      )}
                      {r.intensity && (
                        <span className={chipClass("outline")}>
                          {tHatch(`intensity${r.intensity}`)}
                        </span>
                      )}
                      {r.product && (
                        <Link href={`/shop/${r.product.slug}`} className={chipClass("accent")}>
                          {pick(r.product.nameFr, r.product.nameEn, locale)}
                        </Link>
                      )}
                    </div>
                  )}

                  {r.note && <p className="mt-3 text-sm text-ink/75">{r.note}</p>}

                  <p className="mt-3 text-xs text-ink/50">
                    {r.fromShop
                      ? tHatch("bylineShop")
                      : tHatch("byline", { name: r.anglerName })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
