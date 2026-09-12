import type { Locale } from "@/i18n/routing";

export function pick(fr: string, en: string, locale: Locale) {
  return locale === "fr" ? fr : en;
}

// Flies only for now — materials/tools/kits are on hold due to a team supplier
// agreement (TFO). The MATERIAL/TOOL/KIT categories still exist in the schema
// for when that changes; they're just left out of this shop-facing list.
export const CATEGORY_ORDER = ["DRY_FLY", "NYMPH", "STREAMER", "WET_FLY"] as const;
