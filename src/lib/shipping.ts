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

// Tracked parcel varies by distance. Each zone is billed at the WORST case
// inside it — the furthest destination quoted — because a zone rate set from
// its cheapest city quietly loses money on every order to its far edge.
//
// Figures are tax-inclusive. Canada Post quotes before tax but charges it at
// the counter, so a pre-tax rate here would lose ~13-15% on every parcel.
//
// Source: Canada Post Find a Rate, Regular Parcel, 500 g, 20x15x5 cm from
// J0L 2N0, September 2026 prices.
//
// STILL WORTH ONE SANITY CHECK: the source quotes put Toronto cheaper than
// Montréal and Whitehorse cheaper than Vancouver, which no distance-zoned
// carrier does. The likely cause is Find a Rate returning a different service
// for some destinations (Regular Parcel isn't offered everywhere). It doesn't
// make these numbers unusable — each is at or above what that zone should
// cost — but the QC rate sitting above Ontario is the visible symptom, and one
// counter receipt would settle it.
export const TRACKED_RATE_BY_ZONE_CENTS: Record<ShippingZone, number> = {
  QC: 2639, // Gaspé, the far edge of the province
  ONTARIO: 2216, // Toronto
  ATLANTIC: 3214, // St. John's, the dearest quote of the set
  WEST: 2864, // Vancouver
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
// Raised from $75 once real rates came in. At $75 a free Atlantic parcel costs
// $32.14 — some 43% of the order, more than the flies are likely to make. $100
// keeps the giveaway under a third of the order even in the dearest zone.
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

/** Above the threshold every order ships tracked, since tracking is the perk. */
export function effectiveMethod(
  method: ShippingMethod,
  subtotalCents: number
): ShippingMethod {
  return isFreeShipping(subtotalCents) ? "TRACKED" : method;
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
      weightGrams: flyCount <= 5 ? 30 : 60,
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
