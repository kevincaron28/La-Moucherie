// Server-side only: this reaches the Canada Post credentials, so it must never
// be imported from a client component. (Not using the `server-only` package to
// enforce that — it isn't a declared dependency here, and importing something
// that isn't installed is a worse failure than the one it guards against.)
import { cheapestTrackedCents, isValidPostalCode } from "@/lib/canada-post";
import {
  LETTER_RATE_CENTS,
  packagingFor,
  trackedRateCents,
  type ShippingMethod,
} from "@/lib/shipping";

export type RateSource = "live" | "zone" | "flat";

export type ResolvedRate = {
  cents: number;
  source: RateSource;
  serviceName?: string;
  transitDays?: number | null;
};

// Rates change a few times a year, not a few times an hour, so a short cache
// spares the API a call per keystroke at checkout without ever serving a stale
// price for long. In-memory means it's per serverless instance and empties on
// deploy — that's fine here: a miss costs one API call, not a wrong price.
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; rate: ResolvedRate }>();

function cacheKey(postal: string, grams: number): string {
  // The first three characters decide the destination zone, so quoting by FSA
  // rather than full postal code gets far more cache hits for the same answer.
  return `${postal.toUpperCase().replace(/\s/g, "").slice(0, 3)}:${grams}`;
}

/**
 * What to charge for shipping, preferring a live Canada Post quote and falling
 * back to the static zone table.
 *
 * Lettermail is never quoted live — the Rating API covers parcels only — so the
 * letter option keeps its flat price. That's deliberate: it's the cheapest way
 * to send a few flies, and losing it to "live rates" would roughly triple the
 * postage on a small order.
 */
export async function resolveShippingRate(
  method: ShippingMethod,
  province: string,
  postalCode: string,
  flyCount: number
): Promise<ResolvedRate> {
  if (method === "LETTER") {
    return { cents: LETTER_RATE_CENTS, source: "flat" };
  }

  const fallback: ResolvedRate = {
    cents: trackedRateCents(province),
    source: "zone",
  };

  if (!isValidPostalCode(postalCode)) return fallback;

  const pack = packagingFor(flyCount, "TRACKED");
  const [length, width, height] = pack.dimensionsCm
    .split("×")
    .map((n) => parseFloat(n.trim()));

  const key = cacheKey(postalCode, pack.weightGrams);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.rate;

  const quote = await cheapestTrackedCents(postalCode, pack.weightGrams, {
    length,
    width,
    height,
  });

  if (!quote) return fallback;

  const rate: ResolvedRate = {
    // `due` is Canada Post's tax-inclusive total, which is what leaves your
    // pocket at the counter. Charging the pre-tax `base` would lose 5-15%
    // depending on the destination province.
    cents: quote.dueCents,
    source: "live",
    serviceName: quote.serviceName,
    transitDays: quote.transitDays,
  };

  cache.set(key, { at: Date.now(), rate });
  return rate;
}
