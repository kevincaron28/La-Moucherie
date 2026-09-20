import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { Link } from "@/i18n/navigation";
import { AdminProductsClient } from "@/components/AdminProductsClient";
import type { Locale } from "@/i18n/routing";

// Reads live stock and live copy, and is the page you come back to right after
// changing them — it must never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await isAdmin())) {
    notFound();
  }

  const [products, waters] = await Promise.all([
    // Inactive products included: taking something off sale is done here, so
    // putting it back has to be possible here too.
    prisma.product.findMany({
      orderBy: [{ active: "desc" }, { category: "asc" }, { nameFr: "asc" }],
      include: {
        variants: { orderBy: { createdAt: "asc" } },
        waters: { select: { slug: true } },
      },
    }),
    prisma.fishingWater.findMany({
      select: { slug: true, nameFr: true, nameEn: true },
      orderBy: { nameFr: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/admin" className="text-sm font-medium text-forest/70 hover:text-rust">
        {locale === "fr" ? "← Tableau de bord" : "← Dashboard"}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {locale === "fr" ? "Produits" : "Products"}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        {locale === "fr"
          ? "Modifier un patron : prix, texte, photos, et surtout le stock par taille d'hameçon."
          : "Edit a pattern: price, copy, photos, and above all stock per hook size."}
      </p>

      <div className="mt-8">
        <AdminProductsClient
          locale={locale}
          waters={waters}
          products={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            nameFr: p.nameFr,
            nameEn: p.nameEn,
            descriptionFr: p.descriptionFr,
            descriptionEn: p.descriptionEn,
            category: p.category,
            basePriceCents: p.basePriceCents,
            currency: p.currency,
            active: p.active,
            featured: p.featured,
            images: p.images,
            howToFishFr: p.howToFishFr ?? "",
            howToFishEn: p.howToFishEn ?? "",
            proTipFr: p.proTipFr ?? "",
            proTipEn: p.proTipEn ?? "",
            imitatesFr: p.imitatesFr,
            imitatesEn: p.imitatesEn,
            species: p.species,
            seasons: p.seasons,
            waterTypes: p.waterTypes,
            techniques: p.techniques,
            waterSlugs: p.waters.map((w) => w.slug),
            variants: p.variants.map((v) => ({
              id: v.id,
              nameFr: v.nameFr,
              nameEn: v.nameEn,
              sku: v.sku,
              priceCents: v.priceCents,
              stock: v.stock,
            })),
          }))}
        />
      </div>
    </div>
  );
}
