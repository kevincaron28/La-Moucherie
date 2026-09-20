import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { HatchReportForm } from "@/components/HatchReportForm";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { SPECIES } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

// Waters and patterns come from the database, so this can't be frozen at build.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HatchReport" });
  return { title: t("title"), description: t("intro") };
}

/** Keys the client form needs, flattened so it stays a single component. */
const FORM_KEYS = [
  "choose",
  "chooseOptional",
  "water",
  "waterOther",
  "waterOtherPlaceholder",
  "date",
  "insect",
  "hookSize",
  "intensity",
  "intensityNONE",
  "intensitySPARSE",
  "intensitySTEADY",
  "intensityHEAVY",
  "waterLevel",
  "waterLevelLOW",
  "waterLevelNORMAL",
  "waterLevelHIGH",
  "waterClarity",
  "waterClarityCLEAR",
  "waterClaritySTAINED",
  "waterClarityMUDDY",
  "sky",
  "skySUNNY",
  "skyPARTLY_CLOUDY",
  "skyOVERCAST",
  "skyRAIN",
  "waterTemp",
  "species",
  "flyUsed",
  "note",
  "notePlaceholder",
  "name",
  "email",
  "emailNote",
  "filingAs",
  "optIn",
  "submit",
  "sending",
  "moderationNote",
  "thanksTitle",
  "thanksBody",
  "errorGeneric",
  "errorRate",
  "groupMAYFLY",
  "groupCADDIS",
  "groupSTONEFLY",
  "groupMIDGE",
  "groupTERRESTRIAL",
] as const;

// Read from the shared vocabulary rather than repeating it: this list, the
// form's own options and the API's validator were three hand-kept copies of
// the same nine species, so adding one to the schema left the other two
// silently disagreeing with it.
const SPECIES_KEYS = SPECIES;

export default async function SubmitReportPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HatchReport");
  const tAngling = await getTranslations("Angling");

  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      })
    : null;

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
  for (const s of SPECIES_KEYS) copy[`species${s}`] = tAngling(`species.${s}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/reports" className="text-sm font-medium text-forest/70 hover:text-rust">
        &larr; {t("backToReports")}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-ink/70">{t("intro")}</p>

      <div className="mt-10">
        <HatchReportForm
          locale={locale}
          user={user}
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
