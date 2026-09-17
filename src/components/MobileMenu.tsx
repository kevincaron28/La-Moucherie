"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_ORDER } from "@/lib/localize";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import { INSECT_ARTICLES } from "@/lib/insect-articles";
import { HATCHES } from "@/lib/hatches";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-forest/10 px-5 py-4 first:border-t-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
        {title}
      </p>
      <ul className="mt-3 space-y-3">{children}</ul>
    </div>
  );
}

function Item({
  href,
  onNavigate,
  children,
  accent,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={`block text-[15px] ${
          accent ? "font-semibold text-rust" : "font-medium text-forest"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * The previous mobile nav was a horizontally scrolling strip of five links,
 * which physically cannot show the rest of the site — the hatch chart, the
 * insect pages, the FAQ and the Fly Finder were all unreachable on a phone
 * without going through the footer. A drawer can hold the whole map grouped by
 * what someone is actually trying to do.
 */
export function MobileMenu({ locale }: { locale: string }) {
  const t = useTranslations("Nav");
  const tCategories = useTranslations("Categories");
  const tAngling = useTranslations("Angling");
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  // A drawer that leaves the page scrollable behind it feels broken on a phone.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("menu")}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition hover:bg-forest/10 md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="h-6 w-6"
          aria-hidden
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Portalled straight to <body>: the header this button lives in has
          backdrop-blur, and a backdrop-filter ancestor becomes the containing
          block for `position: fixed` descendants — without the portal, this
          overlay's "fixed inset-0" was sized to the header bar's own height
          instead of the viewport, so the drawer never actually covered the
          screen. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label={t("close")}
            onClick={close}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-parchment shadow-2xl">
            <div className="flex items-center justify-between border-b border-forest/15 px-5 py-4">
              <span className="font-display text-lg font-semibold text-forest">
                La Moucherie
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain pb-8">
              {/* Shop first: it is a shop. The educational sections sit
                  directly under it rather than below the fold. */}
              <Section title={t("shop")}>
                <Item onNavigate={close} href="/shop/finder" accent>
                  {t("flyFinder")}
                </Item>
                <Item onNavigate={close} href="/shop">{tCategories("ALL")}</Item>
                {CATEGORY_ORDER.map((cat) => (
                  <Item key={cat} onNavigate={close} href={`/shop?category=${cat}`}>
                    {tCategories(cat)}
                  </Item>
                ))}
              </Section>

              <Section title={tAngling("speciesTitle")}>
                {SPECIES.map((sp) => (
                  <Item key={sp} onNavigate={close} href={`/shop/species/${SPECIES_SLUGS[sp]}`}>
                    {tAngling(`species.${sp}`)}
                  </Item>
                ))}
              </Section>

              <Section title={t("learn")}>
                <Item onNavigate={close} href="/hatches" accent>
                  {t("hatchChart")}
                </Item>
                {INSECT_ARTICLES.map((a) => {
                  const hatch = HATCHES.find((h) => h.id === a.hatchId);
                  if (!hatch) return null;
                  return (
                    <Item key={a.hatchId} onNavigate={close} href={`/hatches/${a.hatchId}`}>
                      {locale === "fr" ? hatch.nameFr : hatch.nameEn}
                    </Item>
                  );
                })}
                <Item onNavigate={close} href="/faq">{t("faq")}</Item>
              </Section>

              <Section title={t("onTheWater")}>
                <Item onNavigate={close} href="/reports">{t("reports")}</Item>
                <Item onNavigate={close} href="/reports/submit">{t("submitReport")}</Item>
                <Item onNavigate={close} href="/catches">{t("catches")}</Item>
                <Item onNavigate={close} href="/shop/water">{t("waters")}</Item>
              </Section>

              <Section title={t("aboutSection")}>
                <Item onNavigate={close} href="/about">{t("about")}</Item>
                <Item onNavigate={close} href="/contact">{t("contact")}</Item>
                <Item onNavigate={close} href="/shipping">{t("shipping")}</Item>
                <Item onNavigate={close} href={status === "authenticated" ? "/account" : "/account/login"}>
                  {status === "authenticated" ? t("account") : t("signIn")}
                </Item>
              </Section>
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
