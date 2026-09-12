import type { Locale } from "@/i18n/routing";

export function pick(fr: string, en: string, locale: Locale) {
  return locale === "fr" ? fr : en;
}

export const CATEGORY_ORDER = [
  "DRY_FLY",
  "NYMPH",
  "STREAMER",
  "WET_FLY",
  "MATERIAL",
  "TOOL",
  "KIT",
] as const;
