import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca").replace(
    /\/$/,
    ""
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account pages and API routes have nothing for a crawler to index,
        // and indexing a password-reset or checkout URL would be actively
        // wrong — those pages are per-user/per-session, not content.
        disallow: [
          "/*/account",
          "/*/checkout",
          "/*/cart",
          "/*/admin",
          "/*/newsletter",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
