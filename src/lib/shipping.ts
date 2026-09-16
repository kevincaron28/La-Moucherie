// Flies weigh about a gram each, so what actually sets the postage is thickness
// and whether the parcel is tracked — not weight. Canada Post prices those two
// cases very differently, which is why one flat rate can't be fair: it
// overcharges a three-fly envelope and loses money on anything tracked.
export const SHIPPING_METHODS = ["LETTER", "TRACKED"] as const;
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

/** Shipping origin: Montérégie, Québec. Zones below are distances from here. */
export const ORIGIN_POSTAL_CODE = "J0L 2N0";

export const PROVINCES = [
  { code: "QC", nameFr: "Québec", nameEn: "Quebec" },
  { code: "ON", nameFr: "Ontario", nameEn: "Ontario" },
  { code: "NB", nameFr: "Nouveau-Brunswick", nameEn: "New Brunswick" },
  { code: "NS", nameFr: "Nouvelle-Écosse", nameEn: "Nova Scotia" },
  { code: "PE", nameFr: "Île-du-Prince-Édouard", nameEn: "Prince Edward Island" },
  { code: "NL", nameFr: "Terre-Neuve-et-Labrador", nameEn: "Newfoundland and Labrador" },
  { code: "MB", nameFr: "Manitoba", nameEn: "Manitoba" },
  { code: "SK", nameFr: "Saskatchewan", nameEn: "Saskatchewan" },
  { code: "AB", nameFr: "Alberta", nameEn: "Alberta" },
  { code: "BC", nameFr: "Colombie-Britannique", nameEn: "British Columbia" },
  { code: "YT", nameFr: "Yukon", nameEn: "Yukon" },
  { code: "NT", nameFr: "Territoires du Nord-Ouest", nameEn: "Northwest Territories" },
  { code: "NU", nameFr: "Nunavut", nameEn: "Nunavut" },
] as const;

export type ProvinceCode = (typeof PROVINCES)[number]["code"];

export type ShippingZone = "QC" | "ONTARIO" | "ATLANTIC" | "WEST" | "NORTH";

// Ontario is its own zone rather than lumped with the Atlantic provinces: the
// rates differ by ~45% across that span, and billing the whole zone at the
// Newfoundland rate would overcharge every Ontario customer by a third.
const ZONE_BY_PROVINCE: Record<ProvinceCode, ShippingZone> = {
  QC: "QC",
  ON: "ONTARIO",
  NB: "ATLANTIC",
  NS: "ATLANTIC",
  PE: "ATLANTIC",
  NL: "ATLANTIC",
  MB: "WEST",
  SK: "WEST",
  AB: "WEST",
  BC: "WEST",
  YT: "NORTH",
  NT: "NORTH",
  NU: "NORTH",
};

// Lettermail is priced by format and weight only, never by distance, so one
// number covers the whole country. (It's also why the Canada Post Rating API
// can't quote it — the API rates parcels, and Lettermail isn't one.)
export const LETTER_RATE_CENTS = 350;

// How many flies stay on the flat rate. Not a postage-cost question — the
// Lettermail bracket is flat up to 100g/2cm, so the $0.50 margin ($3.50
// charged vs ~$3.00 real cost) is the same whether the envelope holds 3
// flies or 30. The real question is which orders should GET the subsidized
// rate at all.
//
// A 12-fly order is roughly $45-55 — still price-sensitive enough that a
// $22-32 tracked charge would nearly double the total and kill the sale,
// which is the actual reason Lettermail exists (see the file header). A
// 13+-fly order is $50-140+: a customer already committing to that size
// purchase is far less likely to abandon over real shipping, and tracking is
// worth more to them on a bigger, higher-value parcel. Below 12, protect the
// sale with the flat rate; above it, charge what shipping actually costs
// rather than giving away margin nobody was asking for.
//
// (12 also sits comfortably inside the physical bracket regardless — this
// was 36 before, itself a judgment call on what lies flat in a 2cm envelope
// without crushing, so 12 was never going to be the tight constraint.)
const LETTER_TARE_GRAMS = 15;
const LETTER_GRAMS_PER_FLY = 1;

export const LETTER_MAX_FLIES = 12;

export function canUseLetter(flyCount: number): boolean {
  return flyCount <= LETTER_MAX_FLIES;
}

// Tracked parcel varies by distance. Each zone is billed at the WORST case
// inside it — the furthest destination quoted — because a zone rate set from
// its cheapest city quietly loses money on every order to its far edge.
//
// Figures are tax-inclusive. Canada Post quotes before tax but charges it at
// the counter, so a pre-tax rate here would lose ~13-15% on every parcel.
//
// Source: live quotes from /api/admin/canada-post-check (the actual Rating
// API this code calls), 80g in a 20x15x5cm box from J0L 2N0 — the small-box
// weight packagingFor() actually ships most tracked orders at, not the 500g
// this table used to assume. A spot-check at 2000g (unrealistically heavy for
// a fly order) only moved the Atlantic quote from $25.35 to $32.30, so the
// remaining sensitivity between 80g and the real 150g medium-box ceiling is
// small — these figures are a close, safe read on what orders actually cost.
export const TRACKED_RATE_BY_ZONE_CENTS: Record<ShippingZone, number> = {
  QC: 2153, // Gaspé, the far edge of the province
  ONTARIO: 1750, // Toronto
  ATLANTIC: 2535, // St. John's, the dearest quote of the set
  WEST: 2259, // Vancouver
  NORTH: 2904, // Iqaluit
};

export function zoneForProvince(province: string): ShippingZone {
  const zone = ZONE_BY_PROVINCE[province as ProvinceCode];
  // An unknown province bills the highest zone rather than the lowest: guessing
  // cheap here means quietly eating the difference on every such order.
  return zone ?? "NORTH";
}

export function isProvinceCode(value: unknown): value is ProvinceCode {
  return (
    typeof value === "string" && PROVINCES.some((p) => p.code === value)
  );
}

export function trackedRateCents(province: string): number {
  return TRACKED_RATE_BY_ZONE_CENTS[zoneForProvince(province)];
}

export function rateFor(method: ShippingMethod, province: string): number {
  return method === "LETTER" ? LETTER_RATE_CENTS : trackedRateCents(province);
}

// Free shipping pays for itself by pushing order size up, but only above a
// value where the margin already covers the parcel. It applies to the tracked
// rate: giving away the untracked one saves the customer little and teaches
// nothing.
//
// Raised from $75 once real rates came in. The original $75 -> $100 call used
// a $32.14 Atlantic estimate that turned out to be built on a 500g parcel;
// real tracked orders ship at 80-150g (see TRACKED_RATE_BY_ZONE_CENTS above),
// and the live quote at that weight is $25.35. Judged against the
// post-discount subtotal (see create-payment-intent), so it's real revenue,
// not list price: $25.35 / $100 = 25.35%, comfortably under the 1/3 ceiling
// this number was chosen to respect — real headroom, not the near-zero margin
// the stale estimate implied. Whether to use that headroom (e.g. lowering the
// threshold so more of the mid-size orders LETTER_MAX_FLIES pushed onto real
// tracked rates can reach free shipping) is a conversion-vs-margin trade-off,
// not something this math settles by itself — left at $100 pending that call.
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000;

export function isFreeShipping(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}

/**
 * The authoritative shipping price. The checkout UI calls this to show a total
 * and the server calls it again to charge one — never trusting a number that
 * came back from the browser.
 */
export function shippingCostCents(
  method: ShippingMethod,
  subtotalCents: number,
  province: string
): number {
  if (isFreeShipping(subtotalCents)) return 0;
  return rateFor(method, province);
}

/**
 * Above the free-shipping threshold every order ships tracked, since tracking
 * is the perk. Below it, letter mail is capped at LETTER_MAX_FLIES: past that
 * the parcel no longer fits the bracket the flat rate is priced for, so the
 * same override applies rather than quietly undercharging a big order.
 */
export function effectiveMethod(
  method: ShippingMethod,
  subtotalCents: number,
  flyCount: number
): ShippingMethod {
  if (isFreeShipping(subtotalCents)) return "TRACKED";
  if (method === "LETTER" && !canUseLetter(flyCount)) return "TRACKED";
  return method;
}

// Packaging by fly count, so the shipping email can say which envelope or box
// to grab and what to declare, instead of leaving it to be worked out at the
// counter. Flies are ~1 g; the packaging is nearly all of the weight.
export type Packaging = {
  labelFr: string;
  labelEn: string;
  weightGrams: number;
  dimensionsCm: string;
};

export function packagingFor(
  flyCount: number,
  method: ShippingMethod
): Packaging {
  // Lettermail is capped at 2 cm thick, so it is always a flat envelope no
  // matter the count — telling you "Lettermail" beside a 5 cm box would get the
  // parcel refused at the counter.
  if (method === "LETTER") {
    return {
      labelFr: "Enveloppe plate matelassée (max 2 cm d'épaisseur)",
      labelEn: "Flat padded envelope (2 cm thick max)",
      // Scales with count rather than a flat guess, so what's declared at the
      // counter is the actual weight, not a number that stopped being true
      // somewhere past five flies.
      weightGrams: LETTER_TARE_GRAMS + flyCount * LETTER_GRAMS_PER_FLY,
      dimensionsCm: "23 × 15 × 2",
    };
  }
  if (flyCount <= 20) {
    return {
      labelFr: "Petite boîte",
      labelEn: "Small box",
      weightGrams: 80,
      dimensionsCm: "20 × 15 × 5",
    };
  }
  return {
    labelFr: "Boîte moyenne",
    labelEn: "Medium box",
    weightGrams: 150,
    dimensionsCm: "25 × 20 × 8",
  };
}

// Canada only for now. US parcels cost several times more and need a customs
// declaration per package, so offering them at a domestic rate would lose money
// on every order.
export const SHIPPING_COUNTRIES = ["CA"] as const;
