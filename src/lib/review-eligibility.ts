import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ReviewEligibility =
  | "signed_out"
  | "not_a_purchaser"
  | "already_reviewed"
  | "can_review";

export async function getReviewEligibility(
  productId: string
): Promise<ReviewEligibility> {
  const session = await auth();
  if (!session?.user) return "signed_out";

  const [purchase, existing] = await Promise.all([
    prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["PAID", "FULFILLED"] },
        items: { some: { productId } },
      },
      select: { id: true },
    }),
    prisma.review.findUnique({
      where: { productId_userId: { productId, userId: session.user.id } },
      select: { id: true },
    }),
  ]);

  if (!purchase) return "not_a_purchaser";
  if (existing) return "already_reviewed";
  return "can_review";
}
