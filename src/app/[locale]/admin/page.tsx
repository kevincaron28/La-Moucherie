import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import type { Locale } from "@/i18n/routing";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await isAdmin())) {
    notFound();
  }

  const [
    pendingReviews,
    lowStockVariants,
    noVariantProducts,
    recentOrders,
    subscriberCount,
    recentCampaigns,
    plannedFlies,
    allCatches,
    hatchReports,
    waters,
    activeProducts,
  ] = await Promise.all([
    prisma.review.findMany({
      where: { status: "PENDING" },
      include: {
        product: { select: { id: true, slug: true, nameFr: true, nameEn: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    // No take limit: this is a work list, not a teaser. Capping it at 30 used
    // to hide the fact that, pre-launch, every one of the ~100 active
    // variants across every hook size sits at zero — a silently truncated
    // "low stock" list is worse than no list at all for the person about to
    // fill it in.
    prisma.productVariant.findMany({
      where: { stock: { lte: 3 }, product: { active: true } },
      include: {
        product: { select: { slug: true, nameFr: true, nameEn: true } },
      },
      orderBy: [{ product: { nameFr: "asc" } }, { stock: "asc" }],
    }),
    // Zero variants is a different, more urgent problem than low stock — a
    // product like this has nothing to add to cart at all, and the
    // stock-based query above never sees it (there's no variant row to find).
    prisma.product.findMany({
      where: { active: true, variants: { none: {} } },
      select: { id: true, slug: true, nameFr: true, nameEn: true },
      orderBy: { nameFr: "asc" },
    }),
    prisma.order.findMany({
      where: { status: { in: ["PAID", "FULFILLED"] } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
    prisma.newsletterCampaign.findMany({
      orderBy: { sentAt: "desc" },
      take: 5,
    }),
    prisma.plannedFly.findMany({
      orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    }),
    prisma.catchPhoto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        water: { select: { slug: true, nameFr: true, nameEn: true } },
        product: { select: { slug: true, nameFr: true, nameEn: true } },
        user: { select: { name: true } },
      },
      take: 30,
    }),
    // Unapproved first: the queue is the reason to open this section.
    prisma.hatchReport.findMany({
      orderBy: [{ approved: "asc" }, { observedOn: "desc" }],
      include: {
        water: { select: { nameFr: true, nameEn: true } },
        product: { select: { nameFr: true, nameEn: true } },
      },
      take: 40,
    }),
    prisma.fishingWater.findMany({
      select: { id: true, slug: true, nameFr: true, nameEn: true },
      orderBy: { nameFr: "asc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      select: { id: true, slug: true, nameFr: true, nameEn: true },
      orderBy: { nameFr: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-rust">
          {locale === "fr" ? "Espace Atelier & Opérations" : "Workshop & Operations"}
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
          {locale === "fr" ? "Tableau de bord de l'artisan" : "Tyer's Dashboard"}
        </h1>
      </div>

      <AdminDashboardClient
        locale={locale}
        pendingReviews={pendingReviews.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          email: r.email,
          rating: r.rating,
          title: r.title,
          body: r.body,
          createdAt: r.createdAt.toISOString(),
          product: r.product,
        }))}
        lowStockVariants={lowStockVariants.map((v) => ({
          id: v.id,
          sku: v.sku,
          nameFr: v.nameFr,
          nameEn: v.nameEn,
          stock: v.stock,
          product: v.product,
        }))}
        noVariantProducts={noVariantProducts}
        recentOrders={recentOrders.map((o) => ({
          id: o.id,
          customerName: o.customerName,
          email: o.email,
          amountTotalCents: o.amountTotalCents,
          currency: o.currency,
          status: o.status,
          shippingMethod: o.shippingMethod,
          createdAt: o.createdAt.toISOString(),
          fulfilledAt: o.fulfilledAt?.toISOString() ?? null,
          itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
        }))}
        subscriberCount={subscriberCount}
        recentCampaigns={recentCampaigns.map((c) => ({
          id: c.id,
          subjectFr: c.subjectFr,
          subjectEn: c.subjectEn,
          recipientCount: c.recipientCount,
          sentAt: c.sentAt.toISOString(),
        }))}
        plannedFlies={plannedFlies.map((p) => ({
          id: p.id,
          nameFr: p.nameFr,
          nameEn: p.nameEn,
          category: p.category,
          species: p.species,
          notes: p.notes,
        }))}
        hatchReports={hatchReports.map((r) => ({
          id: r.id,
          anglerName: r.anglerName,
          email: r.email,
          observedOn: r.observedOn.toISOString(),
          waterName: r.water
            ? locale === "fr"
              ? r.water.nameFr
              : r.water.nameEn
            : r.waterOther,
          hatchId: r.hatchId,
          hookSize: r.hookSize,
          intensity: r.intensity,
          species: r.species,
          waterLevel: r.waterLevel,
          waterClarity: r.waterClarity,
          sky: r.sky,
          waterTempC: r.waterTempC,
          note: r.note,
          approved: r.approved,
          fromShop: r.fromShop,
          productName: r.product
            ? locale === "fr"
              ? r.product.nameFr
              : r.product.nameEn
            : null,
        }))}
        allCatches={allCatches.map((c) => ({
          id: c.id,
          anglerName: c.anglerName,
          imageUrl: c.imageUrl,
          instagramUrl: c.instagramUrl,
          captionFr: c.captionFr,
          captionEn: c.captionEn,
          species: c.species,
          sizeLabel: c.sizeLabel,
          conditionsFr: c.conditionsFr,
          conditionsEn: c.conditionsEn,
          approved: c.approved,
          submittedByName: c.user?.name ?? null,
          water: c.water,
          product: c.product,
        }))}
        waters={waters}
        activeProducts={activeProducts}
      />
    </div>
  );
}
