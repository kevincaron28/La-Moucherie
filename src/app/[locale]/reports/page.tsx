import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { HATCHES } from "@/lib/hatches";
import { chipClass } from "@/lib/chip";
import { formatDualTemp } from "@/lib/temperature";
import { reputationTitle } from "@/lib/reputation";
import { FishAvatar } from "@/components/FishAvatar";
import { VoteButton } from "@/components/VoteButton";
import type { Locale } from "@/i18n/routing";

// No dynamic segment here, so this route would otherwise be fully static-
// generated at build time and frozen until the next deploy — wrong for a
// page whose whole content (approved field reports) is meant to change from
// the admin dashboard alone, with no code change or redeploy involved.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Reports" });
  return { title: t("title"), description: t("intro") };
}

// This used to be two sections: the shop's own hand-written "what's working"
// notes (a separate admin-only compose tool, published rarely), and this
// angler-submitted list underneath. The shop tool is gone — Kevin files a
// field report the exact same way anyone else does, through /reports/submit
// — so there's one list, one voice, one form for everybody.
export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reports");
  const tHatch = await getTranslations("HatchReport");
  const tAngling = await getTranslations("Angling");

  const session = await auth();

  const hatchReports = await prisma.hatchReport.findMany({
    where: { approved: true },
    orderBy: { observedOn: "desc" },
    take: 30,
    select: {
      id: true,
      anglerName: true,
      observedOn: true,
      hatchId: true,
      hookSize: true,
      intensity: true,
      species: true,
      waterLevel: true,
      waterClarity: true,
      sky: true,
      waterTempC: true,
      note: true,
      fromShop: true,
      waterOther: true,
      userId: true,
      upvoteCount: true,
      user: { select: { favoriteSpecies: true, reputation: true } },
      water: { select: { nameFr: true, nameEn: true } },
      product: { select: { slug: true, nameFr: true, nameEn: true } },
    },
  });

  // Which of these this visitor has already voted for, so the button opens
  // in the right state instead of letting a reload invite a 409.
  const votedReportIds = session?.user
    ? new Set(
        (
          await prisma.hatchReportVote.findMany({
            where: {
              userId: session.user.id,
              hatchReportId: { in: hatchReports.map((r) => r.id) },
            },
            select: { hatchReportId: true },
          })
        ).map((v) => v.hatchReportId)
      )
    : new Set<string>();

  function voteDisabledReason(reportUserId: string | null): string | undefined {
    if (!session?.user) return tHatch("signInToVote");
    if (reportUserId === session.user.id) return tHatch("voteOwnContent");
    return undefined;
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-ink/70">{t("intro")}</p>
        </div>
        <Link
          href="/reports/submit"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-dark"
        >
          {tHatch("submitCta")}
        </Link>
      </div>

      {hatchReports.length === 0 ? (
        <p className="mt-10 text-ink/60">{tHatch("sectionEmpty")}</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {hatchReports.map((r) => {
            const hatch = HATCHES.find((h) => h.id === r.hatchId);
            const where =
              (r.water && pick(r.water.nameFr, r.water.nameEn, locale)) ||
              r.waterOther ||
              null;
            return (
              <li key={r.id} className="rounded-2xl border border-forest/10 bg-cream/40 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-display font-semibold text-forest">
                    {where ?? tHatch("unknownWater")}
                  </p>
                  <p className="text-xs text-ink/50">{dateFormatter.format(r.observedOn)}</p>
                </div>

                {(hatch || r.intensity || r.species || r.product) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hatch && (
                      <span className={chipClass("solid")}>
                        {pick(hatch.nameFr, hatch.nameEn, locale)}
                        {r.hookSize ? ` #${r.hookSize}` : ""}
                      </span>
                    )}
                    {r.intensity && (
                      <span className={chipClass("outline")}>
                        {tHatch(`intensity${r.intensity}`)}
                      </span>
                    )}
                    {r.species && (
                      <span className={chipClass("solid")}>
                        {tAngling(`species.${r.species}`)}
                      </span>
                    )}
                    {r.product && (
                      <Link href={`/shop/${r.product.slug}`} className={chipClass("accent")}>
                        {pick(r.product.nameFr, r.product.nameEn, locale)}
                      </Link>
                    )}
                  </div>
                )}

                {/* Conditions logged with the report — separate row since
                    they describe the day, not the catch. */}
                {(r.waterLevel || r.waterClarity || r.sky || r.waterTempC != null) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.waterLevel && (
                      <span className={chipClass("outline")}>
                        {tHatch("waterLevel")}: {tHatch(`waterLevel${r.waterLevel}`)}
                      </span>
                    )}
                    {r.waterClarity && (
                      <span className={chipClass("outline")}>
                        {tHatch("waterClarity")}: {tHatch(`waterClarity${r.waterClarity}`)}
                      </span>
                    )}
                    {r.sky && (
                      <span className={chipClass("outline")}>
                        {tHatch("sky")}: {tHatch(`sky${r.sky}`)}
                      </span>
                    )}
                    {r.waterTempC != null && (
                      <span className={chipClass("outline")}>
                        {formatDualTemp(r.waterTempC)}
                      </span>
                    )}
                  </div>
                )}

                {r.note && <p className="mt-3 text-sm text-ink/75">{r.note}</p>}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-xs text-ink/50">
                    {r.user && (
                      <FishAvatar
                        species={r.user.favoriteSpecies}
                        size="sm"
                        title={
                          r.user.favoriteSpecies
                            ? tAngling(`species.${r.user.favoriteSpecies}`)
                            : undefined
                        }
                      />
                    )}
                    <span>
                      {r.fromShop ? tHatch("bylineShop") : tHatch("byline", { name: r.anglerName })}
                      {r.user && (
                        <span className="text-ink/35">
                          {" · "}
                          {reputationTitle(r.user.reputation, locale)}
                        </span>
                      )}
                    </span>
                  </p>
                  <VoteButton
                    endpoint={`/api/hatch-reports/${r.id}/vote`}
                    initialCount={r.upvoteCount}
                    initialVoted={votedReportIds.has(r.id)}
                    disabledReason={voteDisabledReason(r.userId)}
                    label={tHatch("upvoteAria")}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
