import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localize";
import { SPECIES_SLUGS, type Species } from "@/lib/angling";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
  species: string[];
  seasons: string[];
  waterTypes: string[];
  techniques: string[];
  imitatesFr: string[];
  imitatesEn: string[];
  sizes: string[];
  howToFish: string | null;
  proTip: string | null;
  waters: { slug: string; nameFr: string; nameEn: string }[];
};

/**
 * The difference between a site that sells flies and a shop that knows how to
 * fish. Every field is optional — a pattern with nothing filled in simply
 * renders less, rather than showing empty headings.
 */
export async function AnglerSpecs({
  locale,
  species,
  seasons,
  waterTypes,
  techniques,
  imitatesFr,
  imitatesEn,
  sizes,
  howToFish,
  proTip,
  waters,
}: Props) {
  const t = await getTranslations("Angling");
  const imitates = pick(imitatesFr.join(" · "), imitatesEn.join(" · "), locale);

  const rows: { label: string; content: React.ReactNode }[] = [];

  if (species.length > 0) {
    rows.push({
      label: t("speciesTitle"),
      // Linked, because species is the way most customers will want to keep
      // browsing from here.
      content: (
        <span className="flex flex-wrap gap-x-1.5 gap-y-1">
          {species.map((s, i) => (
            <span key={s}>
              <Link
                href={`/shop/species/${SPECIES_SLUGS[s as Species]}`}
                className="underline decoration-forest/25 underline-offset-2 hover:text-forest hover:decoration-forest"
              >
                {t(`species.${s}`)}
              </Link>
              {i < species.length - 1 && <span className="text-ink/40"> ·</span>}
            </span>
          ))}
        </span>
      ),
    });
  }
  if (seasons.length > 0) {
    rows.push({
      label: t("seasonTitle"),
      content: seasons.map((s) => t(`seasons.${s}`)).join(" · "),
    });
  }
  if (waterTypes.length > 0) {
    rows.push({
      label: t("waterTitle"),
      content: waterTypes.map((w) => t(`waterTypes.${w}`)).join(" · "),
    });
  }
  if (techniques.length > 0) {
    rows.push({
      label: t("techniqueTitle"),
      content: techniques.map((x) => t(`techniques.${x}`)).join(" · "),
    });
  }
  if (imitates) {
    rows.push({ label: t("imitatesTitle"), content: imitates });
  }
  if (sizes.length > 0) {
    rows.push({ label: t("sizesTitle"), content: sizes.join(" · ") });
  }
  if (waters.length > 0) {
    rows.push({
      label: t("watersTitle"),
      content: (
        <span className="flex flex-wrap gap-x-1.5 gap-y-1">
          {waters.map((w, i) => (
            <span key={w.slug}>
              <Link
                href={`/shop/water/${w.slug}`}
                className="underline decoration-forest/25 underline-offset-2 hover:text-forest hover:decoration-forest"
              >
                {pick(w.nameFr, w.nameEn, locale)}
              </Link>
              {i < waters.length - 1 && <span className="text-ink/40"> ·</span>}
            </span>
          ))}
        </span>
      ),
    });
  }

  if (rows.length === 0 && !howToFish && !proTip) return null;

  return (
    <section className="mt-12 grid gap-8 md:grid-cols-2">
      {rows.length > 0 && (
        <dl className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-cream/40 px-5">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-4 py-3 text-sm">
              <dt className="w-32 shrink-0 font-medium text-forest">{row.label}</dt>
              <dd className="text-ink/75">{row.content}</dd>
            </div>
          ))}
        </dl>
      )}

      {(howToFish || proTip) && (
        <div className="space-y-5">
          {howToFish && (
            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                {t("howToFish")}
              </h2>
              <p className="mt-2 text-ink/75">{howToFish}</p>
            </div>
          )}
          {proTip && (
            <div className="rounded-2xl border-l-4 border-belly bg-belly/5 px-5 py-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-rust">
                {t("proTip")}
              </h3>
              <p className="mt-1.5 text-sm text-ink/80">{proTip}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
