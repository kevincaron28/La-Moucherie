import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { issueEmailVerification } from "@/lib/verification";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const allowed = await checkRateLimit(
    `resend-verification:${session.user.id}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  // Answer the same way for an already-verified account: there's nothing to do,
  // and nothing to reveal either.
  if (user && !user.emailVerified) {
    await issueEmailVerification(user);
  }

  return NextResponse.json({ ok: true });
}
