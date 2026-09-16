import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // The token itself is the credential here — there's nothing further to
  // authenticate against.
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: parsed.data.token },
  });
  if (!subscriber) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!subscriber.unsubscribedAt) {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { unsubscribedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
