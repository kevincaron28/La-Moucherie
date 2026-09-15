import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  const allowed = await checkRateLimit(`verify:${clientIp(request)}`, 20, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(parsed.data.token)
    .digest("hex");
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { email: true } } },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  // Consume the token, mark email verified, and link any outstanding orders
  // in the same transaction.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.order.updateMany({
      where: { email: record.user.email, userId: null },
      data: { userId: record.userId },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
