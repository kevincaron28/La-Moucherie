import type { Species } from "@/lib/angling";

// An avatar, not a photo: picking a species costs one tap and needs no
// upload pipeline, and it says something about the angler either way. One
// shared fish silhouette, but color AND a real field mark vary per species
// (the same marks a hatch report would ask an angler to notice), so two
// avatars never read as "the same icon, different tint." Full literal class
// strings below so Tailwind's scanner can see them.
const AVATAR_STYLE: Record<Species, string> = {
  BROOK_TROUT: "bg-forest/15 text-forest border-forest/30",
  BROWN_TROUT: "bg-gold/15 text-gold border-gold/30",
  RAINBOW_TROUT: "bg-rust/15 text-rust border-rust/30",
  LANDLOCKED_SALMON: "bg-halo/15 text-halo border-halo/30",
  ATLANTIC_SALMON: "bg-belly/15 text-belly border-belly/30",
  SMALLMOUTH_BASS: "bg-forest-light/15 text-forest-light border-forest-light/30",
  LARGEMOUTH_BASS: "bg-rust-dark/15 text-rust-dark border-rust-dark/30",
  NORTHERN_PIKE: "bg-forest-dark/15 text-forest-dark border-forest-dark/30",
  WALLEYE: "bg-gold/15 text-gold border-gold/30",
};

// One short field mark per species, drawn at strokeWidth 1 inside the body
// (roughly x:6-16, y:9-15) -- a dot is a zero-length round-capped line.
const MARKS: Record<Species, string> = {
  BROOK_TROUT: "M6 10c1-1 2 1 3 0s2-1 3 0 2 1 3 0M6 13.5c1-1 2 1 3 0s2-1 3 0 2 1 3 0",
  BROWN_TROUT: "M8 10.3h.01M11.5 12.6h.01M8.6 14.6h.01M14 10.9h.01",
  RAINBOW_TROUT: "M6 12.5h10",
  LANDLOCKED_SALMON: "M8 9.5v5M11 9v6M14 9.5v5",
  ATLANTIC_SALMON: "M7.3 10.3l1 1m-1 0l1-1M11 12.3l1 1m-1 0l1-1M14.3 10.3l1 1m-1 0l1-1",
  SMALLMOUTH_BASS: "M7.5 9v6M11 8.5v7M14.5 9v6",
  LARGEMOUTH_BASS: "M6 12.5h11",
  NORTHERN_PIKE:
    "M7 10h1.4M10 9.3h1.4M13 10h1.4M8 13.6h1.4M11.5 14.1h1.4M14.5 13.6h1.4",
  // The eye does the work for walleye (see below) -- a single pale gill mark
  // is enough here so the body isn't left bare.
  WALLEYE: "M17.3 9.2v3",
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
  // Walleye's whole identity is the oversized, light-gathering eye -- give it
  // one rather than relying on color and marks alone.
  const eyeRadius = species === "WALLEYE" ? 1.15 : 0.7;

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
        <circle cx="16" cy="10" r={eyeRadius} fill="currentColor" stroke="none" />
        <path d="M3 12l-2-3M3 12l-2 3" />
        {species && <path d={MARKS[species]} strokeWidth={1} />}
      </svg>
    </span>
  );
}
