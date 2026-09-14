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
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  // Consume the token in the same transaction as the flag, so a replayed link
  // can't be used twice.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
