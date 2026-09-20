import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Someone who lands here mistyped a URL, followed a stale link, or clicked a
// pattern that has since been retired. A single "back to shop" button treats
// all three the same and sends them to a grid to start over. The ways back
// below are the pages actually worth arriving on — the shop, and the two
// pieces of content this site is found through.
const DESTINATIONS = [
  { href: "/shop", key: "linkShop" },
  { href: "/hatches", key: "linkHatches" },
  { href: "/shop/water", key: "linkWaters" },
  { href: "/contact", key: "linkContact" },
] as const;

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest">{t("title")}</h1>
      <p className="mt-3 text-ink/70">{t("body")}</p>

      <Link
        href="/shop"
        className="mt-7 inline-block rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark"
      >
        {t("cta")}
      </Link>

      <div className="mt-10 border-t border-forest/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
          {t("elsewhere")}
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {DESTINATIONS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="text-forest underline decoration-forest/25 underline-offset-4 transition hover:text-rust hover:decoration-rust"
              >
                {t(d.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
