import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const updateReviewSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = updateReviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { reviewId, status } = parsed.data;

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  return NextResponse.json({ ok: true, review });
}
