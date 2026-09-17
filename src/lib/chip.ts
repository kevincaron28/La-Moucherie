export type ChipVariant = "solid" | "outline" | "accent";

/**
 * One small-label treatment shared by reviews, community catches and angler
 * hatch reports — species, water, hook size, "via Instagram" links, and so
 * on. Kept in one place so a site that's mostly user-submitted content
 * doesn't grow three slightly different chip styles by accident.
 *
 * - solid: a fact about the item (species, hatch, intensity)
 * - outline: a secondary fact, lower emphasis
 * - accent: a link out (to a product, or to the original Instagram post)
 */
export function chipClass(variant: ChipVariant = "solid"): string {
  switch (variant) {
    case "outline":
      return "rounded-full border border-forest/20 px-2.5 py-1 text-xs text-ink/70";
    case "accent":
      return "rounded-full border border-rust/40 px-2.5 py-1 text-xs font-medium text-rust transition hover:bg-rust/5";
    case "solid":
    default:
      return "rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest";
  }
}
