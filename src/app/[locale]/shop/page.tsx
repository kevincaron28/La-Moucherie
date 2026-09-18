import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ProductCategory, FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { Link } from "@/i18n/navigation";
import { CATEGORY_ORDER } from "@/lib/localize";
import {
  SPECIES,
  SPECIES_SLUGS,
  SEASONS,
  WATER_TYPES,
  isSeason,
  isWaterType,
} from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Shop" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; q?: string; season?: string; waterType?: string }>;
}) {
  const { locale } = await params;
  const { category, q, season, waterType } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("Shop");
  const tCategories = await getTranslations("Categories");
  const tAngling = await getTranslations("Angling");

  const activeCategory = (CATEGORY_ORDER as readonly string[]).includes(category ?? "")
    ? (category as ProductCategory)
    : undefined;
  const activeSeason = isSeason(season) ? season : undefined;
  const activeWaterType = isWaterType(waterType) ? waterType : undefined;
  const query = q?.trim();

  const matchedSpecies: FishSpecies[] = [];
  if (query) {
    const qLower = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [code, slug] of Object.entries(SPECIES_SLUGS)) {
      const slugNorm = slug.replace(/-/g, " ");
      const codeNorm = code.toLowerCase().replace(/_/g, " ");
      if (slugNorm.includes(qLower) || codeNorm.includes(qLower) || qLower.includes(slugNorm)) {
        matchedSpecies.push(code as FishSpecies);
      }
    }
    if (qLower.includes("truite") || qLower.includes("trout")) {
      matchedSpecies.push("BROOK_TROUT", "BROWN_TROUT", "RAINBOW_TROUT");
    }
    if (qLower.includes("saumon") || qLower.includes("salmon")) {
      matchedSpecies.push("ATLANTIC_SALMON", "LANDLOCKED_SALMON");
    }
    if (qLower.includes("achigan") || qLower.includes("bass")) {
      matchedSpecies.push("SMALLMOUTH_BASS", "LARGEMOUTH_BASS");
    }
    if (qLower.includes("brochet") || qLower.includes("pike")) {
      matchedSpecies.push("NORTHERN_PIKE");
    }
    if (qLower.includes("dore") || qLower.includes("walleye")) {
      matchedSpecies.push("WALLEYE");
    }
  }
  const uniqueMatchedSpecies = Array.from(new Set(matchedSpecies));

  // A lightweight, unfiltered pass over every active product's own
  // category/season/water-type/species — just enough to count each filter
  // pill without a separate aggregate query per dimension. The catalog is
  // small enough (a few dozen rows) that doing this in JS is simpler than
  // four GROUP BY queries.
  //
  // Each dimension's counts are scoped to whichever *other* filters are
  // currently active (category counts respect season/water-type, etc.),
  // so a pill's number always answers "if I also picked this, how many
  // flies would that leave" rather than a fixed catalog-wide total. A
  // pill excludes only its own dimension from that check, since its count
  // is what picking it would change to, not what's already true.
  const allActiveProducts = await prisma.product.findMany({
    where: { active: true },
    select: { category: true, seasons: true, waterTypes: true, species: true },
  });

  function matchesOtherFilters(
    p: (typeof allActiveProducts)[number],
    exclude: "category" | "season" | "waterType" | "none"
  ) {
    if (exclude !== "category" && activeCategory && p.category !== activeCategory) return false;
    if (exclude !== "season" && activeSeason && !p.seasons.includes(activeSeason)) return false;
    if (exclude !== "waterType" && activeWaterType && !p.waterTypes.includes(activeWaterType))
      return false;
    return true;
  }

  const forCategoryCounts = allActiveProducts.filter((p) => matchesOtherFilters(p, "category"));
  const forSeasonCounts = allActiveProducts.filter((p) => matchesOtherFilters(p, "season"));
  const forWaterTypeCounts = allActiveProducts.filter((p) => matchesOtherFilters(p, "waterType"));
  const forSpeciesCounts = allActiveProducts.filter((p) => matchesOtherFilters(p, "none"));

  const categoryAllCount = forCategoryCounts.length;
  const seasonAllCount = forSeasonCounts.length;
  const waterTypeAllCount = forWaterTypeCounts.length;

  const categoryCounts: Partial<Record<ProductCategory, number>> = {};
  for (const p of forCategoryCounts) categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;

  const seasonCounts: Partial<Record<string, number>> = {};
  for (const p of forSeasonCounts) {
    for (const s of p.seasons) seasonCounts[s] = (seasonCounts[s] ?? 0) + 1;
  }

  const waterTypeCounts: Partial<Record<string, number>> = {};
  for (const p of forWaterTypeCounts) {
    for (const w of p.waterTypes) waterTypeCounts[w] = (waterTypeCounts[w] ?? 0) + 1;
  }

  const speciesCounts: Partial<Record<string, number>> = {};
  for (const p of forSpeciesCounts) {
    for (const sp of p.species) speciesCounts[sp] = (speciesCounts[sp] ?? 0) + 1;
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(activeSeason ? { seasons: { has: activeSeason } } : {}),
      ...(activeWaterType ? { waterTypes: { has: activeWaterType } } : {}),
      ...(query
        ? {
            OR: [
              { nameFr: { contains: query, mode: "insensitive" } },
              { nameEn: { contains: query, mode: "insensitive" } },
              { descriptionFr: { contains: query, mode: "insensitive" } },
              { descriptionEn: { contains: query, mode: "insensitive" } },
              { howToFishFr: { contains: query, mode: "insensitive" } },
              { howToFishEn: { contains: query, mode: "insensitive" } },
              { proTipFr: { contains: query, mode: "insensitive" } },
              { proTipEn: { contains: query, mode: "insensitive" } },
              {
                waters: {
                  some: {
                    OR: [
                      { nameFr: { contains: query, mode: "insensitive" } },
                      { nameEn: { contains: query, mode: "insensitive" } },
                      { regionFr: { contains: query, mode: "insensitive" } },
                      { regionEn: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              },
              ...(uniqueMatchedSpecies.length > 0
                ? [{ species: { hasSome: uniqueMatchedSpecies } }]
                : []),
            ],
          }
        : {}),
    },
    include: {
      variants: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  function buildHref(overrides: {
    category?: string;
    season?: string;
    waterType?: string;
  }) {
    const urlParams = new URLSearchParams();
    const cat = "category" in overrides ? overrides.category : activeCategory;
    const ssn = "season" in overrides ? overrides.season : activeSeason;
    const wt = "waterType" in overrides ? overrides.waterType : activeWaterType;
    if (cat) urlParams.set("category", cat);
    if (ssn) urlParams.set("season", ssn);
    if (wt) urlParams.set("waterType", wt);
    if (query) urlParams.set("q", query);
    const qs = urlParams.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  function categoryHref(cat?: ProductCategory) {
    return buildHref({ category: cat });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-ink/70">{t("subtitle")}</p>
      </div>

      <div className="mt-6 max-w-sm">
        <SearchBox defaultQuery={query ?? ""} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            href={categoryHref()}
            active={!activeCategory}
            label={tCategories("ALL")}
            count={categoryAllCount}
          />
          {CATEGORY_ORDER.map((cat) => (
            <CategoryPill
              key={cat}
              href={categoryHref(cat)}
              active={activeCategory === cat}
              label={tCategories(cat)}
              count={categoryCounts[cat] ?? 0}
            />
          ))}
        </div>
        {query && (
          <p className="text-sm text-ink/60">
            {t("searchResultsFor", { query })} ·{" "}
            <Link href={categoryHref(activeCategory)} className="underline hover:text-rust">
              {t("clearSearch")}
            </Link>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {tAngling("seasonTitle")}
          </span>
          <FilterPill
            href={buildHref({ season: undefined })}
            active={!activeSeason}
            label={t("all")}
            count={seasonAllCount}
          />
          {SEASONS.map((s) => (
            <FilterPill
              key={s}
              href={buildHref({ season: activeSeason === s ? undefined : s })}
              active={activeSeason === s}
              label={tAngling(`seasons.${s}`)}
              count={seasonCounts[s] ?? 0}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {tAngling("waterTitle")}
          </span>
          <FilterPill
            href={buildHref({ waterType: undefined })}
            active={!activeWaterType}
            label={t("all")}
            count={waterTypeAllCount}
          />
          {WATER_TYPES.map((w) => (
            <FilterPill
              key={w}
              href={buildHref({ waterType: activeWaterType === w ? undefined : w })}
              active={activeWaterType === w}
              label={tAngling(`waterTypes.${w}`)}
              count={waterTypeCounts[w] ?? 0}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 border-t border-forest/10 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          {tAngling("speciesTitle")}
        </span>
        {SPECIES.map((sp) => (
          <Link
            key={sp}
            href={`/shop/species/${SPECIES_SLUGS[sp]}`}
            className="text-sm text-ink/70 underline decoration-forest/20 underline-offset-2 transition hover:text-forest hover:decoration-forest"
          >
            {tAngling(`species.${sp}`)}{" "}
            <span className="text-ink/45">({speciesCounts[sp] ?? 0})</span>
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink/60">
          {query ? t("emptySearch", { query }) : t("empty")}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-rust bg-rust text-cream"
          : "border-forest/20 text-forest/70 hover:border-forest/50"
      }`}
    >
      {label}
      {count !== undefined && <span className="opacity-70"> ({count})</span>}
    </Link>
  );
}

function CategoryPill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-forest bg-forest text-cream"
          : "border-forest/20 text-forest hover:border-forest/50"
      }`}
    >
      {label}
      {count !== undefined && <span className="opacity-70"> ({count})</span>}
    </Link>
  );
}
