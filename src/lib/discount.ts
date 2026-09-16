// The "fly dozen" deal: order the same fly pattern in bundles of a dozen and
// the last two of every complete dozen are free — buy 10, get 2 free. This
// replaces the old cart-wide 6/12/24 percentage tiers: it rewards depth in
// one pattern (a real dozen someone will actually fish), not just cart size,
// and it can't be reached by padding the cart with a dozen different singles.
export const DOZEN_SIZE = 12;
export const FREE_PER_DOZEN = 2;

export type CartLine = {
  productId: string;
  category: string;
  quantity: number;
  unitPriceCents: number;
};

// Curated multi-fly boxes are priced as a bundle already, and "the same fly"
// doesn't mean anything for a box that mixes patterns.
function isDozenEligible(category: string): boolean {
  return category !== "ASSORTMENT";
}

export function totalQuantity(items: { quantity: number }[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Units of one fly pattern in the cart — what the dozen deal counts against. */
export function quantityFor(items: CartLine[], productId: string): number {
  return items
    .filter((i) => i.productId === productId && isDozenEligible(i.category))
    .reduce((sum, i) => sum + i.quantity, 0);
}

/** How many free units a given quantity of one pattern has earned. */
export function freeUnitsFor(quantity: number): number {
  return Math.floor(quantity / DOZEN_SIZE) * FREE_PER_DOZEN;
}

/** Free units earned across every pattern — for a "N free flies!" summary. */
export function totalFreeUnits(items: CartLine[]): number {
  const byProduct = new Map<string, number>();
  for (const item of items) {
    if (!isDozenEligible(item.category)) continue;
    byProduct.set(item.productId, (byProduct.get(item.productId) ?? 0) + item.quantity);
  }
  let total = 0;
  for (const quantity of byProduct.values()) total += freeUnitsFor(quantity);
  return total;
}

/**
 * The pattern closest to completing its next dozen, for an "add N more X to
 * get 2 free" nudge. Null once nothing is partway — an empty cart, or every
 * pattern already sitting at an exact dozen multiple.
 */
export function closestToNextDozen(
  items: CartLine[]
): { productId: string; remaining: number } | null {
  const byProduct = new Map<string, number>();
  for (const item of items) {
    if (!isDozenEligible(item.category)) continue;
    byProduct.set(item.productId, (byProduct.get(item.productId) ?? 0) + item.quantity);
  }
  let best: { productId: string; remaining: number } | null = null;
  for (const [productId, quantity] of byProduct) {
    const remainder = quantity % DOZEN_SIZE;
    if (remainder === 0) continue;
    const remaining = DOZEN_SIZE - remainder;
    if (!best || remaining < best.remaining) best = { productId, remaining };
  }
  return best;
}

/**
 * Total discount in cents, applied per fly pattern rather than across the
 * whole cart. Within each pattern's completed dozens, the CHEAPEST units are
 * the free ones — the same way a real "buy 10, get 2 free" bundle protects
 * margin rather than giving away whichever units happen to be priciest.
 */
export function discountCents(items: CartLine[]): number {
  const byProduct = new Map<string, CartLine[]>();
  for (const item of items) {
    if (!isDozenEligible(item.category)) continue;
    const list = byProduct.get(item.productId);
    if (list) list.push(item);
    else byProduct.set(item.productId, [item]);
  }

  let total = 0;
  for (const lines of byProduct.values()) {
    const quantity = lines.reduce((sum, l) => sum + l.quantity, 0);
    const freeCount = freeUnitsFor(quantity);
    if (freeCount === 0) continue;

    const unitPrices = lines
      .flatMap((l) => Array<number>(l.quantity).fill(l.unitPriceCents))
      .sort((a, b) => a - b);
    total += unitPrices.slice(0, freeCount).reduce((sum, c) => sum + c, 0);
  }
  return total;
}
