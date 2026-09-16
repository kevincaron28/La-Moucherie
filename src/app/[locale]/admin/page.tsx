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
    recentOrders,
    subscriberCount,
    recentReports,
    recentCampaigns,
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
      />
    </div>
  );
}
