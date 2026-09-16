import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveShippingRate } from "@/lib/shipping-quote";
import {
  SHIPPING_METHODS,
  isProvinceCode,
  effectiveMethod,
} from "@/lib/shipping";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  method: z.enum(SHIPPING_METHODS),
  province: z.string().min(2).max(2),
  postalCode: z.string().min(6).max(10),
  flyCount: z.number().int().min(1).max(500),
  subtotalCents: z.number().int().min(0),
  serviceCode: z.string().max(20).optional(),
  locale: z.enum(["fr", "en"]).default("fr"),
});

/**
 * Quotes shipping for the checkout preview. The charge is still recomputed in
 * create-payment-intent — this endpoint only decides what the customer is shown
 * before they pay.
 */
export async function POST(request: Request) {
  // Each quote can cost an upstream API call, so it's throttled: without this,
  // a script could run up Canada Post usage by typing postal codes at us.
  const allowed = await checkRateLimit(`quote:${clientIp(request)}`, 120, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { method, province, postalCode, flyCount, subtotalCents, serviceCode, locale } =
    parsed.data;

  if (!isProvinceCode(province)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // A preview has to match what create-payment-intent will actually charge —
  // quoting the flat letter rate for a fly count that no longer qualifies
  // would show a price the checkout is about to override.
  const resolvedMethod = effectiveMethod(method, subtotalCents, flyCount);
  const rate = await resolveShippingRate(resolvedMethod, province, postalCode, flyCount, {
    subtotalCents,
    serviceCode,
    language: locale === "fr" ? "fr-CA" : "en-CA",
  });
  return NextResponse.json({ ...rate, method: resolvedMethod });
}
