// Server-side only: this reaches the Canada Post credentials, so it must never
// be imported from a client component. (Not using the `server-only` package to
// enforce that — it isn't a declared dependency here, and importing something
// that isn't installed is a worse failure than the one it guards against.)
import { getRates, isValidPostalCode } from "@/lib/canada-post";
import {
  LETTER_RATE_CENTS,
  isFreeShipping,
  packagingFor,
  trackedRateCents,
  type ShippingMethod,
} from "@/lib/shipping";

export type RateSource = "live" | "zone" | "flat";

/** One Canada Post service tier, at its real (never free-adjusted) price. */
export type ServiceOption = {
  serviceCode: string;
  serviceName: string;
  cents: number;
  transitDays: number | null;
};

export type ResolvedRate = {
  /** What to actually charge for the selected/effective tier — 0 when the
   *  cheapest tier qualifies for free shipping. */
  cents: number;
  source: RateSource;
  serviceCode?: string;
  serviceName?: string;
  transitDays?: number | null;
  /** Every live tier at its real price, cheapest first. Only present when
   *  source is "live" — the zone table and the flat letter rate have no
   *  tiers to choose between. */
  services?: ServiceOption[];
};

// Rates change a few times a year, not a few times an hour, so a short cache
// spares the API a call per keystroke at checkout without ever serving a stale
// price for long. In-memory means it's per serverless instance and empties on
// deploy — that's fine here: a miss costs one API call, not a wrong price.
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; quotes: ServiceOption[] }>();

function cacheKey(postal: string, grams: number, language: string): string {
  // The first three characters decide the destination zone, so quoting by FSA
  // rather than full postal code gets far more cache hits for the same answer.
  return `${postal.toUpperCase().replace(/\s/g, "").slice(0, 3)}:${grams}:${language}`;
}

/**
 * What to charge for shipping, preferring a live Canada Post quote and falling
 * back to the static zone table.
 *
 * Lettermail is never quoted live — the Rating API covers parcels only — so the
 * letter option keeps its flat price. That's deliberate: it's the cheapest way
 * to send a few flies, and losing it to "live rates" would roughly triple the
 * postage on a small order.
 *
 * Free shipping only zeroes out the CHEAPEST tracked tier. A customer can
 * still pay to upgrade to a faster service above the free-shipping threshold —
 * giving away Priority ($78 in the dearest zone) for free on a $100 order
 * would blow well past the margin the threshold was set to protect.
 */
export async function resolveShippingRate(
  method: ShippingMethod,
  province: string,
  postalCode: string,
  flyCount: number,
  opts: {
    subtotalCents?: number;
    serviceCode?: string;
    language?: "en-CA" | "fr-CA";
  } = {}
): Promise<ResolvedRate> {
  if (method === "LETTER") {
    return { cents: LETTER_RATE_CENTS, source: "flat" };
  }

  const subtotalCents = opts.subtotalCents ?? 0;
  const free = isFreeShipping(subtotalCents);
  const language = opts.language ?? "en-CA";

  const fallback: ResolvedRate = {
    cents: free ? 0 : trackedRateCents(province),
    source: "zone",
  };

  if (!isValidPostalCode(postalCode)) return fallback;

  const pack = packagingFor(flyCount, "TRACKED");
  const [length, width, height] = pack.dimensionsCm
    .split("×")
    .map((n) => parseFloat(n.trim()));

  const key = cacheKey(postalCode, pack.weightGrams, language);
  const hit = cache.get(key);
  const quotes =
    hit && Date.now() - hit.at < TTL_MS
      ? hit.quotes
      : await getRates(postalCode, pack.weightGrams, { length, width, height }, language).then(
          (rates) =>
            rates?.map((r) => ({
              serviceCode: r.serviceCode,
              // `due` is Canada Post's tax-inclusive total, which is what
              // leaves your pocket at the counter. Charging the pre-tax `base`
              // would lose 5-15% depending on the destination province.
              cents: r.dueCents,
              serviceName: r.serviceName,
              transitDays: r.transitDays,
            })) ?? null
        );

  if (!quotes || quotes.length === 0) return fallback;
  cache.set(key, { at: Date.now(), quotes });

  const cheapest = quotes[0];
  const selected = opts.serviceCode
    ? (quotes.find((q) => q.serviceCode === opts.serviceCode) ?? cheapest)
    : cheapest;
  const isCheapest = selected.serviceCode === cheapest.serviceCode;

  return {
    cents: isCheapest && free ? 0 : selected.cents,
    source: "live",
    serviceCode: selected.serviceCode,
    serviceName: selected.serviceName,
    transitDays: selected.transitDays,
    services: quotes,
  };
}
