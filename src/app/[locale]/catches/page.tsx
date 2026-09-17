import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { chipClass } from "@/lib/chip";
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
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        {instagram && (
          <>
            {" "}
            {t("instagramHint")}{" "}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rust underline underline-offset-2"
            >
              Instagram
            </a>
          </>
        )}
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
              className="overflow-hidden rounded-2xl border border-forest/10 bg-cream/40"
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
              <div className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-display font-semibold text-forest">{c.anglerName}</p>
                  <p className="text-xs text-ink/50">{dateFormatter.format(c.createdAt)}</p>
                </div>

                {(c.species || c.sizeLabel || c.water) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.species && (
                      <span className={chipClass("solid")}>
                        {tAngling(`species.${c.species}`)}
                      </span>
                    )}
                    {c.sizeLabel && <span className={chipClass("outline")}>{c.sizeLabel}</span>}
                    {c.water && (
                      <span className={chipClass("outline")}>
                        {pick(c.water.nameFr, c.water.nameEn, locale)}
                      </span>
                    )}
                  </div>
                )}

                {(c.captionFr || c.captionEn) && (
                  <p className="mt-3 text-sm text-ink/75">
                    {pick(c.captionFr ?? "", c.captionEn ?? "", locale)}
                  </p>
                )}

                {(c.product || c.instagramUrl) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.product && (
                      <Link href={`/shop/${c.product.slug}`} className={chipClass("accent")}>
                        {pick(c.product.nameFr, c.product.nameEn, locale)}
                      </Link>
                    )}
                    {c.instagramUrl && (
                      <a
                        href={c.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={chipClass("accent")}
                      >
                        {t("viaInstagram")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
