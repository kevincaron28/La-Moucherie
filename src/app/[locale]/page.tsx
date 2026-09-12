import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { variants: true },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="texture-rope pointer-events-none absolute inset-0 opacity-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {t("heroKicker")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-md text-lg text-cream/80">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
              >
                {t("heroCta")}
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-cream/40 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-cream/10"
              >
                {t("heroSecondaryCta")}
              </Link>
            </div>
          </div>
          <div className="mx-auto w-64 rounded-full ring-4 ring-gold/40 drop-shadow-2xl sm:w-80 md:w-full md:max-w-sm">
            <div className="relative aspect-square w-full overflow-hidden rounded-full">
              <Image
                src="/brand/logo-512.png"
                alt="La Moucherie"
                fill
                sizes="(min-width: 768px) 24rem, 16rem"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                {t("featuredTitle")}
              </h2>
              <p className="mt-2 max-w-lg text-ink/70">{t("featuredSubtitle")}</p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-rust underline underline-offset-4 hover:text-rust-dark"
            >
              {t("shopAllCta")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-forest/10 bg-cream/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rust">
              {t("storyKicker")}
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl">
              {t("storyTitle")}
            </h2>
            <p className="mt-4 text-ink/75">{t("storyBody")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-1">
            <ValueItem title={t("valuesHandmadeTitle")} body={t("valuesHandmadeBody")} />
            <ValueItem title={t("valuesLocalTitle")} body={t("valuesLocalBody")} />
            <ValueItem title={t("valuesQualityTitle")} body={t("valuesQualityBody")} />
          </div>
        </div>
      </section>
    </>
  );
}

function ValueItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-rust pl-4">
      <h3 className="font-display font-semibold text-forest">{title}</h3>
      <p className="mt-1 text-sm text-ink/70">{body}</p>
    </div>
  );
}
