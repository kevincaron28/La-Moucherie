import { ORIGIN_POSTAL_CODE } from "@/lib/shipping";

// Canada Post's REST Rating API (api.canadapost-postescanada.ca). Two things
// shape this file:
//
// 1. It rates PARCELS only. Lettermail isn't a rated service and never comes
//    back from here, so the letter option stays a static price in shipping.ts.
//    Live rates replace the tracked option, not the cheap one.
//
// 2. It's a network call in the checkout path. Anything that can be slow or
//    down between a customer and their payment has to fail soft, so every entry
//    point here returns null on trouble and the caller falls back to the static
//    zone table rather than blocking the sale.
//
// This used to call the older SOAP/XML gateway (soa-gw.canadapost.ca) with
// HTTP Basic Auth. That gateway takes a different credential type this
// account was never enrolled in — this account's key/secret are OAuth2
// client credentials for the newer REST platform, which is what this file
// now talks to instead.

const API_HOST = "https://api.canadapost-postescanada.ca";
// The bare "/oauth2/token" path 503s with a gateway HTML error page — it
// doesn't route to anything. The OAuth provider is mounted under its own
// path on this host.
const TOKEN_URL = `${API_HOST}/cpc-api-native-oauth-provider/oauth2/token`;
const RATING_URL = `${API_HOST}/rating/v1/prices`;

const TIMEOUT_MS = 4000;

export type CanadaPostQuote = {
  serviceCode: string;
  serviceName: string;
  /** Tax-inclusive, in cents — what you actually pay at the counter. */
  dueCents: number;
  baseCents: number;
  /** Expected transit days, when Canada Post supplies one. */
  transitDays: number | null;
};

type RestPriceQuote = {
  serviceCode: string;
  serviceName?: string;
  priceDetails: { base: number; due: number };
  serviceStandard?: { expectedTransitTime?: number };
};

export function canadaPostConfigured(): boolean {
  return Boolean(
    process.env.CANADA_POST_API_USERNAME && process.env.CANADA_POST_API_PASSWORD
  );
}

/** Canada Post wants postal codes bare and upper-cased: "J0L2N0". */
export function normalizePostalCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidPostalCode(value: string): boolean {
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
}

// Bearer tokens outlive a single request, so cache one in memory rather than
// exchanging a fresh one on every quote — same reasoning as the rate cache in
// shipping-quote.ts: a miss just costs one extra call, per serverless
// instance, and empties on deploy.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const auth = Buffer.from(
    `${process.env.CANADA_POST_API_USERNAME}:${process.env.CANADA_POST_API_PASSWORD}`
  ).toString("base64");

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      body: "grant_type=client_credentials&scope=merchant",
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[canada-post] token exchange ${res.status}`, text.slice(0, 300));
      return null;
    }

    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!data.access_token) {
      console.error("[canada-post] token response missing access_token");
      return null;
    }

    // Refresh a minute early rather than risk the token expiring mid-request.
    const ttlMs = Math.max(0, (data.expires_in ?? 1800) - 60) * 1000;
    cachedToken = { token: data.access_token, expiresAt: Date.now() + ttlMs };
    return cachedToken.token;
  } catch (err) {
    console.error("[canada-post] token exchange failed", err);
    return null;
  }
}

/**
 * Every domestic parcel service Canada Post will quote for this shipment,
 * cheapest first. Returns null — never throws — when the API is unreachable,
 * misconfigured or slow, so checkout can fall back instead of failing.
 */
export async function getRates(
  destinationPostalCode: string,
  weightGrams: number,
  dimensionsCm: { length: number; width: number; height: number }
): Promise<CanadaPostQuote[] | null> {
  if (!canadaPostConfigured()) return null;
  if (!isValidPostalCode(destinationPostalCode)) return null;

  const token = await getAccessToken();
  if (!token) return null;

  // Canada Post bills a minimum of 0.5 kg, so quoting lighter gains nothing and
  // risks a quote below what's actually charged.
  const weightKg = Math.max(0.5, weightGrams / 1000);

  // customerNumber only unlocks commercial pricing when paired with a
  // contractId — sending one without the other gets the request rejected.
  // Without a contract on file, omit both and take counter (consumer)
  // rates rather than fail outright, the same fallback the old code used
  // when no customer number was configured.
  const customerNumber = process.env.CANADA_POST_CUSTOMER_NUMBER?.trim();
  const contractId = process.env.CANADA_POST_CONTRACT_ID?.trim();

  const body: Record<string, unknown> = {
    parcelCharacteristics: {
      weight: weightKg,
      dimensions: {
        length: dimensionsCm.length,
        width: dimensionsCm.width,
        height: dimensionsCm.height,
      },
    },
    originPostalCode: normalizePostalCode(ORIGIN_POSTAL_CODE),
    destination: {
      domestic: { postalCode: normalizePostalCode(destinationPostalCode) },
    },
  };

  if (customerNumber && contractId) {
    body.customerNumber = customerNumber;
    body.contractId = contractId;
    body.quoteType = "commercial";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(RATING_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en-CA",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`[canada-post] ${res.status} ${text.slice(0, 300)}`);
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("[canada-post] non-JSON response", text.slice(0, 300));
      return null;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.error("[canada-post] no price quotes in response", text.slice(0, 300));
      return null;
    }

    const quotes = (parsed as RestPriceQuote[]).map((q) => ({
      serviceCode: q.serviceCode,
      serviceName: q.serviceName ?? q.serviceCode,
      dueCents: Math.round(q.priceDetails.due * 100),
      baseCents: Math.round(q.priceDetails.base * 100),
      transitDays: q.serviceStandard?.expectedTransitTime ?? null,
    }));

    return quotes.sort((a, b) => a.dueCents - b.dueCents);
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error(`[canada-post] ${aborted ? "timed out" : "request failed"}`, err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The cheapest tracked parcel Canada Post will carry, tax included. This is the
 * number the tracked option is priced from; null means fall back to the zone
 * table.
 */
export async function cheapestTrackedCents(
  destinationPostalCode: string,
  weightGrams: number,
  dimensionsCm: { length: number; width: number; height: number }
): Promise<CanadaPostQuote | null> {
  const quotes = await getRates(destinationPostalCode, weightGrams, dimensionsCm);
  return quotes?.[0] ?? null;
}
