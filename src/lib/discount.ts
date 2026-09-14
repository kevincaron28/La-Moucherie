// Flies have been sold by the dozen for about as long as anyone has sold flies,
// so the tiers sit on the half-dozen and the dozen rather than on dollar
// amounts — it's the unit customers already think in, and it reads as a fly
// shop's pricing instead of a supermarket's.
//
// Counting flies rather than dollars also keeps the discount honest across a
// mixed cart: twelve flies is twelve flies' worth of bench time whether they're
// all one pattern or twelve different ones.
export type DiscountTier = {
  minQuantity: number;
  percent: number;
};

export const DISCOUNT_TIERS: DiscountTier[] = [
  { minQuantity: 6, percent: 5 },
  { minQuantity: 12, percent: 10 },
  { minQuantity: 24, percent: 15 },
];

export function totalQuantity(items: { quantity: number }[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Flies that count toward a tier. A curated box is already priced as a bundle,
 * so counting its flies here would discount the same flies twice — and would
 * also let one box drag unrelated singles into a tier they didn't earn.
 */
export function eligibleQuantity(
  items: { quantity: number; category: string }[]
): number {
  return items
    .filter((i) => i.category !== "ASSORTMENT")
    .reduce((sum, i) => sum + i.quantity, 0);
}

/** Item subtotal excluding bundles, so the percentage applies only to singles. */
export function eligibleSubtotalCents(
  items: { quantity: number; unitPriceCents: number; category: string }[]
): number {
  return items
    .filter((i) => i.category !== "ASSORTMENT")
    .reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
}

/** The best tier this many flies qualifies for, or null below the first one. */
export function tierFor(quantity: number): DiscountTier | null {
  let best: DiscountTier | null = null;
  for (const tier of DISCOUNT_TIERS) {
    if (quantity >= tier.minQuantity) best = tier;
  }
  return best;
}

/** The next tier up, for telling someone how close they are to it. */
export function nextTier(quantity: number): DiscountTier | null {
  return DISCOUNT_TIERS.find((t) => quantity < t.minQuantity) ?? null;
}

/**
 * Discount in cents off the item subtotal. Rounded down so rounding never
 * invents a cent the customer wasn't charged, which would leave the Stripe
 * amount and the order total disagreeing.
 */
export function discountCents(subtotalCents: number, quantity: number): number {
  const tier = tierFor(quantity);
  if (!tier) return 0;
  return Math.floor((subtotalCents * tier.percent) / 100);
}
