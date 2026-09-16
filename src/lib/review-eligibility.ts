import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ReviewEligibility = "signed_out" | "already_reviewed" | "can_review";

/**
 * Anyone signed in may review any product — a purchase isn't required, only
 * reflected afterward in the verified-purchase badge. Still gated on having
 * an account: reviews are one-per-product-per-account (see the Review
 * model's unique constraint), which needs a userId to enforce, and a bare
 * sign-in requirement is the cheapest real guard against anonymous spam.
 */
export async function getReviewEligibility(
  productId: string
): Promise<ReviewEligibility> {
  const session = await auth();
  if (!session?.user) return "signed_out";

  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: session.user.id } },
    select: { id: true },
  });

  if (existing) return "already_reviewed";
  return "can_review";
}
