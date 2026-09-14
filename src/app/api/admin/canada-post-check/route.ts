import { NextResponse } from "next/server";
import { getRates, canadaPostConfigured } from "@/lib/canada-post";

/**
 * One-call diagnostic for the Canada Post credentials, so a failure can be read
 * directly instead of inferred from a checkout that quietly fell back to zone
 * rates. Guarded by CRON_SECRET because the response names the environment and
 * would otherwise let anyone burn API quota.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!canadaPostConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: "CANADA_POST_API_USERNAME / CANADA_POST_API_PASSWORD are not set",
    });
  }

  const destination =
    new URL(request.url).searchParams.get("to") ?? "M5H2N2";

  const quotes = await getRates(destination, 80, {
    length: 20,
    width: 15,
    height: 5,
  });

  if (!quotes) {
    return NextResponse.json({
      ok: false,
      environment: process.env.CANADA_POST_ENV === "prod" ? "production" : "development",
      reason: "No quotes returned — see the server logs for the Canada Post message.",
    });
  }

  return NextResponse.json({
    ok: true,
    environment: process.env.CANADA_POST_ENV === "prod" ? "production" : "development",
    destination,
    quotes: quotes.map((q) => ({
      service: q.serviceName,
      code: q.serviceCode,
      beforeTax: (q.baseCents / 100).toFixed(2),
      withTax: (q.dueCents / 100).toFixed(2),
      transitDays: q.transitDays,
    })),
  });
}
