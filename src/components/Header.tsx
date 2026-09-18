"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { CATEGORY_ORDER } from "@/lib/localize";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SearchBox } from "./SearchBox";
import { MobileMenu } from "./MobileMenu";
import { ARTICLE_IDS } from "@/lib/insect-articles";
import { HATCHES, HATCH_GROUPS, HATCH_GROUP_KEY } from "@/lib/hatches";

export function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const { itemCount } = useCart();
  const { status, data: session } = useSession();
  const isAdmin = session?.user?.isAdmin === true;

  return (
    <header className="sticky top-0 z-40 border-b border-forest/15 bg-parchment/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/brand/logo-512.png"
            alt="La Moucherie"
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-wide text-forest sm:text-xl">
            La Moucherie
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-forest md:flex">
          <ShopMenu />
          <LearnMenu />
          <OnWaterMenu />
          <Link href="/about" className="transition hover:text-rust">
            {t("about")}
          </Link>
          <Link href="/contact" className="transition hover:text-rust">
            {t("contact")}
          </Link>
        </nav>

        <SearchBox className="hidden max-w-[16rem] flex-1 lg:block" />

        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden shrink-0 rounded-full border border-rust/40 px-3 py-1.5 text-xs font-semibold text-rust transition hover:bg-rust/10 sm:block"
            >
              {t("admin")}
            </Link>
          )}
          <LocaleSwitcher />
          <Link
            href={status === "authenticated" ? "/account" : "/account/login"}
            aria-label={status === "authenticated" ? t("account") : t("signIn")}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-forest transition hover:bg-forest/10 sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-[22px] w-[22px]"
              aria-hidden
            >
              <circle cx="12" cy="8" r="3.4" />
              <path strokeLinecap="round" d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest transition hover:bg-forest/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-[22px] w-[22px]"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h1.5l1.2 12.2A2 2 0 0 0 7.7 18h9.6a2 2 0 0 0 2-1.8L20.5 8H6"
              />
              <circle cx="9" cy="21" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="17" cy="21" r="1.3" fill="currentColor" stroke="none" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rust px-1 text-[10px] font-semibold text-parchment">
                {itemCount}
              </span>
            )}
          </Link>
          <MobileMenu locale={locale} />
        </div>
      </div>
      {/* One tap to the whole site on a phone, grouped — see MobileMenu for
          why the old scrolling strip had to go. */}
      <nav className="flex items-center gap-4 border-t border-forest/10 px-4 py-2 text-sm font-medium text-forest md:hidden">
        <Link href="/shop" className="font-semibold">
          {t("shop")}
        </Link>
        <Link href="/hatches" className="text-rust">
          {t("hatchChart")}
        </Link>
        <Link href="/reports">{t("reports")}</Link>
      </nav>
      <div className="border-t border-forest/10 px-4 py-2 lg:hidden">
        <SearchBox />
      </div>
    </header>
  );
}

/**
 * The desktop "Shop" link doubles as a dropdown into categories and species —
 * both already have real pages, they just weren't reachable before landing on
 * /shop first. Click-toggled rather than hover-only so it works the same on
 * trackpads and touch laptops that don't have a reliable :hover state.
 */
function ShopMenu() {
  const t = useTranslations("Nav");
  const tCategories = useTranslations("Categories");
  const tAngling = useTranslations("Angling");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 transition hover:text-rust"
      >
        {t("shop")}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[26rem] rounded-xl border border-forest/15 bg-parchment p-5 shadow-lg">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {tCategories("ALL")}
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                <li>
                  <Link href="/shop" onClick={() => setOpen(false)} className="text-forest hover:text-rust">
                    {tCategories("ALL")}
                  </Link>
                </li>
                {CATEGORY_ORDER.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/shop?category=${cat}`}
                      onClick={() => setOpen(false)}
                      className="text-forest hover:text-rust"
                    >
                      {tCategories(cat)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {tAngling("speciesTitle")}
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                {SPECIES.map((sp) => (
                  <li key={sp}>
                    <Link
                      href={`/shop/species/${SPECIES_SLUGS[sp]}`}
                      onClick={() => setOpen(false)}
                      className="text-forest hover:text-rust"
                    >
                      {tAngling(`species.${sp}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-forest/10 pt-3">
            <Link
              href="/shop/finder"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-forest hover:text-rust"
            >
              {t("flyFinder")} &rarr;
            </Link>
            <Link
              href="/shop/water"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-forest hover:text-rust"
            >
              {t("waters")} &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shared open/close plumbing for the header dropdowns: click-toggled, closes on
 * outside click. Hover-only menus are unreliable on touch laptops and
 * unreachable by keyboard.
 */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return { open, setOpen, ref };
}

function DropdownButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex items-center gap-1 transition hover:text-rust"
    >
      {label}
      <svg
        viewBox="0 0 20 20"
        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        aria-hidden
      >
        <path
          d="M5.5 7.5l4.5 4.5 4.5-4.5"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** The educational content — the reason a stranger lands on this site at all. */
function LearnMenu() {
  const t = useTranslations("Nav");
  const tHatches = useTranslations("Hatches");
  const locale = useLocale();
  const { open, setOpen, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <DropdownButton label={t("learn")} open={open} onClick={() => setOpen((o) => !o)} />
      {open && (
        // max-h + scroll rather than nested collapsible groups: a dozen
        // insect links across four groups (headed toward 38) can already run
        // taller than a short laptop window, and a second layer of expand/
        // collapse inside a dropdown that's already click-to-open is more
        // friction than it's worth — scrolling is the standard pattern for a
        // long menu like this one.
        <div className="absolute left-0 top-full z-50 mt-2 max-h-[75vh] w-72 overflow-y-auto rounded-xl border border-forest/15 bg-parchment p-5 shadow-lg">
          <Link
            href="/hatches"
            onClick={() => setOpen(false)}
            className="block font-display text-sm font-semibold text-rust hover:text-rust-dark"
          >
            {t("hatchChart")} &rarr;
          </Link>
          <p className="mt-1 text-xs text-ink/55">{t("hatchChartHint")}</p>

          {/* Grouped by insect order rather than one flat list — worth doing
              now that the guides actually span more than one group. */}
          {HATCH_GROUPS.map((group) => {
            const inGroup = HATCHES.filter(
              (h) => h.group === group && ARTICLE_IDS.has(h.id)
            );
            if (inGroup.length === 0) return null;
            return (
              <div key={group} className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {tHatches(HATCH_GROUP_KEY[group])}
                </p>
                <ul className="mt-2.5 space-y-2 text-sm">
                  {inGroup.map((hatch) => (
                    <li key={hatch.id}>
                      <Link
                        href={`/hatches/${hatch.id}`}
                        onClick={() => setOpen(false)}
                        className="text-forest hover:text-rust"
                      >
                        {locale === "fr" ? hatch.nameFr : hatch.nameEn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="mt-4 border-t border-forest/10 pt-3">
            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-forest hover:text-rust"
            >
              {t("faq")} &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** Conditions and community: what's happening out there right now. */
function OnWaterMenu() {
  const t = useTranslations("Nav");
  const { open, setOpen, ref } = useDropdown();

  const links = [
    { href: "/reports", label: t("reports") },
    { href: "/reports/submit", label: t("submitReport") },
    { href: "/catches", label: t("catches") },
    { href: "/shop/water", label: t("waters") },
  ];

  return (
    <div ref={ref} className="relative">
      <DropdownButton
        label={t("onTheWater")}
        open={open}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-60 rounded-xl border border-forest/15 bg-parchment p-5 shadow-lg">
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-forest hover:text-rust"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
