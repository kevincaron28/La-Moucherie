"use client";

// The product editor. Before this existed, changing a price, a description or
// a stock count meant opening `npm run db:studio` — a raw database client, on a
// desktop, with no validation and no idea which columns matter. That is also
// how the catalogue drifted out of the seed file and how every stock count
// came to be zero: the only tool for the job was one nobody wants to open at
// the bench.
//
// One product open at a time, saved as a whole. Fly-tying is not a
// high-frequency editing job — the point is to change a number and be sure it
// took, not to edit twenty rows at once.
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { chipClass } from "@/lib/chip";
import { SPECIES, SEASONS, WATER_TYPES, TECHNIQUES } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

type Variant = {
  id?: string;
  nameFr: string;
  nameEn: string;
  sku: string;
  priceCents: number | null;
  stock: number;
};

export type EditableProduct = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: string;
  basePriceCents: number;
  currency: string;
  active: boolean;
  featured: boolean;
  images: string[];
  howToFishFr: string;
  howToFishEn: string;
  proTipFr: string;
  proTipEn: string;
  imitatesFr: string[];
  imitatesEn: string[];
  species: string[];
  seasons: string[];
  waterTypes: string[];
  techniques: string[];
  waterSlugs: string[];
  variants: Variant[];
};

type WaterOption = { slug: string; nameFr: string; nameEn: string };

const LABEL = "block text-xs font-semibold uppercase tracking-wide text-ink/50";
const INPUT =
  "mt-1 w-full rounded-lg border border-forest/20 bg-parchment px-3 py-2 text-sm text-ink " +
  "focus:border-forest/50 focus:outline-none";

const T = {
  fr: {
    title: "Produits",
    intro:
      "Modifier un patron : prix, texte, photos, et surtout le stock par taille d'hameçon.",
    back: "← Tableau de bord",
    edit: "Modifier",
    close: "Fermer",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Enregistré",
    names: "Noms",
    nameFr: "Nom (français)",
    nameEn: "Nom (anglais)",
    descriptions: "Descriptions",
    descFr: "Description (français)",
    descEn: "Description (anglais)",
    pricing: "Prix et visibilité",
    basePrice: "Prix de base (¢)",
    active: "En vente",
    featured: "Mis de l'avant",
    images: "Photos",
    imagesHelp:
      "Un chemin par ligne, ex. /products/woolly-bugger-black-1.jpg. Laisser vide pour utiliser l'illustration de la catégorie.",
    variants: "Tailles et stock",
    variantName: "Taille (fr / en)",
    sku: "SKU",
    priceOverride: "Prix (¢, vide = prix de base)",
    stock: "Stock",
    addVariant: "+ Ajouter une taille",
    removeVariant: "Retirer",
    fishing: "Comment la pêcher",
    howToFish: "Comment la pêcher",
    proTip: "Truc du monteur",
    imitates: "Imite (séparé par des virgules)",
    metadata: "Métadonnées de pêche",
    speciesL: "Espèces",
    seasonsL: "Saisons",
    waterTypesL: "Types d'eau",
    techniquesL: "Techniques",
    watersL: "Eaux nommées",
    outOfStock: "rupture",
    inStock: "en stock",
    errGeneric: "L'enregistrement a échoué.",
    errSku: "Ce SKU est déjà utilisé par un autre produit :",
    errOrdered: "Cette taille a déjà été commandée et ne peut pas être retirée :",
  },
  en: {
    title: "Products",
    intro: "Edit a pattern: price, copy, photos, and above all stock per hook size.",
    back: "← Dashboard",
    edit: "Edit",
    close: "Close",
    save: "Save",
    saving: "Saving…",
    saved: "Saved",
    names: "Names",
    nameFr: "Name (French)",
    nameEn: "Name (English)",
    descriptions: "Descriptions",
    descFr: "Description (French)",
    descEn: "Description (English)",
    pricing: "Price and visibility",
    basePrice: "Base price (¢)",
    active: "For sale",
    featured: "Featured",
    images: "Photos",
    imagesHelp:
      "One path per line, e.g. /products/woolly-bugger-black-1.jpg. Leave empty to use the category illustration.",
    variants: "Sizes and stock",
    variantName: "Size (fr / en)",
    sku: "SKU",
    priceOverride: "Price (¢, blank = base price)",
    stock: "Stock",
    addVariant: "+ Add a size",
    removeVariant: "Remove",
    fishing: "How to fish it",
    howToFish: "How to fish it",
    proTip: "Tyer's tip",
    imitates: "Imitates (comma separated)",
    metadata: "Angling metadata",
    speciesL: "Species",
    seasonsL: "Seasons",
    waterTypesL: "Water types",
    techniquesL: "Techniques",
    watersL: "Named waters",
    outOfStock: "out of stock",
    inStock: "in stock",
    errGeneric: "Saving failed.",
    errSku: "That SKU already belongs to another product:",
    errOrdered: "That size has already been ordered and can't be removed:",
  },
} as const;

function Toggles({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() =>
                onChange(on ? selected.filter((v) => v !== o.value) : [...selected, o.value])
              }
              className={chipClass(on ? "accent" : "outline")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminProductsClient({
  locale,
  products,
  waters,
}: {
  locale: Locale;
  products: EditableProduct[];
  waters: WaterOption[];
}) {
  const t = T[locale];
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableProduct | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  // Saved rows are reflected locally rather than by reloading the page, so the
  // list under an open editor doesn't jump while someone is still working.
  const [saved, setSaved] = useState<Record<string, EditableProduct>>({});

  const rows = products.map((p) => saved[p.id] ?? p);

  function open(p: EditableProduct) {
    setOpenId(p.id);
    setDraft(structuredClone(p));
    setStatus("idle");
    setError(null);
  }

  function set<K extends keyof EditableProduct>(key: K, value: EditableProduct[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setStatus("idle");
  }

  function setVariant(index: number, patch: Partial<Variant>) {
    setDraft((d) => {
      if (!d) return d;
      const variants = d.variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
      return { ...d, variants };
    });
    setStatus("idle");
  }

  async function save() {
    if (!draft) return;
    setStatus("saving");
    setError(null);

    const res = await fetch(`/api/admin/products/${draft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameFr: draft.nameFr,
        nameEn: draft.nameEn,
        descriptionFr: draft.descriptionFr,
        descriptionEn: draft.descriptionEn,
        basePriceCents: draft.basePriceCents,
        active: draft.active,
        featured: draft.featured,
        images: draft.images,
        howToFishFr: draft.howToFishFr,
        howToFishEn: draft.howToFishEn,
        proTipFr: draft.proTipFr,
        proTipEn: draft.proTipEn,
        imitatesFr: draft.imitatesFr,
        imitatesEn: draft.imitatesEn,
        species: draft.species,
        seasons: draft.seasons,
        waterTypes: draft.waterTypes,
        techniques: draft.techniques,
        waterSlugs: draft.waterSlugs,
        variants: draft.variants,
      }),
    }).catch(() => null);

    if (!res || !res.ok) {
      const payload = res ? await res.json().catch(() => null) : null;
      if (payload?.error === "sku_taken") setError(`${t.errSku} ${payload.detail}`);
      else if (payload?.error === "variant_ordered") setError(`${t.errOrdered} ${payload.detail}`);
      else setError(payload?.detail ? `${t.errGeneric} ${payload.detail}` : t.errGeneric);
      setStatus("idle");
      return;
    }

    setSaved((s) => ({ ...s, [draft.id]: draft }));
    setStatus("saved");
  }

  const speciesOptions = SPECIES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));
  const seasonOptions = SEASONS.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));
  const waterTypeOptions = WATER_TYPES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));
  const techniqueOptions = TECHNIQUES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));
  const waterOptions = waters.map((w) => ({
    value: w.slug,
    label: locale === "fr" ? w.nameFr : w.nameEn,
  }));

  return (
    <div className="space-y-3">
      {rows.map((p) => {
        const isOpen = openId === p.id;
        const d = isOpen ? draft : null;
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);

        return (
          <div
            key={p.id}
            className="rounded-2xl border border-forest/15 bg-cream/40 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-forest">
                  {locale === "fr" ? p.nameFr : p.nameEn}
                </p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {p.slug} · {formatPrice(p.basePriceCents, locale, p.currency)} ·{" "}
                  <span className={totalStock > 0 ? "text-forest" : "text-rust"}>
                    {totalStock} {totalStock > 0 ? t.inStock : t.outOfStock}
                  </span>
                  {!p.active && " · —"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => (isOpen ? setOpenId(null) : open(p))}
                className="rounded-full border border-forest/25 px-4 py-1.5 text-sm font-medium text-forest transition hover:border-forest/60"
              >
                {isOpen ? t.close : t.edit}
              </button>
            </div>

            {isOpen && d && (
              <div className="mt-5 space-y-6 border-t border-forest/10 pt-5">
                {/* Stock leads, because it is the reason this page exists. */}
                <section>
                  <h3 className="font-display text-sm font-semibold text-forest">
                    {t.variants}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {d.variants.map((v, i) => (
                      <div
                        key={v.id ?? `new-${i}`}
                        className="grid gap-2 rounded-xl border border-forest/15 bg-parchment/60 p-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]"
                      >
                        <div>
                          <label className={LABEL}>{t.variantName}</label>
                          <input
                            className={INPUT}
                            value={v.nameFr}
                            onChange={(e) => setVariant(i, { nameFr: e.target.value })}
                          />
                          <input
                            className={INPUT}
                            value={v.nameEn}
                            onChange={(e) => setVariant(i, { nameEn: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={LABEL}>{t.sku}</label>
                          <input
                            className={INPUT}
                            value={v.sku}
                            onChange={(e) => setVariant(i, { sku: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={LABEL}>{t.priceOverride}</label>
                          <input
                            className={`${INPUT} w-28`}
                            inputMode="numeric"
                            value={v.priceCents ?? ""}
                            onChange={(e) =>
                              setVariant(i, {
                                priceCents:
                                  e.target.value.trim() === ""
                                    ? null
                                    : Number(e.target.value.replace(/\D/g, "")),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL}>{t.stock}</label>
                          <input
                            className={`${INPUT} w-24`}
                            inputMode="numeric"
                            value={v.stock}
                            onChange={(e) =>
                              setVariant(i, {
                                stock: Number(e.target.value.replace(/\D/g, "") || 0),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              setDraft((x) =>
                                x
                                  ? { ...x, variants: x.variants.filter((_, j) => j !== i) }
                                  : x
                              )
                            }
                            className="pb-2 text-xs font-medium text-rust hover:underline"
                          >
                            {t.removeVariant}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((x) =>
                        x
                          ? {
                              ...x,
                              variants: [
                                ...x.variants,
                                { nameFr: "", nameEn: "", sku: "", priceCents: null, stock: 0 },
                              ],
                            }
                          : x
                      )
                    }
                    className="mt-3 text-sm font-medium text-forest hover:text-rust"
                  >
                    {t.addVariant}
                  </button>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>{t.nameFr}</label>
                    <input
                      className={INPUT}
                      value={d.nameFr}
                      onChange={(e) => set("nameFr", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{t.nameEn}</label>
                    <input
                      className={INPUT}
                      value={d.nameEn}
                      onChange={(e) => set("nameEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{t.basePrice}</label>
                    <input
                      className={INPUT}
                      inputMode="numeric"
                      value={d.basePriceCents}
                      onChange={(e) =>
                        set("basePriceCents", Number(e.target.value.replace(/\D/g, "") || 0))
                      }
                    />
                  </div>
                  <div className="flex items-end gap-4 pb-2">
                    <label className="flex items-center gap-2 text-sm text-ink/80">
                      <input
                        type="checkbox"
                        checked={d.active}
                        onChange={(e) => set("active", e.target.checked)}
                      />
                      {t.active}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ink/80">
                      <input
                        type="checkbox"
                        checked={d.featured}
                        onChange={(e) => set("featured", e.target.checked)}
                      />
                      {t.featured}
                    </label>
                  </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>{t.descFr}</label>
                    <textarea
                      className={`${INPUT} h-28`}
                      value={d.descriptionFr}
                      onChange={(e) => set("descriptionFr", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{t.descEn}</label>
                    <textarea
                      className={`${INPUT} h-28`}
                      value={d.descriptionEn}
                      onChange={(e) => set("descriptionEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.howToFish} (fr)`}</label>
                    <textarea
                      className={`${INPUT} h-20`}
                      value={d.howToFishFr}
                      onChange={(e) => set("howToFishFr", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.howToFish} (en)`}</label>
                    <textarea
                      className={`${INPUT} h-20`}
                      value={d.howToFishEn}
                      onChange={(e) => set("howToFishEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.proTip} (fr)`}</label>
                    <textarea
                      className={`${INPUT} h-20`}
                      value={d.proTipFr}
                      onChange={(e) => set("proTipFr", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.proTip} (en)`}</label>
                    <textarea
                      className={`${INPUT} h-20`}
                      value={d.proTipEn}
                      onChange={(e) => set("proTipEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.imitates} (fr)`}</label>
                    <input
                      className={INPUT}
                      value={d.imitatesFr.join(", ")}
                      onChange={(e) =>
                        set(
                          "imitatesFr",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>{`${t.imitates} (en)`}</label>
                    <input
                      className={INPUT}
                      value={d.imitatesEn.join(", ")}
                      onChange={(e) =>
                        set(
                          "imitatesEn",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                </section>

                <section>
                  <label className={LABEL}>{t.images}</label>
                  <textarea
                    className={`${INPUT} h-20 font-mono text-xs`}
                    value={d.images.join("\n")}
                    onChange={(e) =>
                      set(
                        "images",
                        e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                  />
                  <p className="mt-1 text-xs text-ink/50">{t.imagesHelp}</p>
                </section>

                <section className="space-y-4">
                  <Toggles
                    label={t.speciesL}
                    options={speciesOptions}
                    selected={d.species}
                    onChange={(v) => set("species", v)}
                  />
                  <Toggles
                    label={t.seasonsL}
                    options={seasonOptions}
                    selected={d.seasons}
                    onChange={(v) => set("seasons", v)}
                  />
                  <Toggles
                    label={t.waterTypesL}
                    options={waterTypeOptions}
                    selected={d.waterTypes}
                    onChange={(v) => set("waterTypes", v)}
                  />
                  <Toggles
                    label={t.techniquesL}
                    options={techniqueOptions}
                    selected={d.techniques}
                    onChange={(v) => set("techniques", v)}
                  />
                  <Toggles
                    label={t.watersL}
                    options={waterOptions}
                    selected={d.waterSlugs}
                    onChange={(v) => set("waterSlugs", v)}
                  />
                </section>

                {error && <p className="text-sm font-medium text-rust">{error}</p>}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={save}
                    disabled={status === "saving"}
                    className="rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:opacity-60"
                  >
                    {status === "saving" ? t.saving : t.save}
                  </button>
                  {status === "saved" && (
                    <span className="text-sm font-medium text-forest">{t.saved}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
