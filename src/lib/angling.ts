// The vocabulary customers actually shop in. Fly type is how a tyer organises a
// bench; species, water and season are how an angler decides what to buy.
//
// Order matters: these arrays drive filter menus and landing-page listings, so
// the most-fished species in Québec come first rather than alphabetically.

export const SPECIES = [
  "BROOK_TROUT",
  "BROWN_TROUT",
  "RAINBOW_TROUT",
  "LANDLOCKED_SALMON",
  "ATLANTIC_SALMON",
  "SMALLMOUTH_BASS",
  "LARGEMOUTH_BASS",
  "NORTHERN_PIKE",
  "WALLEYE",
] as const;
export type Species = (typeof SPECIES)[number];

export const SEASONS = ["SPRING", "SUMMER", "FALL"] as const;
export type Season = (typeof SEASONS)[number];

export const WATER_TYPES = ["RIVER", "STREAM", "LAKE", "STILLWATER"] as const;
export type WaterTypeKey = (typeof WATER_TYPES)[number];

export const TECHNIQUES = [
  "DEAD_DRIFT",
  "NYMPHING",
  "STRIP",
  "SWING",
  "SKATE",
  "TROLLING",
] as const;
export type TechniqueKey = (typeof TECHNIQUES)[number];

/** URL slugs kept stable across locales so a shared link works in either. */
export const SPECIES_SLUGS: Record<Species, string> = {
  BROOK_TROUT: "omble-de-fontaine",
  BROWN_TROUT: "truite-brune",
  RAINBOW_TROUT: "truite-arc-en-ciel",
  LANDLOCKED_SALMON: "ouananiche",
  ATLANTIC_SALMON: "saumon-atlantique",
  SMALLMOUTH_BASS: "achigan-a-petite-bouche",
  LARGEMOUTH_BASS: "achigan-a-grande-bouche",
  NORTHERN_PIKE: "grand-brochet",
  WALLEYE: "dore-jaune",
};

export function speciesFromSlug(slug: string): Species | null {
  const entry = Object.entries(SPECIES_SLUGS).find(([, s]) => s === slug);
  return entry ? (entry[0] as Species) : null;
}

export function isSpecies(value: unknown): value is Species {
  return typeof value === "string" && (SPECIES as readonly string[]).includes(value);
}
