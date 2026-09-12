"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("Account");
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setStatus("error");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">{t("loginTitle")}</h1>
      <p className="mt-2 text-ink/70">{t("loginSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-forest">{t("email")}</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest">{t("password")}</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
          />
        </div>

        {status === "error" && <p className="text-sm text-rust">{t("invalidCredentials")}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t("signingIn") : t("signIn")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        {t("noAccount")}{" "}
        <Link href="/account/register" className="font-medium text-rust hover:text-rust-dark">
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
