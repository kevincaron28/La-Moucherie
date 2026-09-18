import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CatchSubmitForm } from "@/components/CatchSubmitForm";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { SPECIES } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

// Waters and patterns come from the database, so this can't be frozen at
// build -- same reasoning as /reports/submit.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catches" });
  return { title: t("submitTitle"), description: t("submitIntro") };
}

/** Keys the client form needs, flattened so it stays a single component --
 * same approach as /reports/submit. */
const FORM_KEYS = [
  "instagramUrlLabel",
  "instagramUrlPlaceholder",
  "fetchButton",
  "fetching",
  "fetchError",
  "species",
  "water",
  "chooseOptional",
  "product",
  "sizeLabel",
  "sizeLabelPlaceholder",
  "submit",
  "sending",
  "moderationNote",
  "thanksTitle",
  "thanksBody",
  "errorGeneric",
  "errorRate",
  "unsupportedUrl",
] as const;

export default async function SubmitCatchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catches");

  const session = await auth();

  // Every photo goes out under an account, never anonymously -- unlike hatch
  // reports, there's no lower-friction anonymous path here, since opening
  // "paste any Instagram URL and we'll scrape it" to the public is exactly
  // the surface worth keeping to signed-in anglers only.
  if (!session?.user) {
    const tAccount = await getTranslations("Account");
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-forest">
          {t("submitTitle")}
        </h1>
        <p className="mt-3 text-ink/70">{t("signInToSubmit")}</p>
        <Link
          href="/account/login"
          className="mt-6 inline-block rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark"
        >
          {tAccount("signIn")}
        </Link>
      </div>
    );
  }

  const tAngling = await getTranslations("Angling");

  const [waters, products] = await Promise.all([
    prisma.fishingWater.findMany({
      orderBy: [{ featured: "desc" }, { nameFr: "asc" }],
      select: { id: true, nameFr: true, nameEn: true },
    }),
    prisma.product.findMany({
      where: { active: true, category: { not: "ASSORTMENT" } },
      orderBy: { slug: "asc" },
      select: { id: true, slug: true, nameFr: true, nameEn: true },
    }),
  ]);

  const copy: Record<string, string> = {};
  for (const key of FORM_KEYS) copy[key] = t(key);
  for (const s of SPECIES) copy[`species${s}`] = tAngling(`species.${s}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/catches" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToCatches")}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("submitTitle")}
      </h1>
      <p className="mt-3 text-ink/70">{t("submitIntro")}</p>

      <div className="mt-10">
        <CatchSubmitForm
          waters={waters.map((w) => ({
            id: w.id,
            name: pick(w.nameFr, w.nameEn, locale),
          }))}
          products={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: pick(p.nameFr, p.nameEn, locale),
          }))}
          t={copy}
        />
      </div>
    </div>
  );
}
