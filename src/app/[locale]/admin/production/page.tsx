import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { MaterialCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { PrintButton } from "@/components/PrintButton";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

// Reads live stock to decide what needs tying, so it must never be a
// build-time snapshot.
export const dynamic = "force-dynamic";

// Tying order, which is also a sensible order to shop in.
const CATEGORY_ORDER: MaterialCategory[] = [
  "HOOK",
  "BEAD_WEIGHT",
  "THREAD",
  "TAIL",
  "BODY",
  "RIB",
  "THORAX",
  "HACKLE",
  "WING",
  "HEAD",
  "ADHESIVE",
  "OTHER",
];

const CATEGORY_LABEL: Record<MaterialCategory, { fr: string; en: string }> = {
  HOOK: { fr: "Hameçons", en: "Hooks" },
  BEAD_WEIGHT: { fr: "Billes et lestage", en: "Beads & weight" },
  THREAD: { fr: "Fils", en: "Thread" },
  TAIL: { fr: "Queues", en: "Tails" },
  BODY: { fr: "Corps", en: "Bodies" },
  RIB: { fr: "Côtes", en: "Ribbing" },
  THORAX: { fr: "Thorax", en: "Thorax" },
  HACKLE: { fr: "Hackles", en: "Hackle" },
  WING: { fr: "Ailes et flash", en: "Wings & flash" },
  HEAD: { fr: "Têtes", en: "Heads" },
  ADHESIVE: { fr: "Colles et résines", en: "Adhesives" },
  OTHER: { fr: "Autres", en: "Other" },
};

/** How many of each fly to tie, when a variant is at zero. */
const TARGET_PER_VARIANT = 12;

/**
 * "Hook #14" / "Hameçon #14" -> "#14", so a hook line reads "#14 x36" instead
 * of repeating the word next to the material name. Falls back to the whole
 * label for any variant not named after a hook size (e.g. the 2"/3"/4" Game
 * Changer lengths).
 */
function sizeLabelOf(variantName: string): string {
  const hash = variantName.indexOf("#");
  return hash === -1 ? variantName : variantName.slice(hash);
}

export default async function ProductionRunSheetPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ target?: string }>;
}) {
  const { locale } = await params;
  const { target } = await searchParams;
  setRequestLocale(locale);

  if (!(await isAdmin())) notFound();

  const fr = locale === "fr";
  const parsedTarget = Number(target);
  const perVariant =
    Number.isFinite(parsedTarget) && parsedTarget > 0 && parsedTarget <= 500
      ? Math.floor(parsedTarget)
      : TARGET_PER_VARIANT;

  const products = await prisma.product.findMany({
    where: { active: true, variants: { some: { stock: { lte: 0 } } } },
    select: {
      id: true,
      slug: true,
      nameFr: true,
      nameEn: true,
      variants: {
        where: { stock: { lte: 0 } },
        orderBy: { sku: "asc" },
        select: { id: true, nameFr: true, nameEn: true, sku: true },
      },
      materials: {
        orderBy: { position: "asc" },
        select: {
          specFr: true,
          specEn: true,
          perFlyQty: true,
          material: { select: { id: true, nameFr: true, nameEn: true, category: true } },
        },
      },
    },
    orderBy: [{ category: "asc" }, { slug: "asc" }],
  });

  const totalFlies = products.reduce((n, p) => n + p.variants.length * perVariant, 0);
  const missingRecipes = products.filter((p) => p.materials.length === 0);

  // Roll the recipes up by material, so "grizzly hackle" is one line naming
  // every pattern that wants it rather than eight lines scattered down the page.
  type Rollup = {
    name: string;
    category: MaterialCategory;
    patterns: string[];
    unitsNeeded: number;
    /** Hooks only — see below. */
    bySize: Map<string, number>;
  };
  const rollup = new Map<string, Rollup>();

  for (const p of products) {
    const fliesForProduct = p.variants.length * perVariant;
    const patternLabel = pick(p.nameFr, p.nameEn, locale);
    for (const line of p.materials) {
      const key = line.material.id;
      const entry = rollup.get(key) ?? {
        name: pick(line.material.nameFr, line.material.nameEn, locale),
        category: line.material.category,
        patterns: [],
        unitsNeeded: 0,
        bySize: new Map<string, number>(),
      };
      const spec = pick(line.specFr ?? "", line.specEn ?? "", locale);
      entry.patterns.push(spec ? `${patternLabel} (${spec})` : patternLabel);
      if (line.perFlyQty) {
        entry.unitsNeeded += line.perFlyQty * fliesForProduct;
        // A hook is the one material you order BY SIZE, so a single total
        // across every size ("dry-fly hook x612") is useless at the shop.
        // Each variant is one size, so break the count out that way. Beads and
        // eyes stay aggregated — those come in one size per pack.
        if (line.material.category === "HOOK") {
          for (const v of p.variants) {
            const label = sizeLabelOf(pick(v.nameFr, v.nameEn, locale));
            entry.bySize.set(
              label,
              (entry.bySize.get(label) ?? 0) + line.perFlyQty * perVariant
            );
          }
        }
      }
      rollup.set(key, entry);
    }
  }

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: [...rollup.values()]
      .filter((r) => r.category === category)
      .sort((a, b) => a.name.localeCompare(b.name, locale)),
  })).filter((g) => g.items.length > 0);

  const printedOn = new Intl.DateTimeFormat(fr ? "fr-CA" : "en-CA", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-4xl bg-white p-8 font-sans text-black print:m-0 print:p-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 print:hidden">
        <Link href="/admin" className="text-sm font-medium text-forest/70 hover:text-rust">
          &larr; {fr ? "Retour au tableau de bord" : "Back to dashboard"}
        </Link>
        <div className="flex items-center gap-3">
          <form className="flex items-center gap-2 text-sm">
            <label htmlFor="target" className="text-gray-600">
              {fr ? "Par taille :" : "Per size:"}
            </label>
            <input
              id="target"
              name="target"
              type="number"
              min={1}
              max={500}
              defaultValue={perVariant}
              className="w-20 rounded border border-gray-300 px-2 py-1"
            />
            <button
              type="submit"
              className="rounded-full border border-forest/30 px-3 py-1 font-medium text-forest hover:bg-forest/5"
            >
              {fr ? "Recalculer" : "Recalculate"}
            </button>
          </form>
          <PrintButton label={fr ? "Imprimer" : "Print"} />
        </div>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {fr ? "Feuille de production" : "Production run sheet"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {fr
            ? `La Moucherie — ${printedOn} — ${perVariant} mouches par taille`
            : `La Moucherie — ${printedOn} — ${perVariant} flies per size`}
        </p>
      </header>

      {products.length === 0 ? (
        <p className="text-gray-700">
          {fr
            ? "Aucune taille en rupture. Tout est en stock."
            : "No sizes are out of stock. Everything is covered."}
        </p>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="mb-1 border-b border-gray-300 pb-1 text-lg font-bold">
              {fr ? "À monter" : "To tie"}
            </h2>
            <p className="mb-3 text-xs text-gray-500">
              {fr
                ? `${products.length} patrons, ${totalFlies} mouches au total`
                : `${products.length} patterns, ${totalFlies} flies total`}
            </p>
            <table className="w-full text-sm">
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 align-top">
                    <td className="w-8 py-2">
                      <span className="inline-block h-3 w-3 border border-gray-400" aria-hidden />
                    </td>
                    <td className="py-2 pr-4 font-medium">
                      {pick(p.nameFr, p.nameEn, locale)}
                      {p.materials.length === 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {fr ? "— pas de recette" : "— no recipe"}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-gray-700">
                      {p.variants
                        .map((v) => pick(v.nameFr, v.nameEn, locale))
                        .join(", ")}
                    </td>
                    <td className="whitespace-nowrap py-2 text-right tabular-nums text-gray-700">
                      {p.variants.length * perVariant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="mb-1 border-b border-gray-300 pb-1 text-lg font-bold">
              {fr ? "Matériaux nécessaires" : "Materials needed"}
            </h2>
            <p className="mb-3 text-xs text-gray-500">
              {fr
                ? "Les quantités ne sont indiquées que pour ce qui se consomme à l'unité (hameçons, billes, yeux). Le reste est une liste de vérification."
                : "Counts are shown only for what is consumed per fly (hooks, beads, eyes). The rest is a checklist."}
            </p>

            {byCategory.map((group) => (
              <div key={group.category} className="mb-5 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  {CATEGORY_LABEL[group.category][fr ? "fr" : "en"]}
                </h3>
                <ul className="mt-1 space-y-1.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex gap-2 border-b border-gray-100 pb-1.5">
                      <span
                        className="mt-1 inline-block h-3 w-3 shrink-0 border border-gray-400"
                        aria-hidden
                      />
                      <span className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        {item.unitsNeeded > 0 && (
                          <span className="ml-2 tabular-nums text-gray-700">
                            &times;{item.unitsNeeded}
                          </span>
                        )}
                        {item.bySize.size > 0 && (
                          <span className="ml-2 tabular-nums text-gray-700">
                            (
                            {[...item.bySize.entries()]
                              .sort((a, b) => a[0].localeCompare(b[0], locale, { numeric: true }))
                              .map(([size, n]) => `${size} ×${n}`)
                              .join(", ")}
                            )
                          </span>
                        )}
                        <span className="block text-xs text-gray-500">
                          {item.patterns.join(" · ")}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {missingRecipes.length > 0 && (
            <p className="mt-8 border-t border-gray-300 pt-3 text-xs text-gray-600">
              {fr
                ? `Sans recette, donc absents de la liste de matériaux : ${missingRecipes
                    .map((p) => pick(p.nameFr, p.nameEn, locale))
                    .join(", ")}.`
                : `No recipe on file, so missing from the materials list: ${missingRecipes
                    .map((p) => pick(p.nameFr, p.nameEn, locale))
                    .join(", ")}.`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
