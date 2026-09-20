import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { routing, type Locale } from "@/i18n/routing";
import { HATCHES, sizeLabel, type Hatch } from "@/lib/hatches";
import { INSECT_ARTICLES, articleFor, say } from "@/lib/insect-articles";
import { chipClass } from "@/lib/chip";
import { InsectIcon } from "@/components/InsectIcon";

// These are the pages meant to be found in search, so they're prerendered for
// both locales rather than waiting on a first request to exist. The prose is
// static, but the pattern links are read from the catalogue, so revalidate
// hourly rather than letting a renamed or retired product linger until a deploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    INSECT_ARTICLES.map((a) => ({ locale, id: a.hatchId }))
  );
}

const TIME_KEY: Record<Hatch["timeOfDay"], string> = {
  MORNING: "timeMorning",
  AFTERNOON: "timeAfternoon",
  EVENING: "timeEvening",
  NIGHT: "timeNight",
  ALL_DAY: "timeAllDay",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const article = articleFor(id);
  if (!article) return {};
  return {
    title: say(article.metaTitle, locale),
    description: say(article.metaDescription, locale),
  };
}

export default async function InsectPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = articleFor(id);
  const hatch = HATCHES.find((h) => h.id === id);
  if (!article || !hatch) notFound();

  const t = await getTranslations("Hatches");
  const fr = locale === "fr";

  const rangeFmt = new Intl.DateTimeFormat(fr ? "fr-CA" : "en-CA", {
    month: "short",
    day: "numeric",
  });
  const formatRef = ([m, d]: readonly [number, number]) =>
    rangeFmt.format(new Date(2026, m - 1, d));

  const slugs = [...new Set(article.stages.flatMap((s) => s.patternSlugs))];
  const patterns = await prisma.product.findMany({
    where: { slug: { in: slugs }, active: true },
    select: { slug: true, nameFr: true, nameEn: true },
  });
  const bySlug = new Map(patterns.map((p) => [p.slug, p]));

  const name = pick(hatch.nameFr, hatch.nameEn, locale);

  // Article schema: these pages exist to be found, so give search engines the
  // shape rather than making them infer it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: say(article.metaTitle, locale),
    description: say(article.metaDescription, locale),
    about: { "@type": "Thing", name: hatch.scientific },
    inLanguage: fr ? "fr-CA" : "en-CA",
    publisher: { "@type": "Organization", name: "La Moucherie" },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/hatches" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToChart")}
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <InsectIcon hatchId={hatch.id} size="lg" title={name} />
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
            {name}
          </h1>
          <p className="mt-1 text-lg italic text-ink/50">{hatch.scientific}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-forest/15 bg-cream/40 p-5 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t("factSize")}
          </dt>
          <dd className="mt-0.5 font-medium text-forest">{sizeLabel(hatch.sizes)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t("factWhen")}
          </dt>
          <dd className="mt-0.5 font-medium text-forest">
            {formatRef(hatch.active.from)} – {formatRef(hatch.active.to)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t("factPeak")}
          </dt>
          <dd className="mt-0.5 font-medium text-rust">
            {hatch.peaks
              .map((p) => `${formatRef(p.from)} – ${formatRef(p.to)}`)
              .join(", ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t("factTime")}
          </dt>
          <dd className="mt-0.5 font-medium text-forest">{t(TIME_KEY[hatch.timeOfDay])}</dd>
        </div>
      </dl>

      <p className="mt-8 text-lg leading-relaxed text-ink/80">
        {say(article.intro, locale)}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-forest">
          {t("identifyHeading")}
        </h2>
        <ul className="mt-4 space-y-2">
          {article.idMarks.map((mark, i) => (
            <li key={i} className="flex gap-3 text-ink/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden />
              <span>{say(mark, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl border-l-2 border-gold bg-cream/40 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t("confusedWithHeading")}
          </p>
          <p className="mt-1.5 text-sm text-ink/75">{say(article.confusedWith, locale)}</p>
        </div>
      </section>

      {article.sections.map((section, i) => (
        <section key={i} className="mt-12">
          <h2 className="font-display text-xl font-semibold text-forest">
            {say(section.heading, locale)}
          </h2>
          {say(section.body, locale)
            .split("\n\n")
            .map((para, j) => (
              <p key={j} className="mt-4 leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
        </section>
      ))}

      <section className="mt-14 border-t border-forest/10 pt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          {t("stagesHeading")}
        </h2>
        <div className="mt-6 space-y-6">
          {article.stages.map((stage, i) => {
            const linked = stage.patternSlugs
              .map((s) => bySlug.get(s))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));
            return (
              <div key={i} className="rounded-2xl border border-forest/15 bg-cream/30 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-forest">
                    {say(stage.label, locale)}
                  </h3>
                  <span className="text-xs font-medium text-ink/55">
                    {say(stage.when, locale)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/75">{say(stage.how, locale)}</p>
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
            );
          })}
        </div>
      </section>

      <p className="mt-12 text-sm text-ink/60">
        {t("chartLinkIntro")}{" "}
        <Link href="/hatches" className="text-rust underline underline-offset-2">
          {t("chartLinkCta")}
        </Link>
      </p>
    </article>
  );
}
