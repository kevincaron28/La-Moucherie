import Stripe from "stripe";

// Built lazily on first use rather than at import.
//
// `next build` loads every route module to collect its config, so a throw at
// module scope isn't a config error — it's a failed build. That made the build
// depend on a runtime secret: any environment holding the code but not the key
// (a preview deployment, a CI checkout) couldn't compile at all, and the error
// pointed at page-data collection rather than at the missing variable.
//
// Deferring keeps the fail-fast behaviour where it belongs. A request that
// actually needs Stripe without a key configured still throws immediately, with
// the same message.
let client: Stripe | null = null;

function getStripeClient(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  client = new Stripe(secretKey);
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, property) {
    const instance = getStripeClient();
    const value = Reflect.get(instance, property);
    // Bind so methods keep the real client as `this` — the proxy target is an
    // empty object and would break anything relying on internal state.
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
