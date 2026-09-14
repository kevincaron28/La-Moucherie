import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveShippingRate } from "@/lib/shipping-quote";
import { SHIPPING_METHODS, isProvinceCode, isFreeShipping } from "@/lib/shipping";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  method: z.enum(SHIPPING_METHODS),
  province: z.string().min(2).max(2),
  postalCode: z.string().min(6).max(10),
  flyCount: z.number().int().min(1).max(500),
  subtotalCents: z.number().int().min(0),
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
  const { method, province, postalCode, flyCount, subtotalCents } = parsed.data;

  if (!isProvinceCode(province)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (isFreeShipping(subtotalCents)) {
    return NextResponse.json({ cents: 0, source: "free" });
  }

  const rate = await resolveShippingRate(method, province, postalCode, flyCount);
  return NextResponse.json(rate);
}
