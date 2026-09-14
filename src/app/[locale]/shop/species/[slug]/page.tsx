import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { SPECIES, SPECIES_SLUGS, speciesFromSlug } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

// Prerendered for both locales: these are the pages meant to be found in
// search, so they shouldn't wait on a first request to exist.
export function generateStaticParams() {
  return SPECIES.map((s) => ({ slug: SPECIES_SLUGS[s] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const species = speciesFromSlug(slug);
  if (!species) return {};
  const t = await getTranslations({ locale, namespace: "Angling" });
  const tp = await getTranslations({ locale, namespace: "SpeciesPage" });
  // The definite form carries the French article and its elision, so the
  // sentence reads natively rather than as a filled-in template.
  const name = t(`speciesDefinite.${species}`);
  return {
    title: tp("metaTitle", { species: name }),
    description: tp("metaDescription", { species: name }),
  };
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const species = speciesFromSlug(slug);
  if (!species) notFound();

  const t = await getTranslations("Angling");
  const tp = await getTranslations("SpeciesPage");
  const nameDefinite = t(`speciesDefinite.${species}`);

  const products = await prisma.product.findMany({
    where: { active: true, species: { has: species } },
    include: {
      variants: { orderBy: { createdAt: "asc" } },
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: [{ featured: "desc" }, { category: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/shop" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {tp("backToShop")}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {tp("title", { species: nameDefinite })}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        {tp("intro", { species: nameDefinite })}
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-ink/60">{tp("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <nav className="mt-14 border-t border-forest/10 pt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest">
          {tp("otherSpecies")}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {SPECIES.filter((s) => s !== species).map((s) => (
            <li key={s}>
              <Link
                href={`/shop/species/${SPECIES_SLUGS[s]}`}
                className="text-ink/70 underline decoration-forest/20 underline-offset-2 hover:text-forest hover:decoration-forest"
              >
                {t(`species.${s}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
