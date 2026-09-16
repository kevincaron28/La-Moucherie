import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import { NewsletterSignup } from "./NewsletterSignup";

const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL;

export function Footer() {
  const t = useTranslations("Footer");
  const tAngling = useTranslations("Angling");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest/15 bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-512.png"
              alt="La Moucherie"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-display text-lg font-semibold">La Moucherie</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/70">{t("tagline")}</p>
          {TIKTOK_URL && (
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-cream/50 hover:text-gold"
            >
              <TikTokIcon />
            </a>
          )}
          <NewsletterSignup className="mt-6" />
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {t("shopHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/shop" className="hover:text-cream">
                  {t("allFlies")}
                </Link>
              </li>
              <li>
                <Link href="/shop/water" className="hover:text-cream">
                  {t("waters")}
                </Link>
              </li>
              {SPECIES.slice(0, 4).map((s) => (
                <li key={s}>
                  <Link
                    href={`/shop/species/${SPECIES_SLUGS[s]}`}
                    className="hover:text-cream"
                  >
                    {tAngling(`species.${s}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {t("learnHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/reports" className="hover:text-cream">
                  {t("reports")}
                </Link>
              </li>
              <li>
                <Link href="/catches" className="hover:text-cream">
                  {t("catches")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cream">
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {t("helpHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/shipping" className="hover:text-cream">
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-cream">
                  {t("account")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60 sm:px-6">
        &copy; {year} La Moucherie. {t("rights")}
      </div>
    </footer>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M16.6 5.82c-.7-.77-1.09-1.77-1.09-2.82H12.7v13.44a2.59 2.59 0 1 1-1.83-2.48V10.9a5.86 5.86 0 0 0-.87-.07A5.83 5.83 0 1 0 15.83 16.66V9.02a8.24 8.24 0 0 0 4.87 1.57V7.75a4.83 4.83 0 0 1-4.1-1.93z" />
    </svg>
  );
}
