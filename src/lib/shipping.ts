// Flies weigh about a gram each, so what actually sets the postage is thickness
// and whether the parcel is tracked — not weight. Canada Post prices those two
// cases very differently (oversize Lettermail ~$2.61 vs Regular Parcel from
// ~$10.91), which is why one flat rate can't be fair: it overcharges a
// three-fly envelope and loses money on anything tracked.
//
// These are the two real options, priced to cover postage plus packaging. Check
// them against your own Canada Post rates from your origin postal code before
// launch and adjust here — every price on the site comes from this file.
export const SHIPPING_METHODS = ["LETTER", "TRACKED"] as const;
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

export const SHIPPING_RATES_CENTS: Record<ShippingMethod, number> = {
  LETTER: 350,
  TRACKED: 1400,
};

// Free shipping pays for itself by pushing order size up, but only above a
// value where the margin already covers the ~$11 parcel. It applies to the
// tracked rate: giving away the untracked one saves the customer $3.50 and
// teaches nothing.
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;

export function isFreeShipping(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}

/**
 * The authoritative shipping price. The checkout UI calls this to show a
 * total and the server calls it again to charge one — never trusting a
 * number that came back from the browser.
 */
export function shippingCostCents(
  method: ShippingMethod,
  subtotalCents: number
): number {
  if (isFreeShipping(subtotalCents)) return 0;
  return SHIPPING_RATES_CENTS[method];
}

/** Above the threshold every order ships tracked, since tracking is the perk. */
export function effectiveMethod(
  method: ShippingMethod,
  subtotalCents: number
): ShippingMethod {
  return isFreeShipping(subtotalCents) ? "TRACKED" : method;
}

export function isShippingMethod(value: unknown): value is ShippingMethod {
  return typeof value === "string" && SHIPPING_METHODS.includes(value as ShippingMethod);
}

// Canada only for now. US parcels cost several times more and need a customs
// declaration per package, so offering them at a domestic rate would lose money
// on every order. Revisit with real volume.
export const SHIPPING_COUNTRIES = ["CA"] as const;
