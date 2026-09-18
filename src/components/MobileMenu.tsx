"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_ORDER } from "@/lib/localize";
import { SPECIES, SPECIES_FAMILIES, SPECIES_FAMILY, SPECIES_SLUGS } from "@/lib/angling";
import { ARTICLE_IDS } from "@/lib/insect-articles";
import { HATCHES, HATCH_GROUPS, HATCH_GROUP_KEY } from "@/lib/hatches";

/**
 * A native <details>/<summary> accordion rather than useState per section —
 * free keyboard and screen-reader behaviour, and no re-render wiring. With
 * Learn alone now holding a dozen insect links (headed toward 38) on top of
 * Shop's own categories and Species' nine, having every section permanently
 * expanded meant scrolling past all of them just to reach "About". Only Shop
 * opens by default; everything else is one tap away instead of a long scroll.
 */
function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-t border-forest/10 px-5 py-4 first:border-t-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          {title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 shrink-0 text-ink/40 transition-transform group-open:rotate-180"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <ul className="mt-3 space-y-3">{children}</ul>
    </details>
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
  const tHatches = useTranslations("Hatches");
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
              <Section title={t("shop")} defaultOpen>
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
                {/* Split into cold-water salmonids vs. warmwater species
                    rather than one flat list of nine — the two get fished
                    with genuinely different fly boxes, and grouping them
                    is easier to scan one-handed than nine names in a row. */}
                {SPECIES_FAMILIES.map((family) => (
                  <li key={family}>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink/40">
                      {tAngling(`speciesFamilies.${family}`)}
                    </p>
                    <ul className="mt-2 space-y-3">
                      {SPECIES.filter((sp) => SPECIES_FAMILY[sp] === family).map((sp) => (
                        <Item
                          key={sp}
                          onNavigate={close}
                          href={`/shop/species/${SPECIES_SLUGS[sp]}`}
                        >
                          {tAngling(`species.${sp}`)}
                        </Item>
                      ))}
                    </ul>
                  </li>
                ))}
              </Section>

              <Section title={t("learn")}>
                <Item onNavigate={close} href="/hatches" accent>
                  {t("hatchChart")}
                </Item>
                {/* Grouped by insect order (mayfly/caddis/...) rather than a
                    flat list — worth doing now that articles actually span
                    more than one group; a single-group list would have been
                    a pointless extra layer of menu. */}
                {HATCH_GROUPS.map((group) => {
                  const inGroup = HATCHES.filter(
                    (h) => h.group === group && ARTICLE_IDS.has(h.id)
                  );
                  if (inGroup.length === 0) return null;
                  return (
                    <li key={group}>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-ink/40">
                        {tHatches(HATCH_GROUP_KEY[group])}
                      </p>
                      <ul className="mt-2 space-y-3">
                        {inGroup.map((hatch) => (
                          <Item key={hatch.id} onNavigate={close} href={`/hatches/${hatch.id}`}>
                            {locale === "fr" ? hatch.nameFr : hatch.nameEn}
                          </Item>
                        ))}
                      </ul>
                    </li>
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
