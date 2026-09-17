import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { formatPrice } from "@/lib/format";
import { LETTER_RATE_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/shipping";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return { title: t("title"), description: t("intro") };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FAQ");

  const letterPrice = formatPrice(LETTER_RATE_CENTS, locale);
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale);

  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3", { letterPrice, threshold }) },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
    { q: t("q8"), a: t("a8") },
    { q: t("q9"), a: t("a9") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-3 text-ink/70">{t("intro")}</p>

      <dl className="mt-10 divide-y divide-forest/10 border-y border-forest/10">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-forest">
              {item.q}
              <span className="shrink-0 text-ink/40 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-ink/75">{item.a}</p>
          </details>
        ))}
      </dl>

      <p className="mt-10 text-sm text-ink/60">
        {t("stillHaveQuestions")}{" "}
        <Link href="/contact" className="text-rust underline underline-offset-2">
          {t("contactCta")}
        </Link>
      </p>
    </div>
  );
}
