import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { Link } from "@/i18n/navigation";
import { CATEGORY_ORDER } from "@/lib/localize";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("Shop");
  const tCategories = await getTranslations("Categories");
  const tAngling = await getTranslations("Angling");

  const activeCategory = (CATEGORY_ORDER as readonly string[]).includes(category ?? "")
    ? (category as ProductCategory)
    : undefined;
  const query = q?.trim();

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(query
        ? {
            OR: [
              { nameFr: { contains: query, mode: "insensitive" } },
              { nameEn: { contains: query, mode: "insensitive" } },
              { descriptionFr: { contains: query, mode: "insensitive" } },
              { descriptionEn: { contains: query, mode: "insensitive" } },
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

  function categoryHref(cat?: ProductCategory) {
    const urlParams = new URLSearchParams();
    if (cat) urlParams.set("category", cat);
    if (query) urlParams.set("q", query);
    const qs = urlParams.toString();
    return qs ? `/shop?${qs}` : "/shop";
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
          />
          {CATEGORY_ORDER.map((cat) => (
            <CategoryPill
              key={cat}
              href={categoryHref(cat)}
              active={activeCategory === cat}
              label={tCategories(cat)}
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
            {tAngling(`species.${sp}`)}
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

function CategoryPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
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
    </Link>
  );
}
