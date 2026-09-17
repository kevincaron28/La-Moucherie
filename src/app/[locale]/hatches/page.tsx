import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { pick } from "@/lib/localize";
import type { Locale } from "@/i18n/routing";

const GROUPS = [
  { key: "caddis", patternSlugs: ["elk-wing-caddis", "caddis-pupa"] },
  { key: "mayfly", patternSlugs: ["pheasant-tail-nymph", "hendrickson"] },
  { key: "stonefly", patternSlugs: ["montana-stone"] },
  { key: "midge", patternSlugs: ["zebra-midge"] },
  { key: "terrestrial", patternSlugs: ["foam-hopper", "foam-ant", "foam-beetle"] },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hatches" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function HatchesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hatches");

  const allSlugs = GROUPS.flatMap((g) => g.patternSlugs);
  const patterns = await prisma.product.findMany({
    where: { slug: { in: allSlugs }, active: true },
    select: { slug: true, nameFr: true, nameEn: true },
  });
  const patternBySlug = new Map(patterns.map((p) => [p.slug, p]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-ink/70">{t("intro")}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-ink/45">{t("disclaimer")}</p>

      <div className="mt-10 space-y-10">
        {GROUPS.map((group) => (
          <section
            key={group.key}
            id={group.key}
            className="rounded-2xl border border-forest/10 bg-cream/40 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-forest">
                {t(`${group.key}Name`)}
              </h2>
              <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
                {t(`${group.key}When`)}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink/75">{t(`${group.key}Body`)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.patternSlugs
                .map((slug) => patternBySlug.get(slug))
                .filter((p): p is NonNullable<typeof p> => Boolean(p))
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/shop/${p.slug}`}
                    className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-medium text-forest transition hover:border-forest/50 hover:bg-forest/5"
                  >
                    {pick(p.nameFr, p.nameEn, locale)}
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink/60">
        {t("reportsLinkIntro")}{" "}
        <Link href="/reports" className="text-rust underline underline-offset-2">
          {t("reportsLinkCta")}
        </Link>
      </p>
    </div>
  );
}
