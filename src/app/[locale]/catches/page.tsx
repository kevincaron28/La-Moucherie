import Script from "next/script";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

// No dynamic segment here, so this route would otherwise be fully static-
// generated at build time and frozen until the next deploy — wrong for a
// page whose whole content (approved catches) is meant to change from the
// admin dashboard alone, with no code change or redeploy involved.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catches" });
  return { title: t("title"), description: t("intro") };
}

export default async function CatchesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catches");
  const tAngling = await getTranslations("Angling");

  // Only what's been approved by hand — this page is social proof, so a photo
  // appears because it was chosen, not because it was uploaded.
  const catches = await prisma.catchPhoto.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: {
      water: { select: { slug: true, nameFr: true, nameEn: true } },
      product: { select: { slug: true, nameFr: true, nameEn: true } },
    },
  });

  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("intro")}</p>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        {t("submitHint")}{" "}
        <Link href="/contact" className="text-rust underline underline-offset-2">
          {t("submitCta")}
        </Link>
        {tiktok && (
          <>
            {" "}
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rust underline underline-offset-2"
            >
              TikTok
            </a>
          </>
        )}
      </p>

      {catches.length === 0 ? (
        <p className="mt-12 text-ink/60">{t("empty")}</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catches.map((c) => (
            <li
              key={c.id}
              className="overflow-hidden rounded-2xl border border-forest/10 bg-parchment"
            >
              {/* Photos are curated URLs, not uploads, so next/image can't
                  optimise arbitrary hosts here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.imageUrl}
                alt={pick(c.captionFr ?? "", c.captionEn ?? "", locale) || c.anglerName}
                className="aspect-square w-full bg-cream object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <p className="font-display font-semibold text-forest">{c.anglerName}</p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {[
                    c.species && tAngling(`species.${c.species}`),
                    c.water && pick(c.water.nameFr, c.water.nameEn, locale),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {(c.captionFr || c.captionEn) && (
                  <p className="mt-2 text-sm text-ink/75">
                    {pick(c.captionFr ?? "", c.captionEn ?? "", locale)}
                  </p>
                )}
                {c.product && (
                  <Link
                    href={`/shop/${c.product.slug}`}
                    className="mt-3 inline-block text-sm font-medium text-rust underline underline-offset-2"
                  >
                    {pick(c.product.nameFr, c.product.nameEn, locale)}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16 border-t border-forest/10 pt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          {t("instagramTitle")}
        </h2>
        <div className="mt-6 sk-ww-instagram-hashtag-feed" data-embed-id="25714398" />
        <Script
          src="https://widgets.sociablekit.com/instagram-hashtag-feed/widget.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
}
