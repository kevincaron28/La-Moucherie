import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({ helpful: z.boolean() });

// Hashed rather than stored raw: this table exists only to stop the same
// visitor voting twice, never to identify who voted.
function voterKey(request: Request): string {
  return crypto.createHash("sha256").update(clientIp(request)).digest("hex");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const allowed = await checkRateLimit(`review-vote:${clientIp(request)}`, 60, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!review || review.status !== "APPROVED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    await prisma.$transaction([
      prisma.reviewVote.create({
        data: { reviewId: id, voterKey: voterKey(request), helpful: parsed.data.helpful },
      }),
      prisma.review.update({
        where: { id },
        data: parsed.data.helpful
          ? { helpfulCount: { increment: 1 } }
          : { notHelpfulCount: { increment: 1 } },
      }),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "already_voted" }, { status: 409 });
    }
    throw err;
  }

  const updated = await prisma.review.findUnique({
    where: { id },
    select: { helpfulCount: true, notHelpfulCount: true },
  });

  return NextResponse.json({ ok: true, ...updated });
}
