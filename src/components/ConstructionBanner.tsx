import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Every variant in the catalogue is at zero stock until launch, so without this
 * a visitor's only explanation for "Out of Stock" on all 34 patterns is that the
 * shop is dead. Says so plainly instead, and gives the date.
 *
 * Deliberately not dismissible and not sticky: it should be read on arrival,
 * then scroll away rather than eating a phone's viewport on every page. Delete
 * this component and its two call sites once the shop opens.
 */
export async function ConstructionBanner() {
  const t = await getTranslations("Construction");

  return (
    <div className="border-b border-gold/40 bg-gold/15">
      <p className="mx-auto max-w-6xl px-4 py-2.5 text-center text-xs leading-relaxed text-ink/80 sm:px-6 sm:text-sm">
        <span className="font-semibold text-forest">{t("label")}</span>{" "}
        {t("body")}{" "}
        <Link
          href="/hatches"
          className="font-medium text-rust underline underline-offset-2 hover:text-rust-dark"
        >
          {t("cta")}
        </Link>
      </p>
    </div>
  );
}
