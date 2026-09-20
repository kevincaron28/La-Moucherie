import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendAbandonedCart, sendReviewRequest } from "@/lib/email";
import { RECOVERY_DELAY_MS, CLEANUP_DELAY_MS } from "@/lib/abandoned";
import { REVIEW_REQUEST_DELAY_MS } from "@/lib/review-request";

/**
 * Scheduled from vercel.json. Vercel signs its cron calls with CRON_SECRET;
 * without that check this endpoint would let anyone trigger a mailing.
 *
 * Everything time-based in the app that isn't a customer-triggered request
 * runs from this one handler, on the one cron schedule Vercel's Hobby plan
 * allows. Naming it "abandoned" stopped being accurate the moment a second,
 * unrelated job (review requests) moved in — renamed to "daily" instead of
 * letting the path lie about what it does.
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
  let nudged = 0;
  let cancelled = 0;
  let reviewsRequested = 0;

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
    nudged += 1;
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

  // 3. Ask for a review: FULFILLED past the delay, never asked before. See
  // src/lib/review-request.ts for why the delay measures from "an operator
  // clicked shipped" rather than an actual delivery confirmation.
  const toAsk = await prisma.order.findMany({
    where: {
      status: "FULFILLED",
      reviewRequestSentAt: null,
      fulfilledAt: { lt: new Date(now - REVIEW_REQUEST_DELAY_MS) },
    },
    include: {
      items: {
        include: { product: { select: { slug: true, nameFr: true, nameEn: true, active: true } } },
      },
    },
    take: 50,
  });

  for (const order of toAsk) {
    // Stamped before sending, same reasoning as the nudge above.
    await prisma.order.update({
      where: { id: order.id },
      data: { reviewRequestSentAt: new Date() },
    });

    // One link per distinct product still live enough to have a page — a
    // retired or deleted pattern has nowhere to send a review link to, and a
    // customer who bought two sizes of one fly is asked about it once.
    const seen = new Set<string>();
    const products: { slug: string; nameFr: string; nameEn: string }[] = [];
    for (const item of order.items) {
      if (!item.product?.active || seen.has(item.product.slug)) continue;
      seen.add(item.product.slug);
      products.push(item.product);
    }

    if (products.length > 0) {
      await sendReviewRequest({
        to: order.email,
        name: order.customerName,
        locale: order.locale,
        orderId: order.id,
        products,
      });
      reviewsRequested += 1;
    }
  }

  console.info(
    `[cron:daily] nudged ${nudged}, cancelled ${cancelled}, review requests ${reviewsRequested}`
  );
  return NextResponse.json({ nudged, cancelled, reviewsRequested });
}
