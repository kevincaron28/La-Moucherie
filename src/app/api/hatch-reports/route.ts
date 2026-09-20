import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendHatchReportNotification } from "@/lib/email";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { HATCHES } from "@/lib/hatches";
import { SPECIES } from "@/lib/angling";

const schema = z.object({
  // Required only for an anonymous submission -- a signed-in reporter's name
  // and email come from their account instead, never from the client.
  anglerName: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(200).optional(),
  locale: z.enum(["fr", "en"]),

  waterId: z.string().trim().min(1).max(60).optional(),
  waterOther: z.string().trim().min(1).max(120).optional(),
  observedOn: z.string().datetime({ offset: true }).or(z.string().date()),

  hatchId: z.string().trim().max(60).optional(),
  hookSize: z.number().int().min(1).max(32).optional(),
  // From the shared vocabulary, so a species added to the schema is accepted
  // here without anyone remembering to update a second copy of the list.
  species: z.enum(SPECIES).optional(),
  intensity: z.enum(["NONE", "SPARSE", "STEADY", "HEAVY"]).optional(),

  waterLevel: z.enum(["LOW", "NORMAL", "HIGH"]).optional(),
  waterClarity: z.enum(["CLEAR", "STAINED", "MUDDY"]).optional(),
  sky: z.enum(["SUNNY", "PARTLY_CLOUDY", "OVERCAST", "RAIN"]).optional(),
  waterTempC: z.number().min(-2).max(35).optional(),

  productId: z.string().trim().min(1).max(60).optional(),
  note: z.string().trim().max(500).optional(),

  newsletterOptIn: z.boolean().optional(),
  // Honeypot: a real person never sees this field, so anything in it is a bot.
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    `hatch-report:${clientIp(request)}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const d = parsed.data;

  // Bots get a 200 so they can't tell the honeypot caught them and retry
  // against a different shape.
  if (d.website) return NextResponse.json({ ok: true });

  // Signed in: identity comes from the account, never from the client, same
  // as the reviews route. Anonymous: the form's own name/email fields carry
  // the weight, so they're required here even though the schema allows a
  // signed-in submission to omit them.
  const session = await auth();
  let user: { id: string; name: string; email: string } | null = null;
  if (session?.user) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else if (!d.anglerName || !d.email) {
    return NextResponse.json({ error: "identity_required" }, { status: 400 });
  }

  // A report has to say WHERE, or it's noise. Everything else can be blank.
  if (!d.waterId && !d.waterOther) {
    return NextResponse.json({ error: "water_required" }, { status: 400 });
  }

  // The hatch catalogue lives in code, so there's no foreign key to lean on —
  // an unrecognised id would silently become an unfilterable orphan row.
  const hatch = d.hatchId ? HATCHES.find((h) => h.id === d.hatchId) : undefined;
  if (d.hatchId && !hatch) {
    return NextResponse.json({ error: "unknown_hatch" }, { status: 400 });
  }
  // Hook size is offered as a pick-list derived from the chosen insect, so
  // anything outside that set didn't come from the form.
  if (hatch && d.hookSize && !hatch.sizes.includes(d.hookSize)) {
    return NextResponse.json({ error: "size_mismatch" }, { status: 400 });
  }

  const observedOn = new Date(d.observedOn);
  if (Number.isNaN(observedOn.getTime())) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  // A report from the future is either a typo or a joke, and one from years
  // back isn't a condition report any more.
  const now = Date.now();
  if (observedOn.getTime() > now + 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "future_date" }, { status: 400 });
  }
  if (observedOn.getTime() < now - 365 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "too_old" }, { status: 400 });
  }

  // Confirm the foreign keys exist rather than letting Prisma throw a P2003
  // that would surface as a 500.
  const [water, product] = await Promise.all([
    d.waterId
      ? prisma.fishingWater.findUnique({ where: { id: d.waterId }, select: { id: true } })
      : null,
    d.productId
      ? prisma.product.findUnique({ where: { id: d.productId }, select: { id: true } })
      : null,
  ]);
  if (d.waterId && !water) {
    return NextResponse.json({ error: "unknown_water" }, { status: 400 });
  }
  if (d.productId && !product) {
    return NextResponse.json({ error: "unknown_product" }, { status: 400 });
  }

  const anglerName = user ? user.name : d.anglerName!;
  const email = (user ? user.email : d.email!).toLowerCase();

  const report = await prisma.hatchReport.create({
    data: {
      anglerName,
      email,
      locale: d.locale,
      userId: user?.id ?? null,
      waterId: water?.id ?? null,
      waterOther: water ? null : (d.waterOther ?? null),
      observedOn,
      hatchId: hatch?.id ?? null,
      hookSize: d.hookSize ?? null,
      species: d.species ?? null,
      intensity: d.intensity ?? null,
      waterLevel: d.waterLevel ?? null,
      waterClarity: d.waterClarity ?? null,
      sky: d.sky ?? null,
      waterTempC: d.waterTempC ?? null,
      productId: product?.id ?? null,
      note: d.note || null,
      // Never auto-published. A stranger's words don't go on the site until
      // someone has read them.
      approved: false,
    },
    select: { id: true },
  });

  // CASL: filing a report is not consent to be marketed to. The subscriber row
  // is only created when they tick the separate box, and it records which form
  // that consent came from.
  if (d.newsletterOptIn) {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { id: true, unsubscribedAt: true },
    });
    if (!existing) {
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          locale: d.locale,
          unsubscribeToken: crypto.randomBytes(32).toString("hex"),
          consentSource: "hatch_report_form",
        },
      });
    } else if (existing.unsubscribedAt) {
      // Someone who previously unsubscribed has just opted in again, which is
      // fresh consent — but keep the original token so old unsubscribe links
      // in their inbox still work.
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          unsubscribedAt: null,
          locale: d.locale,
          consentSource: "hatch_report_form",
        },
      });
    }
  }

  await sendHatchReportNotification({
    id: report.id,
    anglerName,
    water: d.waterOther ?? null,
    waterId: water?.id ?? null,
    hatchId: hatch?.id ?? null,
    note: d.note ?? null,
  });

  return NextResponse.json({ ok: true });
}
