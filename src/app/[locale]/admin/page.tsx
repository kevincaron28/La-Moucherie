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
    recentReports,
    recentCampaigns,
    plannedFlies,
    allReports,
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
    prisma.productVariant.findMany({
      where: { stock: { lte: 3 }, product: { active: true } },
      include: {
        product: { select: { slug: true, nameFr: true, nameEn: true } },
      },
      orderBy: { stock: "asc" },
      take: 30,
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
    prisma.fishingReport.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: {
        id: true,
        titleFr: true,
        titleEn: true,
        bodyFr: true,
        bodyEn: true,
        conditionsFr: true,
        conditionsEn: true,
      },
    }),
    prisma.newsletterCampaign.findMany({
      orderBy: { sentAt: "desc" },
      take: 5,
    }),
    prisma.plannedFly.findMany({
      orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    }),
    prisma.fishingReport.findMany({
      orderBy: { createdAt: "desc" },
      include: { water: { select: { slug: true, nameFr: true, nameEn: true } } },
      take: 30,
    }),
    prisma.catchPhoto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        water: { select: { slug: true, nameFr: true, nameEn: true } },
        product: { select: { slug: true, nameFr: true, nameEn: true } },
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
          itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
        }))}
        subscriberCount={subscriberCount}
        recentReports={recentReports}
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
        allReports={allReports.map((r) => ({
          id: r.id,
          titleFr: r.titleFr,
          titleEn: r.titleEn,
          bodyFr: r.bodyFr,
          bodyEn: r.bodyEn,
          conditionsFr: r.conditionsFr,
          conditionsEn: r.conditionsEn,
          published: r.published,
          water: r.water,
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
          water: c.water,
          product: c.product,
        }))}
        waters={waters}
        activeProducts={activeProducts}
      />
    </div>
  );
}
