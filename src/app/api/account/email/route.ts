import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Keyed by account rather than IP: this is the endpoint someone would hammer
  // to guess the current password of a session they've hijacked.
  const allowed = await checkRateLimit(
    `account-email:${session.user.id}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { email, currentPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // The email is the sign-in identifier, so changing it is an account takeover
  // in miniature — re-prove the password even though the session is already valid.
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "wrong_password" }, { status: 403 });
  }

  if (email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) {
      return NextResponse.json({ error: "email_in_use" }, { status: 409 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { email } });
  }

  return NextResponse.json({ ok: true });
}
