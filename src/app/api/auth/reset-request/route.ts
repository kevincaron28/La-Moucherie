import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordReset } from "@/lib/email";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  locale: z.enum(["fr", "en"]),
});

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    `reset-request:${clientIp(request)}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { email, locale } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success. Telling an anonymous caller whether an address has
  // an account here would turn this endpoint into a customer-list oracle.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Any earlier outstanding link stops working the moment a new one is asked
    // for, so a forwarded or leaked old email can't still be redeemed.
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    await sendPasswordReset({
      to: user.email,
      name: user.name,
      token,
      locale,
    });
  }

  return NextResponse.json({ ok: true });
}
