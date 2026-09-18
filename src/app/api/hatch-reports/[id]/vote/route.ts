import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

// Account-keyed, not IP-keyed like ReviewVote: a vote here feeds the
// reporter's reputation, so it needs to mean "this signed-in angler vouches
// for it," not just "someone on this connection clicked once."
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const allowed = await checkRateLimit(`hatch-report-vote:${session.user.id}`, 60, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const report = await prisma.hatchReport.findUnique({
    where: { id },
    select: { id: true, approved: true, userId: true },
  });
  if (!report || !report.approved) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (report.userId === session.user.id) {
    return NextResponse.json({ error: "own_content" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.hatchReportVote.create({
        data: { hatchReportId: id, userId: session.user.id },
      }),
      prisma.hatchReport.update({
        where: { id },
        data: { upvoteCount: { increment: 1 } },
      }),
      // Anonymous reports (userId null) still collect upvotes on the report
      // itself; there's just no account to credit.
      ...(report.userId
        ? [
            prisma.user.update({
              where: { id: report.userId },
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

  const updated = await prisma.hatchReport.findUnique({
    where: { id },
    select: { upvoteCount: true },
  });

  return NextResponse.json({ ok: true, upvoteCount: updated?.upvoteCount ?? 0 });
}
