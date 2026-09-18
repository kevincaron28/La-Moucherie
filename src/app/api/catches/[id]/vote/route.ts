import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

// Same reasoning as the hatch-report vote route: account-keyed because it
// feeds the submitter's reputation.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const allowed = await checkRateLimit(`catch-vote:${session.user.id}`, 60, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const photo = await prisma.catchPhoto.findUnique({
    where: { id },
    select: { id: true, approved: true, userId: true },
  });
  if (!photo || !photo.approved) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (photo.userId === session.user.id) {
    return NextResponse.json({ error: "own_content" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.catchVote.create({
        data: { catchId: id, userId: session.user.id },
      }),
      prisma.catchPhoto.update({
        where: { id },
        data: { upvoteCount: { increment: 1 } },
      }),
      // Shop-posted catches (userId null) still collect upvotes on the
      // photo itself; there's just no account to credit.
      ...(photo.userId
        ? [
            prisma.user.update({
              where: { id: photo.userId },
              data: { reputation: { increment: 1 } },
            }),
          ]
        : []),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "already_voted" }, { status: 409 });
    }
    throw err;
  }

  const updated = await prisma.catchPhoto.findUnique({
    where: { id },
    select: { upvoteCount: true },
  });

  return NextResponse.json({ ok: true, upvoteCount: updated?.upvoteCount ?? 0 });
}
