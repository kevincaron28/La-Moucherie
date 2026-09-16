import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { sendNewsletterCampaign } from "@/lib/email";

const schema = z.object({
  subjectFr: z.string().min(1).max(200),
  subjectEn: z.string().min(1).max(200),
  // HTML, not plain text — trusted because only an authenticated admin can
  // reach this route, and a marketing email needs at least a bolded word or
  // a link to a product without fighting an escaper for it.
  bodyFr: z.string().min(1).max(20000),
  bodyEn: z.string().min(1).max(20000),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { subjectFr, subjectEn, bodyFr, bodyEn } = parsed.data;

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    select: { email: true, locale: true, unsubscribeToken: true },
  });

  const recipientCount =
    subscribers.length === 0
      ? 0
      : await sendNewsletterCampaign({
          subjectFr,
          subjectEn,
          bodyHtmlFr: bodyFr,
          bodyHtmlEn: bodyEn,
          recipients: subscribers,
        });

  const campaign = await prisma.newsletterCampaign.create({
    data: { subjectFr, subjectEn, recipientCount },
  });

  return NextResponse.json({ ok: true, campaign });
}
