"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { CATEGORY_ORDER } from "@/lib/localize";
import { SPECIES, SPECIES_SLUGS } from "@/lib/angling";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SearchBox } from "./SearchBox";

export function Header() {
  const t = useTranslations("Nav");
  const { itemCount } = useCart();
  const { status } = useSession();

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
          <Link href="/reports" className="transition hover:text-rust">
            {t("reports")}
          </Link>
          <Link href="/catches" className="transition hover:text-rust">
            {t("catches")}
          </Link>
          <Link href="/about" className="transition hover:text-rust">
            {t("about")}
          </Link>
          <Link href="/contact" className="transition hover:text-rust">
            {t("contact")}
          </Link>
        </nav>

        <SearchBox className="hidden max-w-[16rem] flex-1 lg:block" />

        <div className="flex items-center gap-4">
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
        </div>
      </div>
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-forest/10 px-4 py-2 text-sm font-medium text-forest md:hidden">
        <Link href="/shop">{t("shop")}</Link>
        <Link href="/reports">{t("reports")}</Link>
        <Link href="/catches">{t("catches")}</Link>
        <Link href="/about">{t("about")}</Link>
        <Link href="/contact">{t("contact")}</Link>
        <Link
          href={status === "authenticated" ? "/account" : "/account/login"}
          className="sm:hidden"
        >
          {status === "authenticated" ? t("account") : t("signIn")}
        </Link>
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
