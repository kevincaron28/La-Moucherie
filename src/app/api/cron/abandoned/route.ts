import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendAbandonedCart } from "@/lib/email";
import { RECOVERY_DELAY_MS, CLEANUP_DELAY_MS } from "@/lib/abandoned";

/**
 * Scheduled from vercel.json. Vercel signs its cron calls with CRON_SECRET;
 * without that check this endpoint would let anyone trigger a mailing.
 */
function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  let emailed = 0;
  let cancelled = 0;

  // 1. Nudge: still PENDING past the delay, never nudged before.
  const toNudge = await prisma.order.findMany({
    where: {
      status: "PENDING",
      recoveryEmailSentAt: null,
      createdAt: {
        lt: new Date(now - RECOVERY_DELAY_MS),
        gt: new Date(now - CLEANUP_DELAY_MS),
      },
    },
    include: { items: true },
    take: 50,
  });

  for (const order of toNudge) {
    const recoveryToken = order.recoveryToken ?? crypto.randomBytes(24).toString("hex");

    // Stamp before sending: a send that throws would otherwise be retried on
    // every run, and emailing someone repeatedly is worse than missing one.
    await prisma.order.update({
      where: { id: order.id },
      data: { recoveryEmailSentAt: new Date(), recoveryToken },
    });

    await sendAbandonedCart({
      to: order.email,
      name: order.customerName,
      locale: order.locale,
      recoveryToken,
      items: order.items.map((i) => ({
        nameFr: i.nameSnapshotFr,
        nameEn: i.nameSnapshotEn,
        variantFr: i.variantSnapshotFr,
        variantEn: i.variantSnapshotEn,
        quantity: i.quantity,
      })),
    });
    emailed += 1;
  }

  // 2. Sweep: cancel rather than delete, so the record of what was attempted
  // survives. Stock is untouched — a PENDING order never took any.
  const swept = await prisma.order.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lt: new Date(now - CLEANUP_DELAY_MS) },
    },
    data: { status: "CANCELLED" },
  });
  cancelled = swept.count;

  console.info(`[cron:abandoned] nudged ${emailed}, cancelled ${cancelled}`);
  return NextResponse.json({ emailed, cancelled });
}
