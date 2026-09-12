"use client";

import { signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";

export function SignOutButton() {
  const t = useTranslations("Account");
  const locale = useLocale();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className="text-sm font-medium text-rust hover:text-rust-dark"
    >
      {t("signOut")}
    </button>
  );
}
