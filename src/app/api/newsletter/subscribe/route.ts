import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendNewsletterWelcome } from "@/lib/email";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  locale: z.enum(["fr", "en"]),
});

export async function POST(request: Request) {
  const allowed = await checkRateLimit(`newsletter:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const { locale } = parsed.data;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    // Already subscribed: nothing to do, and re-sending a welcome email on
    // every repeat signup would be its own kind of spam.
    if (!existing.unsubscribedAt) {
      return NextResponse.json({ ok: true });
    }
    // Was unsubscribed — reactivate under the same token rather than issuing
    // a new one, so any old copy of the welcome email in their inbox keeps
    // working as an unsubscribe link too.
    await prisma.newsletterSubscriber.update({
      where: { id: existing.id },
      data: { unsubscribedAt: null, locale },
    });
    await sendNewsletterWelcome({
      to: email,
      locale,
      unsubscribeToken: existing.unsubscribeToken,
    });
    return NextResponse.json({ ok: true });
  }

  const unsubscribeToken = crypto.randomBytes(32).toString("hex");
  await prisma.newsletterSubscriber.create({
    data: { email, locale, unsubscribeToken },
  });
  await sendNewsletterWelcome({ to: email, locale, unsubscribeToken });

  return NextResponse.json({ ok: true });
}
