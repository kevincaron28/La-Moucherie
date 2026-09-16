import type { Locale } from "@/i18n/routing";

export function pick(fr: string, en: string, locale: Locale) {
  return locale === "fr" ? fr : en;
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

