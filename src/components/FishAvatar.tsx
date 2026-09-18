import type { Species } from "@/lib/angling";

// An avatar, not a photo: picking a species costs one tap and needs no
// upload pipeline, and it says something about the angler either way. One
// simple fish glyph in `currentColor`, recolored per species from the
// brand's own palette rather than nine hand-drawn illustrations -- full
// literal class strings below so Tailwind's scanner can see them.
const AVATAR_STYLE: Record<Species, string> = {
  BROOK_TROUT: "bg-forest/15 text-forest border-forest/30",
  BROWN_TROUT: "bg-gold/15 text-gold border-gold/30",
  RAINBOW_TROUT: "bg-rust/15 text-rust border-rust/30",
  LANDLOCKED_SALMON: "bg-halo/15 text-halo border-halo/30",
  ATLANTIC_SALMON: "bg-belly/15 text-belly border-belly/30",
  SMALLMOUTH_BASS: "bg-forest-light/15 text-forest-light border-forest-light/30",
  LARGEMOUTH_BASS: "bg-forest/15 text-forest border-forest/30",
  NORTHERN_PIKE: "bg-halo/15 text-halo border-halo/30",
  WALLEYE: "bg-gold/15 text-gold border-gold/30",
};

const UNSET_STYLE = "bg-ink/5 text-ink/25 border-ink/10";

const SIZE = {
  sm: { badge: "h-6 w-6", icon: "h-3.5 w-3.5" },
  md: { badge: "h-9 w-9", icon: "h-5 w-5" },
  lg: { badge: "h-16 w-16", icon: "h-9 w-9" },
} as const;

export function FishAvatar({
  species,
  size = "md",
  title,
}: {
  species: Species | null;
  size?: keyof typeof SIZE;
  /** Species display name, if the caller has it -- shown as a tooltip. */
  title?: string;
}) {
  const { badge, icon } = SIZE[size];
  const style = species ? AVATAR_STYLE[species] : UNSET_STYLE;

  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border ${badge} ${style}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={icon}
        aria-hidden
      >
        <path d="M3 12c3-4 8-6 13-6 3 0 5 2 5 2l-2 4 2 4s-2 2-5 2c-5 0-10-2-13-6z" />
        <circle cx="16" cy="10" r="0.7" fill="currentColor" stroke="none" />
        <path d="M3 12l-2-3M3 12l-2 3" />
      </svg>
    </span>
  );
}
