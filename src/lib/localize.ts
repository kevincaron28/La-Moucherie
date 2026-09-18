import type { ProductCategory } from "@prisma/client";
import type { Locale } from "@/i18n/routing";

export function pick(fr: string, en: string, locale: Locale) {
  return locale === "fr" ? fr : en;
}

// No product photography yet for most patterns, so this stands in with a
// minimalist illustration of the fly type instead of a generic blank square.
const PLACEHOLDER_BY_CATEGORY: Partial<Record<ProductCategory, string>> = {
  WET_FLY: "/products/placeholder-fly-wet.svg",
  NYMPH: "/products/placeholder-fly-nymph.svg",
  STREAMER: "/products/placeholder-fly-streamer.svg",
  ASSORTMENT: "/products/placeholder-fly-assortment.svg",
};

export function placeholderForCategory(category: ProductCategory) {
  return PLACEHOLDER_BY_CATEGORY[category] ?? "/products/placeholder-fly.svg";
}

// Flies only for now — materials/tools/kits are on hold due to a team supplier
// agreement (TFO). The MATERIAL/TOOL/KIT categories still exist in the schema
// for when that changes; they're just left out of this shop-facing list.
// Assortments lead: a curated box is one decision instead of twelve, which is
// the easiest thing for a new customer to say yes to.
export const CATEGORY_ORDER = [
  "ASSORTMENT",
  "DRY_FLY",
  "NYMPH",
  "STREAMER",
  "WET_FLY",
] as const;

