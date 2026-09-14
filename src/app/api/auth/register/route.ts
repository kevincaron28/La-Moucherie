import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { issueEmailVerification } from "@/lib/verification";

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    `register:${clientIp(request)}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "email_in_use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  // Verification is sent but never blocks: an unverified customer can still
  // browse and check out. Gating the shop on an email that might land in spam
  // would cost more orders than the fake accounts it prevents.
  await issueEmailVerification(user);

  return NextResponse.json({ ok: true });
}
