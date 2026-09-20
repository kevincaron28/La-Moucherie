import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

// The only place `fulfilledAt` is ever set — there is no carrier webhook, so
// this is an operator saying "I packaged and shipped this," not a fact
// confirmed by anyone else. It is what the review-request cron measures its
// delay from (see src/lib/review-request.ts).
//
// A toggle rather than a one-way action, so a misclick can be undone without
// db:studio — the same pattern as the catches/hatch-reports approve buttons.
// Un-fulfilling clears fulfilledAt but never touches reviewRequestSentAt: an
// email that already went out can't be un-sent, and re-fulfilling later must
// not queue a second one.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (order.status !== "PAID" && order.status !== "FULFILLED") {
    return NextResponse.json({ error: "not_fulfillable" }, { status: 409 });
  }

  const nowFulfilled = order.status === "PAID";
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: nowFulfilled ? "FULFILLED" : "PAID",
      fulfilledAt: nowFulfilled ? new Date() : null,
    },
    select: { status: true, fulfilledAt: true },
  });

  return NextResponse.json({
    status: updated.status,
    fulfilledAt: updated.fulfilledAt?.toISOString() ?? null,
  });
}
