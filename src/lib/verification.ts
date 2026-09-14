import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmailVerification } from "@/lib/email";

const TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Issues a fresh verification link and voids any outstanding one, so an older
 * email in the inbox stops working the moment a new one is requested — the same
 * rule the password reset flow follows.
 *
 * Only the hash is stored: a leaked database row can't be turned back into a
 * working link.
 */
export async function issueEmailVerification(user: {
  id: string;
  email: string;
  name: string;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await prisma.$transaction([
    prisma.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.emailVerificationToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + TTL_MS),
      },
    }),
  ]);

  await sendEmailVerification({ to: user.email, name: user.name, token });
}
