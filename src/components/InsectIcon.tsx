// A stylized field-mark icon per hatch, not a photo -- there's no image
// generation in this toolchain, and an AI-rendered "photo" of a named
// species would risk being wrong about the one thing an icon like this is
// for. Instead: one silhouette per real wing/body plan (an upright-winged
// mayfly is not built like a tent-winged caddis, which is not built like a
// stonefly holding its wings flat), plus color and tail count pulled from
// the actual field marks already written for each species in
// insect-articles.ts. Same approach as FishAvatar -- shape by family, color
// and a real mark for the individual within it.

type Archetype =
  | "MAYFLY"
  | "CADDIS"
  | "STONEFLY"
  | "CHIRONOMID"
  | "CRANEFLY"
  | "ANT"
  | "BEETLE"
  | "HOPPER"
  | "CRICKET";

type InsectStyle = {
  archetype: Archetype;
  color: string;
  /** Mayflies only: 2 tails (e.g. Epeorus, Baetis) or 3 (most others). */
  tails?: 2 | 3;
  /** Wings described as mottled/barred rather than clear or uniform. */
  mottled?: boolean;
};

// Full literal class strings so Tailwind's scanner can see them -- same
// discipline as FishAvatar's AVATAR_STYLE.
const COLOR_CLASS: Record<string, string> = {
  forest: "bg-forest/15 text-forest border-forest/30",
  "forest-dark": "bg-forest-dark/15 text-forest-dark border-forest-dark/30",
  "forest-light": "bg-forest-light/15 text-forest-light border-forest-light/30",
  gold: "bg-gold/15 text-gold border-gold/30",
  rust: "bg-rust/15 text-rust border-rust/30",
  "rust-dark": "bg-rust-dark/15 text-rust-dark border-rust-dark/30",
  halo: "bg-halo/15 text-halo border-halo/30",
  belly: "bg-belly/15 text-belly border-belly/30",
  ink: "bg-ink/10 text-ink border-ink/25",
};

// One entry per Hatch id in hatches.ts -- color and marks below are drawn
// straight from that species' own idMarks in insect-articles.ts, not guessed.
const INSECT_STYLE: Record<string, InsectStyle> = {
  // Mayflies
  "quill-gordon": { archetype: "MAYFLY", color: "halo", tails: 2 },
  "blue-quill": { archetype: "MAYFLY", color: "halo", tails: 3 },
  hendrickson: { archetype: "MAYFLY", color: "rust", tails: 3 },
  "black-quill": { archetype: "MAYFLY", color: "forest-dark", tails: 3 },
  "blue-winged-olive": { archetype: "MAYFLY", color: "forest", tails: 2 },
  "march-brown": { archetype: "MAYFLY", color: "rust-dark", tails: 3, mottled: true },
  "grey-fox": { archetype: "MAYFLY", color: "gold", tails: 3, mottled: true },
  sulphur: { archetype: "MAYFLY", color: "gold", tails: 3 },
  "pale-evening-dun": { archetype: "MAYFLY", color: "gold", tails: 3 },
  "green-drake": { archetype: "MAYFLY", color: "forest", tails: 3, mottled: true },
  "brown-drake": { archetype: "MAYFLY", color: "rust-dark", tails: 3, mottled: true },
  "grey-drake": { archetype: "MAYFLY", color: "halo", tails: 3 },
  "pink-lady": { archetype: "MAYFLY", color: "belly", tails: 2 },
  "light-cahill": { archetype: "MAYFLY", color: "gold", tails: 3 },
  drunella: { archetype: "MAYFLY", color: "forest-dark", tails: 3 },
  hexagenia: { archetype: "MAYFLY", color: "gold", tails: 3, mottled: true },
  "golden-drake": { archetype: "MAYFLY", color: "gold", tails: 3 },
  trico: { archetype: "MAYFLY", color: "forest-dark", tails: 2 },
  "slate-drake": { archetype: "MAYFLY", color: "halo", tails: 3 },
  "mahogany-dun": { archetype: "MAYFLY", color: "rust-dark", tails: 3 },
  callibaetis: { archetype: "MAYFLY", color: "forest", tails: 2 },

  // Caddis
  grannom: { archetype: "CADDIS", color: "ink" },
  "little-black-caddis": { archetype: "CADDIS", color: "ink" },
  "spotted-sedge": { archetype: "CADDIS", color: "gold", mottled: true },
  "green-rock-worm": { archetype: "CADDIS", color: "forest" },
  "little-sister-sedge": { archetype: "CADDIS", color: "gold", mottled: true },
  "october-caddis": { archetype: "CADDIS", color: "rust", mottled: true },

  // Stoneflies
  "winter-black-stone": { archetype: "STONEFLY", color: "ink" },
  "early-brown-stone": { archetype: "STONEFLY", color: "rust-dark" },
  "giant-black-stone": { archetype: "STONEFLY", color: "ink" },
  "golden-stone": { archetype: "STONEFLY", color: "gold", mottled: true },
  "yellow-sally": { archetype: "STONEFLY", color: "gold" },

  // Midges & crane flies
  chironomids: { archetype: "CHIRONOMID", color: "halo" },
  "crane-fly": { archetype: "CRANEFLY", color: "gold" },

  // Terrestrials
  ants: { archetype: "ANT", color: "ink" },
  beetles: { archetype: "BEETLE", color: "forest-dark" },
  hoppers: { archetype: "HOPPER", color: "forest" },
  crickets: { archetype: "CRICKET", color: "rust-dark" },
};

const UNSET_STYLE = "bg-ink/5 text-ink/25 border-ink/10";

const SIZE = {
  sm: { badge: "h-6 w-6", icon: "h-3.5 w-3.5" },
  md: { badge: "h-9 w-9", icon: "h-5 w-5" },
  lg: { badge: "h-16 w-16", icon: "h-9 w-9" },
} as const;

function MayflyGlyph({ tails = 3, mottled }: { tails?: 2 | 3; mottled?: boolean }) {
  return (
    <>
      <ellipse cx="12" cy="12.5" rx="1.1" ry="4.5" />
      <path d="M12 8C10.7 6.3 10.7 2.7 12 1C13.3 2.7 13.3 6.3 12 8Z" />
      <path d="M12 8C11 6.8 11 4.3 12 3" opacity={0.5} />
      {mottled && (
        <path d="M11.3 3.5h.01M12.7 4.5h.01M11.3 5.8h.01" strokeWidth={0.8} opacity={0.7} />
      )}
      {tails === 2 ? (
        <path d="M11.3 17L9.5 21M12.7 17L14.5 21" />
      ) : (
        <path d="M12 17V21.3M10.7 17L9 21M13.3 17L15 21" />
      )}
    </>
  );
}

function CaddisGlyph({ mottled }: { mottled?: boolean }) {
  return (
    <>
      <ellipse cx="12" cy="14" rx="5.5" ry="1.8" />
      <path d="M5 12c2.5-3.5 5-4.5 7-4.5s4.5 1 7 4.5c-2.5 1.3-5 1.8-7 1.8s-4.5-.5-7-1.8z" />
      <path d="M7 11c-1-1.8-1.3-3.6-.8-5.3M8 10.3c-.2-1.9 0-3.6 1-5" />
      {mottled && (
        <path d="M9.5 11.3h.01M12 10.6h.01M14.5 11.3h.01" strokeWidth={0.8} opacity={0.7} />
      )}
    </>
  );
}

function StoneflyGlyph({ mottled }: { mottled?: boolean }) {
  return (
    <>
      <rect x="6.5" y="10.5" width="10" height="4.5" rx="2" />
      <path d="M7 11.3h9M7 14h9" opacity={0.55} />
      <path d="M16.5 11.5l3-1.3M16.5 14l3 1.3" />
      <path d="M6.5 11.3l-1.8-1M6.5 13.5l-1.8 1" />
      {mottled && <path d="M9 12.6h.01M12 12.6h.01M15 12.6h.01" strokeWidth={0.8} opacity={0.7} />}
    </>
  );
}

function ChironomidGlyph() {
  return (
    <>
      <ellipse cx="12" cy="12.5" rx="3" ry="3.5" />
      <path d="M9.2 11l-3-1.3M14.8 11l3-1.3" opacity={0.6} />
      <path d="M10 15.5l-2.5 4M12 16l-.5 4.3M14 15.5l2.5 4M9.5 10l-3-2.5M14.5 10l3-2.5" />
    </>
  );
}

function CraneflyGlyph() {
  return (
    <>
      <ellipse cx="12" cy="11" rx="5.5" ry="1.3" />
      <path d="M7 10c2.3-1.6 8.7-1.6 11 0M7 12c2.3 1.6 8.7 1.6 11 0" opacity={0.5} />
      <path d="M8.5 12l-3.5 8M10.5 12l-1 8.5M13.5 12l1 8.5M15.5 12l3.5 8M8 11l-4.5 2.5M16 11l4.5 2.5" />
    </>
  );
}

function AntGlyph() {
  return (
    <>
      <circle cx="6.5" cy="12" r="1.4" />
      <circle cx="10.5" cy="12.5" r="1.8" />
      <path d="M12.3 12.5h1" />
      <ellipse cx="16.5" cy="12.8" rx="3.3" ry="2.5" />
      <path d="M5.5 11l-1-2M5.5 11l-2.2-.6" />
      <path d="M11 10.5c2-3 6.5-4 9-2.7M11 10.5c1-3.3 4-5.7 7-6" opacity={0.45} />
      <path d="M10 14l-1.5 2.5M13.5 14.3v2.8M16 14.8l1.5 2.5" opacity={0.7} />
    </>
  );
}

function BeetleGlyph() {
  return (
    <>
      <ellipse cx="12" cy="13" rx="6" ry="4" />
      <path d="M12 9.2v7.6" opacity={0.6} />
      <circle cx="6.3" cy="13" r="1.2" />
      <path
        d="M8.5 16l-2 2.3M12 17v3M15.5 16l2 2.3M8.5 10l-2-2.3M15.5 10l2-2.3"
        opacity={0.7}
      />
    </>
  );
}

function HopperGlyph() {
  return (
    <>
      <path d="M5 13c0-1.6 1.3-2.8 3-2.8h7c2 0 3.5 1.3 3.5 2.8s-1.5 2.8-3.5 2.8H8c-1.7 0-3-1.2-3-2.8z" />
      <path d="M5 12.3c-.8-.3-1.5-.2-2 .3s-.5 1.2 0 1.7c.5.5 1.2.6 2 .3" opacity={0.7} />
      <path d="M14 14.5l3.5-.5-.5 3-3.5 1z" />
      <path d="M8 15.5l-1.5 2.5M11 15.5l-.5 2.8" opacity={0.7} />
    </>
  );
}

function CricketGlyph() {
  return (
    <>
      <ellipse cx="13" cy="13" rx="5" ry="3" />
      <path
        d="M8.3 11.7c-2.3-2-4.8-2.2-6.3-1.2M8.3 12.8c-2.5-1-5-.3-6.6 1.4"
        opacity={0.85}
      />
      <path d="M16.5 14.5l2.8 1-1 2.8-2.8-.8z" />
      <path d="M10.5 15.7l-1.2 2.3M13 16v2.5" opacity={0.7} />
    </>
  );
}

export function InsectIcon({
  hatchId,
  size = "md",
  title,
}: {
  hatchId: string;
  size?: keyof typeof SIZE;
  /** Insect display name, if the caller has it -- shown as a tooltip. */
  title?: string;
}) {
  const { badge, icon } = SIZE[size];
  const style = INSECT_STYLE[hatchId];
  const colorClass = style ? COLOR_CLASS[style.color] : UNSET_STYLE;

  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border ${badge} ${colorClass}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={icon}
        aria-hidden
      >
        {style?.archetype === "MAYFLY" && (
          <MayflyGlyph tails={style.tails} mottled={style.mottled} />
        )}
        {style?.archetype === "CADDIS" && <CaddisGlyph mottled={style.mottled} />}
        {style?.archetype === "STONEFLY" && <StoneflyGlyph mottled={style.mottled} />}
        {style?.archetype === "CHIRONOMID" && <ChironomidGlyph />}
        {style?.archetype === "CRANEFLY" && <CraneflyGlyph />}
        {style?.archetype === "ANT" && <AntGlyph />}
        {style?.archetype === "BEETLE" && <BeetleGlyph />}
        {style?.archetype === "HOPPER" && <HopperGlyph />}
        {style?.archetype === "CRICKET" && <CricketGlyph />}
      </svg>
    </span>
  );
}
