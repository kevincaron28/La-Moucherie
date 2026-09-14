import { ORIGIN_POSTAL_CODE } from "@/lib/shipping";

// Canada Post's Rating API. Two things shape this file:
//
// 1. It rates PARCELS only. Lettermail isn't a rated service and never comes
//    back from here, so the letter option stays a static price in shipping.ts.
//    Live rates replace the tracked option, not the cheap one.
//
// 2. It's a network call in the checkout path. Anything that can be slow or
//    down between a customer and their payment has to fail soft, so every entry
//    point here returns null on trouble and the caller falls back to the static
//    zone table rather than blocking the sale.

const HOSTS = {
  dev: "https://ct.soa-gw.canadapost.ca",
  prod: "https://soa-gw.canadapost.ca",
} as const;

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

export function canadaPostConfigured(): boolean {
  return Boolean(
    process.env.CANADA_POST_API_USERNAME && process.env.CANADA_POST_API_PASSWORD
  );
}

function host(): string {
  return process.env.CANADA_POST_ENV === "prod" ? HOSTS.prod : HOSTS.dev;
}

/** Canada Post wants postal codes bare and upper-cased: "J0L2N0". */
export function normalizePostalCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidPostalCode(value: string): boolean {
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
}

function buildRequest(destination: string, weightKg: number, dims: {
  length: number;
  width: number;
  height: number;
}): string {
  const customer = process.env.CANADA_POST_CUSTOMER_NUMBER?.trim();
  return `<?xml version="1.0" encoding="UTF-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
  ${customer ? `<customer-number>${customer}</customer-number>` : ""}
  <parcel-characteristics>
    <weight>${weightKg.toFixed(3)}</weight>
    <dimensions>
      <length>${dims.length}</length>
      <width>${dims.width}</width>
      <height>${dims.height}</height>
    </dimensions>
  </parcel-characteristics>
  <origin-postal-code>${normalizePostalCode(ORIGIN_POSTAL_CODE)}</origin-postal-code>
  <destination>
    <domestic>
      <postal-code>${normalizePostalCode(destination)}</postal-code>
    </domestic>
  </destination>
</mailing-scenario>`;
}

// The response is small and regular, so a couple of targeted regexes beat
// pulling in an XML parser for one endpoint.
function tag(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return m ? m[1].trim() : null;
}

function parseQuotes(xml: string): CanadaPostQuote[] {
  const blocks = xml.match(/<price-quote>[\s\S]*?<\/price-quote>/g) ?? [];
  const quotes: CanadaPostQuote[] = [];

  for (const block of blocks) {
    const serviceCode = tag(block, "service-code");
    const serviceName = tag(block, "service-name");
    const due = tag(block, "due");
    const base = tag(block, "base");
    if (!serviceCode || !due) continue;

    const transit = tag(block, "expected-transit-time");

    quotes.push({
      serviceCode,
      serviceName: serviceName ?? serviceCode,
      dueCents: Math.round(parseFloat(due) * 100),
      baseCents: base ? Math.round(parseFloat(base) * 100) : 0,
      transitDays: transit ? parseInt(transit, 10) : null,
    });
  }
  return quotes;
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

  const auth = Buffer.from(
    `${process.env.CANADA_POST_API_USERNAME}:${process.env.CANADA_POST_API_PASSWORD}`
  ).toString("base64");

  // Canada Post bills a minimum of 0.5 kg, so quoting lighter gains nothing and
  // risks a quote below what's actually charged.
  const weightKg = Math.max(0.5, weightGrams / 1000);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${host()}/rs/ship/price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.cpc.ship.rate-v4+xml",
        Accept: "application/vnd.cpc.ship.rate-v4+xml",
        Authorization: `Basic ${auth}`,
        "Accept-Language": "en-CA",
      },
      body: buildRequest(destinationPostalCode, weightKg, dimensionsCm),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      // Canada Post returns its reason in <message><description>, which is far
      // more useful in the logs than a bare status code.
      const description = tag(text, "description");
      console.error(
        `[canada-post] ${res.status} ${description ?? text.slice(0, 300)}`
      );
      return null;
    }

    const quotes = parseQuotes(text);
    if (quotes.length === 0) {
      console.error("[canada-post] no price-quote in response", text.slice(0, 300));
      return null;
    }
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
