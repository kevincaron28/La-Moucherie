import type { Locale } from "@/i18n/routing";

// A title, not a rank: there's no leaderboard, no position to compare
// against anyone else's. The point is to make a returning angler's history
// legible at a glance -- "this person's reports have held up before" -- not
// to turn posting into a competition. Thresholds are the sum of upvotes an
// account's own hatch reports and catches have collected (User.reputation).
export type ReputationTier = { threshold: number; titleFr: string; titleEn: string };

export const REPUTATION_TIERS: ReputationTier[] = [
  { threshold: 0, titleFr: "Nouveau venu", titleEn: "Newcomer" },
  { threshold: 3, titleFr: "Habitué de la rivière", titleEn: "River Regular" },
  { threshold: 10, titleFr: "Canne fiable", titleEn: "Trusted Rod" },
  { threshold: 25, titleFr: "Guide de confiance", titleEn: "Trusted Guide" },
  { threshold: 60, titleFr: "Légende de la rivière", titleEn: "River Legend" },
];

export function reputationTitle(reputation: number, locale: Locale): string {
  let current = REPUTATION_TIERS[0];
  for (const tier of REPUTATION_TIERS) {
    if (reputation >= tier.threshold) current = tier;
  }
  return locale === "fr" ? current.titleFr : current.titleEn;
}
