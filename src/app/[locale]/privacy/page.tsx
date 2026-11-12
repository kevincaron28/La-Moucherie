import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return { title: t("title"), description: t("intro") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");
  // Split around the link rather than t.rich(): a callback handed to rich text
  // that returns a client component breaks prerendering.
  const [before, after] = t("officerBody", { link: "@@LINK@@" }).split("@@LINK@@");
  const h2 = "mt-10 font-display text-xl font-semibold text-forest";
  const link = "font-medium text-rust underline underline-offset-2 hover:text-rust-dark";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-6 text-ink/75">{t("intro")}</p>

      <h2 className={h2}>{t("officerTitle")}</h2>
      <p className="mt-4 text-ink/75">
        {before}
        <Link href="/contact" className={link}>
          {t("contactLink")}
        </Link>
        {after}
      </p>

      <h2 className={h2}>{t("adsTitle")}</h2>
      <p className="mt-4 text-ink/75">{t("adsBody1")}</p>
      <p className="mt-4 text-ink/75">{t("adsBody2")}</p>
      <h3 className="mt-6 font-semibold text-forest">{t("adsAcceptTitle")}</h3>
      <p className="mt-2 text-ink/75">{t("adsAcceptBody")}</p>
      <h3 className="mt-6 font-semibold text-forest">{t("adsDeclineTitle")}</h3>
      <p className="mt-2 text-ink/75">{t("adsDeclineBody")}</p>

      <h2 className={h2}>{t("choiceTitle")}</h2>
      <p className="mt-4 text-ink/75">{t("choiceBody")}</p>

      <h2 className={h2}>{t("googleTitle")}</h2>
      <p className="mt-4 text-ink/75">{t("googleBody")}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-ink/75">
        <li>
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className={link}>
            {t("googleLink1")}
          </a>
        </li>
        <li>
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className={link}>
            {t("googleLink2")}
          </a>
        </li>
      </ul>

      <h2 className={h2}>{t("otherTitle")}</h2>
      <p className="mt-4 text-ink/75">{t("otherBody")}</p>
    </div>
  );
}
