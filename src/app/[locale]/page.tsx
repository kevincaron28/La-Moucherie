import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import { HATCHES } from "@/lib/hatches";
import { LETTER_RATE_CENTS } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

// No dynamic segment here, so this route would otherwise be fully static-
// generated at build time and frozen until the next deploy — wrong for a
// page whose "What's Working" teaser and real-catches section are meant to
// change from the admin dashboard alone, with no redeploy involved.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tAngling = await getTranslations("Angling");
  const tCatches = await getTranslations("Catches");

  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: {
      variants: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  // Sourced from the same angler field reports as /reports — there is no
  // separate shop-written "what's working" post any more, so the teaser
  // shows whichever real report came in most recently, from anyone.
  const latestReport = await prisma.hatchReport.findFirst({
    where: { approved: true },
    orderBy: { observedOn: "desc" },
    select: {
      hatchId: true,
      note: true,
      waterOther: true,
      water: { select: { nameFr: true, nameEn: true } },
    },
  });

  const recentCatches = await prisma.catchPhoto.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      imageUrl: true,
      anglerName: true,
      captionFr: true,
      captionEn: true,
      species: true,
    },
  });

  // One query for every species' fly count, rather than one per card — the
  // catalog is small enough to tally in JS.
  const speciesTags = await prisma.product.findMany({
    where: { active: true },
    select: { species: true },
  });
  const speciesCounts = new Map<string, number>();
  for (const p of speciesTags) {
    for (const sp of p.species) {
      speciesCounts.set(sp, (speciesCounts.get(sp) ?? 0) + 1);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-parchment">
        {/* A hand-drawn river line, not a stock texture — the same kind of
            line you'd sketch showing someone where to fish. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
          aria-hidden
        >
          <path
            d="M-50 480 C 200 450, 260 540, 460 500 S 720 400, 900 450 S 1300 380, 1500 420"
            stroke="#ac4d15"
            strokeWidth="2"
            fill="none"
            strokeDasharray="1 9"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
              {t("heroKicker")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/75">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
              >
                {t("heroCta")}
              </Link>
              <Link
                href="/reports"
                className="rounded-full border border-forest/30 px-6 py-3 text-sm font-semibold text-forest transition hover:bg-forest/5"
              >
                {t("heroSecondaryCta")}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-forest/10 shadow-xl shadow-forest/10">
              <Image
                src="/about/claudya-steelhead.jpg"
                alt={t("heroImageAlt")}
                fill
                sizes="(min-width: 768px) 28rem, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-5 flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full bg-gold text-center shadow-lg shadow-forest/20">
              <span className="font-display text-xs font-semibold leading-tight text-forest">
                {t("badgeSmallBatch")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-cream/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-center text-xs font-semibold uppercase tracking-wide text-forest/70 sm:px-6">
          <span>{t("trustHandmade")}</span>
          <span className="text-forest/25">·</span>
          <span>{t("trustQuebec")}</span>
          <span className="text-forest/25">·</span>
          <span>{t("trustSmallBatch")}</span>
          <span className="text-forest/25">·</span>
          <span>{t("trustShipping", { price: formatPrice(LETTER_RATE_CENTS, locale) })}</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
            {t("speciesSectionKicker")}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl">
            {t("speciesSectionTitle")}
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {SPECIES.map((sp) => (
            <SpeciesCard
              key={sp}
              href={`/shop/species/${SPECIES_SLUGS[sp]}`}
              label={tAngling(`species.${sp}`)}
              count={speciesCounts.get(sp) ?? 0}
              countLabel={t("speciesFlyCount", { count: speciesCounts.get(sp) ?? 0 })}
            />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                {t("featuredTitle")}
              </h2>
              <p className="mt-2 max-w-lg text-ink/70">{t("featuredSubtitle")}</p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-rust underline underline-offset-4 hover:text-rust-dark"
            >
              {t("shopAllCta")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-forest/10 bg-cream/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-cream shadow-lg shadow-forest/15 sm:h-36 sm:w-36">
            <Image
              src="/about/claudya-steelhead.jpg"
              alt={t("heroImageAlt")}
              fill
              sizes="9rem"
              className="object-cover"
              style={{ objectPosition: "30% 20%" }}
            />
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
              {t("storyKicker")}
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl">
              {t("storyTitle")}
            </h2>
            <p className="mt-4 text-ink/75">{t("storyBody")}</p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <ValueItem title={t("valuesHandmadeTitle")} body={t("valuesHandmadeBody")} />
            <ValueItem title={t("valuesLocalTitle")} body={t("valuesLocalBody")} />
            <ValueItem title={t("valuesQualityTitle")} body={t("valuesQualityBody")} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Link
          href="/reports"
          className="block rounded-2xl border border-forest/15 bg-parchment px-6 py-8 transition hover:border-forest/30 hover:shadow-lg hover:shadow-forest/5 sm:px-10"
        >
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
            {t("workingTeaserKicker")}
          </p>
          {latestReport ? (
            <>
              <h2 className="mt-3 font-display text-2xl font-semibold text-forest">
                {[
                  latestReport.water
                    ? pick(latestReport.water.nameFr, latestReport.water.nameEn, locale)
                    : latestReport.waterOther,
                  (() => {
                    const hatch = HATCHES.find((h) => h.id === latestReport.hatchId);
                    return hatch ? pick(hatch.nameFr, hatch.nameEn, locale) : null;
                  })(),
                ]
                  .filter(Boolean)
                  .join(" — ")}
              </h2>
              {latestReport.note && (
                <p className="mt-2 max-w-xl text-ink/70">{latestReport.note}</p>
              )}
            </>
          ) : (
            <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold text-forest">
              {t("workingTeaserEmpty")}
            </h2>
          )}
          <span className="mt-4 inline-block text-sm font-semibold text-rust underline underline-offset-4">
            {t("workingTeaserCta")}
          </span>
        </Link>
      </section>

      {recentCatches.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-rust">
                {t("catchesTeaserKicker")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-forest sm:text-3xl">
                {t("catchesTeaserTitle")}
              </h2>
            </div>
            <Link
              href="/catches"
              className="text-sm font-semibold text-rust underline underline-offset-4 hover:text-rust-dark"
            >
              {t("catchesTeaserCta")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recentCatches.map((c) => (
              <div
                key={c.id}
                className="overflow-hidden rounded-2xl border border-forest/10 bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.imageUrl}
                  alt={
                    pick(c.captionFr ?? "", c.captionEn ?? "", locale) ||
                    c.anglerName ||
                    tCatches("anonymousAngler")
                  }
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <p className="p-3 font-display text-sm font-semibold text-forest">
                  {c.anglerName || tCatches("anonymousAngler")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-forest/10 bg-forest">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <NewsletterSignup className="[&_label]:block [&_p]:mx-auto [&_p]:max-w-sm [&_div]:mx-auto [&_div]:justify-center" />
        </div>
      </section>
    </>
  );
}

function ValueItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-rust pl-4">
      <h3 className="font-display font-semibold text-forest">{title}</h3>
      <p className="mt-1 text-sm text-ink/70">{body}</p>
    </div>
  );
}

function SpeciesCard({
  href,
  label,
  count,
  countLabel,
}: {
  href: string;
  label: string;
  count: number;
  countLabel: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border px-4 py-4 text-center transition ${
        count > 0
          ? "border-forest/15 bg-cream/50 hover:border-forest/40 hover:bg-cream"
          : "border-forest/10 bg-cream/20 opacity-60 hover:opacity-100"
      }`}
    >
      <span className="block font-display text-sm font-semibold text-forest">{label}</span>
      <span className="mt-1 block text-xs text-ink/55">{countLabel}</span>
    </Link>
  );
}
