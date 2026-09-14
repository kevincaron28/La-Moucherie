"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
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
          <Link href="/shop" className="transition hover:text-rust">
            {t("shop")}
          </Link>
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
