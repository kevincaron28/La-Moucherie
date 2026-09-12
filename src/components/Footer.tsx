import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
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
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
            {t("company")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>
              <Link href="/shop" className="hover:text-cream">
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cream">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cream">
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-cream">
                {t("shipping")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60 sm:px-6">
        &copy; {year} La Moucherie. {t("rights")}
      </div>
    </footer>
  );
}
