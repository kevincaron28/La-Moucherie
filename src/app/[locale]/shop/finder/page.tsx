import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SPECIES, SEASONS, WATER_TYPES, isSpecies, isSeason, isWaterType } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FlyFinder" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function FlyFinderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ species?: string; season?: string; waterType?: string }>;
}) {
  const { locale } = await params;
  const { species, season, waterType } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("FlyFinder");
  const tAngling = await getTranslations("Angling");

  const selectedSpecies = isSpecies(species) ? species : undefined;
  const selectedSeason = isSeason(season) ? season : undefined;
  const selectedWaterType = isWaterType(waterType) ? waterType : undefined;
  const submitted = Boolean(selectedSpecies || selectedSeason || selectedWaterType);

  let results: Awaited<ReturnType<typeof queryFull>> = [];
  let relaxed = false;

  async function queryFull() {
    return prisma.product.findMany({
      where: {
        active: true,
        ...(selectedSpecies ? { species: { has: selectedSpecies as FishSpecies } } : {}),
        ...(selectedSeason ? { seasons: { has: selectedSeason } } : {}),
        ...(selectedWaterType ? { waterTypes: { has: selectedWaterType } } : {}),
      },
      include: {
        variants: true,
        reviews: { where: { status: "APPROVED" }, select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (submitted) {
    results = await queryFull();
    if (results.length === 0 && selectedSpecies) {
      relaxed = true;
      results = await prisma.product.findMany({
        where: { active: true, species: { has: selectedSpecies as FishSpecies } },
        include: {
          variants: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-ink/70">{t("intro")}</p>

      <form method="get" className="mt-8 grid gap-4 sm:grid-cols-3">
        <FinderSelect
          name="species"
          label={tAngling("speciesTitle")}
          placeholder={t("anySpecies")}
          value={selectedSpecies ?? ""}
          options={SPECIES.map((s) => ({ value: s, label: tAngling(`species.${s}`) }))}
        />
        <FinderSelect
          name="waterType"
          label={tAngling("waterTitle")}
          placeholder={t("anyWater")}
          value={selectedWaterType ?? ""}
          options={WATER_TYPES.map((w) => ({ value: w, label: tAngling(`waterTypes.${w}`) }))}
        />
        <FinderSelect
          name="season"
          label={tAngling("seasonTitle")}
          placeholder={t("anySeason")}
          value={selectedSeason ?? ""}
          options={SEASONS.map((s) => ({ value: s, label: tAngling(`seasons.${s}`) }))}
        />
        <button
          type="submit"
          className="sm:col-span-3 rounded-full bg-rust px-8 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {t("submit")}
        </button>
      </form>

      {submitted && (
        <div className="mt-12 border-t border-forest/10 pt-8">
          {relaxed && (
            <p className="mb-4 text-sm text-ink/60">{t("relaxedNotice")}</p>
          )}
          {results.length === 0 ? (
            <p className="text-ink/60">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FinderSelect({
  name,
  label,
  placeholder,
  value,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </label>
      <select
        name={name}
        defaultValue={value}
        className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
