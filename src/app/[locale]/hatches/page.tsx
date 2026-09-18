import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { pick } from "@/lib/localize";
import {
  HATCHES,
  HATCH_GROUPS,
  HATCH_GROUP_KEY,
  dayRefFromDate,
  isActiveOn,
  isPeakingOn,
  sizeLabel,
  yearFraction,
  type DayRef,
  type Hatch,
} from "@/lib/hatches";
import { articleFor, say } from "@/lib/insect-articles";
import { chipClass } from "@/lib/chip";
import type { Locale } from "@/i18n/routing";

// The chart marks today's date and leads with what's on the water right now, so
// a build-time prerender would freeze both until the next deploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hatches" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const TIME_KEY: Record<Hatch["timeOfDay"], string> = {
  MORNING: "timeMorning",
  AFTERNOON: "timeAfternoon",
  EVENING: "timeEvening",
  NIGHT: "timeNight",
  ALL_DAY: "timeAllDay",
};

function MonthAxis({ locale }: { locale: Locale }) {
  const fmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    month: "narrow",
  });
  return (
    <div className="flex" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="flex-1 border-l border-forest/10 text-center text-[10px] font-semibold uppercase tracking-wide text-ink/40 first:border-l-0"
        >
          {fmt.format(new Date(2026, i, 1))}
        </div>
      ))}
    </div>
  );
}

function Bar({ hatch, today }: { hatch: Hatch; today: DayRef }) {
  const left = yearFraction(hatch.active.from) * 100;
  const width = (yearFraction(hatch.active.to) - yearFraction(hatch.active.from)) * 100;
  const todayLeft = yearFraction(today) * 100;

  return (
    <div className="relative h-5 w-full rounded bg-cream/60">
      {Array.from({ length: 11 }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 h-full border-l border-forest/10"
          style={{ left: `${((i + 1) / 12) * 100}%` }}
          aria-hidden
        />
      ))}

      <div
        className="absolute top-1 h-3 rounded-full bg-forest/20"
        style={{ left: `${left}%`, width: `${width}%` }}
      />

      {hatch.peaks.map((p, i) => {
        const pl = yearFraction(p.from) * 100;
        const pw = (yearFraction(p.to) - yearFraction(p.from)) * 100;
        return (
          <div
            key={i}
            className="absolute top-1 h-3 rounded-full bg-rust"
            style={{ left: `${pl}%`, width: `${pw}%` }}
          />
        );
      })}

      <div
        className="absolute -top-0.5 h-6 border-l-2 border-gold"
        style={{ left: `${todayLeft}%` }}
        aria-hidden
      />
    </div>
  );
}

export default async function HatchesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hatches");

  const today = dayRefFromDate(new Date());
  const rangeFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    month: "short",
    day: "numeric",
  });
  const formatRef = ([m, d]: DayRef) => rangeFmt.format(new Date(2026, m - 1, d));

  const slugs = [...new Set(HATCHES.flatMap((h) => h.patternSlugs))];
  const patterns = await prisma.product.findMany({
    where: { slug: { in: slugs }, active: true },
    select: { slug: true, nameFr: true, nameEn: true },
  });
  const bySlug = new Map(patterns.map((p) => [p.slug, p]));

  const peakingNow = HATCHES.filter((h) => isPeakingOn(h, today));
  const activeNow = HATCHES.filter((h) => isActiveOn(h, today) && !isPeakingOn(h, today));
  const groupsWithRows = HATCH_GROUPS.filter((g) => HATCHES.some((h) => h.group === g));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("intro")}</p>
      <p className="mt-2 max-w-2xl text-xs text-ink/50">{t("disclaimer")}</p>

      {/* What's on the water today — the reason this page is worth a bookmark. */}
      <section className="mt-8 rounded-2xl border border-forest/15 bg-cream/50 p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
          {t("nowTitle")}
        </h2>
        {peakingNow.length === 0 && activeNow.length === 0 ? (
          <p className="mt-3 text-sm text-ink/70">{t("nowEmpty")}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {peakingNow.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("nowPeak")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {peakingNow.map((h) => (
                    <a key={h.id} href={`#${h.id}`} className={chipClass("accent")}>
                      {pick(h.nameFr, h.nameEn, locale)} {sizeLabel(h.sizes)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {activeNow.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("nowActive")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeNow.map((h) => (
                    <a key={h.id} href={`#${h.id}`} className={chipClass("outline")}>
                      {pick(h.nameFr, h.nameEn, locale)} {sizeLabel(h.sizes)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink/60">
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded-full bg-forest/20" />
          {t("legendActive")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded-full bg-rust" />
          {t("legendPeak")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 border-l-2 border-gold" />
          {t("legendToday")}
        </span>
      </div>

      <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 border-b border-forest/10 pb-6 text-xs font-medium text-ink/50">
        {groupsWithRows.map((group) => (
          <a
            key={group}
            href={`#${group.toLowerCase()}`}
            className="underline-offset-2 hover:text-rust hover:underline"
          >
            {t(HATCH_GROUP_KEY[group])}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {groupsWithRows.map((group) => {
          const rows = HATCHES.filter((h) => h.group === group);
          return (
            <details key={group} id={group.toLowerCase()} className="group" open>
              <summary className="flex cursor-pointer list-none items-center gap-2 marker:hidden [&::-webkit-details-marker]:hidden">
                <h2 className="font-display text-xl font-semibold text-forest">
                  {t(HATCH_GROUP_KEY[group])}
                </h2>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              <div className="mt-4 hidden sm:grid sm:grid-cols-[13rem_1fr] sm:gap-4">
                <div />
                <MonthAxis locale={locale} />
              </div>

              <div className="mt-2 divide-y divide-forest/10 border-y border-forest/10">
                {rows.map((h) => {
                  const linked = h.patternSlugs
                    .map((s) => bySlug.get(s))
                    .filter((p): p is NonNullable<typeof p> => Boolean(p));
                  const peaking = isPeakingOn(h, today);
                  const article = articleFor(h.id);
                  return (
                    <article
                      key={h.id}
                      id={h.id}
                      className={`grid scroll-mt-24 gap-3 py-5 sm:grid-cols-[13rem_1fr] sm:gap-4 ${
                        peaking ? "bg-rust/5" : ""
                      }`}
                    >
                      <div>
                        <h3 className="font-display font-semibold text-forest">
                          {article ? (
                            <Link
                              href={`/hatches/${h.id}`}
                              className="underline decoration-forest/25 underline-offset-4 transition hover:text-rust hover:decoration-rust"
                            >
                              {pick(h.nameFr, h.nameEn, locale)}
                            </Link>
                          ) : (
                            pick(h.nameFr, h.nameEn, locale)
                          )}
                        </h3>
                        <p className="text-xs italic text-ink/50">{h.scientific}</p>
                        <p className="mt-1 text-xs font-medium text-ink/60">
                          {sizeLabel(h.sizes)} · {t(TIME_KEY[h.timeOfDay])}
                        </p>
                        {article && (
                          <p className="mt-1.5 flex gap-1.5 text-xs text-ink/55">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rust" aria-hidden />
                            <span>{say(article.idMarks[0], locale)}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <Bar hatch={h} today={today} />
                        <p className="mt-2 text-xs font-medium text-ink/55">
                          {formatRef(h.active.from)} – {formatRef(h.active.to)}
                          {h.peaks.length > 0 && (
                            <>
                              {" · "}
                              <span className="text-rust">
                                {t("peakShort")}{" "}
                                {h.peaks
                                  .map((p) => `${formatRef(p.from)} – ${formatRef(p.to)}`)
                                  .join(", ")}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="mt-2 text-sm text-ink/75">
                          {pick(h.noteFr, h.noteEn, locale)}
                        </p>
                        {linked.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                              {t("patternsLabel")}
                            </span>
                            {linked.map((p) => (
                              <Link
                                key={p.slug}
                                href={`/shop/${p.slug}`}
                                className={chipClass("accent")}
                              >
                                {pick(p.nameFr, p.nameEn, locale)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-ink/60">
        {t("reportsLinkIntro")}{" "}
        <Link href="/reports" className="text-rust underline underline-offset-2">
          {t("reportsLinkCta")}
        </Link>
      </p>
    </div>
  );
}
