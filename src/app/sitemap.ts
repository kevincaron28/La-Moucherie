import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SPECIES_SLUGS } from "@/lib/angling";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca").replace(/\/$/, "");
  const now = new Date();

  // Static marketing routes
  const staticPaths = [
    "",
    "/shop",
    "/shop/water",
    "/shop/finder",
    "/reports",
    "/catches",
    "/about",
    "/contact",
    "/faq",
    "/wholesale",
    "/ambassadors",
    "/shipping",
  ];
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Active Products
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const productEntries: MetadataRoute.Sitemap = [];
  for (const p of products) {
    for (const locale of routing.locales) {
      productEntries.push({
        url: `${baseUrl}/${locale}/shop/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  // Species landing pages
  const speciesEntries: MetadataRoute.Sitemap = [];
  for (const slug of Object.values(SPECIES_SLUGS)) {
    for (const locale of routing.locales) {
      speciesEntries.push({
        url: `${baseUrl}/${locale}/shop/species/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Named Waters
  const waters = await prisma.fishingWater.findMany({
    select: { slug: true, updatedAt: true },
  });
  const waterEntries: MetadataRoute.Sitemap = [];
  for (const w of waters) {
    for (const locale of routing.locales) {
      waterEntries.push({
        url: `${baseUrl}/${locale}/shop/water/${w.slug}`,
        lastModified: w.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Published Fishing Reports
  const reports = await prisma.fishingReport.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  const reportEntries: MetadataRoute.Sitemap = [];
  for (const r of reports) {
    for (const locale of routing.locales) {
      reportEntries.push({
        url: `${baseUrl}/${locale}/reports/${r.slug}`,
        lastModified: r.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return [
    ...staticEntries,
    ...productEntries,
    ...speciesEntries,
    ...waterEntries,
    ...reportEntries,
  ];
}
