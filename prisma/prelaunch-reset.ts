// One-shot pre-launch reset, run from the build pipeline because the build host
// is the only place with database access (the dev sandbox can't reach Neon).
//
// Test checkouts are indistinguishable from real ones once they're rows: they
// drew down real stock and sit in real order history. Before the first real
// customer that's harmless to clear, and afterwards it is destructive — so this
// refuses to run unless PRELAUNCH_RESET is explicitly set, and prints
// everything it found before touching anything.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.PRELAUNCH_RESET !== "1") return;

  console.log("\n=== PRE-LAUNCH RESET ===");

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });
  const reviews = await prisma.review.findMany();

  console.log(`\nFound ${orders.length} order(s):`);
  for (const o of orders) {
    const lines = o.items.map((i) => `${i.nameSnapshotEn} x${i.quantity}`).join(", ");
    console.log(
      `  ${o.createdAt.toISOString().slice(0, 10)}  ${o.status.padEnd(9)} ` +
        `${(o.amountTotalCents / 100).toFixed(2)} ${o.currency.toUpperCase()}  ` +
        `${o.email}  [${lines}]`
    );
  }

  console.log(`\nFound ${reviews.length} review(s):`);
  for (const r of reviews) {
    console.log(
      `  ${r.rating}/5 "${r.title ?? ""}" by ${r.customerName} <${r.email}> ` +
        `status=${r.status} verified=${r.verifiedPurchase}`
    );
  }

  if (orders.length === 0 && reviews.length === 0) {
    console.log("\nNothing to clean up.");
    console.log("=== DONE — now remove PRELAUNCH_RESET from the environment ===\n");
    return;
  }

  // Only paid orders ever decremented stock, so only those give it back.
  const restore = new Map<string, number>();
  for (const o of orders) {
    if (o.status !== "PAID" && o.status !== "FULFILLED") continue;
    for (const item of o.items) {
      if (!item.variantId) continue;
      restore.set(item.variantId, (restore.get(item.variantId) ?? 0) + item.quantity);
    }
  }

  console.log(`\nRestoring stock on ${restore.size} variant(s):`);
  for (const [variantId, qty] of restore) {
    const v = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: qty } },
    });
    console.log(`  ${v.sku}: +${qty} -> ${v.stock}`);
  }

  // Scoped to exactly the ids listed above rather than emptying the tables, so
  // an order placed while this runs can't be swept up in it.
  const orderIds = orders.map((o) => o.id);
  const reviewIds = reviews.map((r) => r.id);

  // OrderItem rows cascade on order delete; reviews are independent.
  const delOrders = await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
  const delReviews = await prisma.review.deleteMany({ where: { id: { in: reviewIds } } });

  console.log(`\nRemoved ${delOrders.count} order(s) and ${delReviews.count} review(s).`);
  console.log("Customer accounts were left alone.");
  console.log("=== DONE — now remove PRELAUNCH_RESET from the environment ===\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
