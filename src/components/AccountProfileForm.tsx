"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PROVINCES } from "@/lib/shipping";

type ProfileData = {
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

export function AccountProfileForm({ initial }: { initial: ProfileData }) {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-medium text-forest">{t("addressLine1")}</label>
        <input
          type="text"
          value={form.shippingLine1}
          onChange={(e) => update("shippingLine1", e.target.value)}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-forest">{t("addressLine2")}</label>
        <input
          type="text"
          value={form.shippingLine2}
          onChange={(e) => update("shippingLine2", e.target.value)}
          className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-forest">{t("city")}</label>
          <input
            type="text"
            value={form.shippingCity}
            onChange={(e) => update("shippingCity", e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest">{t("province")}</label>
          <select
            value={form.shippingProvince}
            onChange={(e) => update("shippingProvince", e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest"
          >
            <option value="">—</option>
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {locale === "fr" ? p.nameFr : p.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-forest">{t("postalCode")}</label>
          <input
            type="text"
            value={form.shippingPostalCode}
            onChange={(e) => update("shippingPostalCode", e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest">{t("country")}</label>
          <select
            value={form.shippingCountry}
            onChange={(e) => update("shippingCountry", e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
          >
            <option value="CA">Canada</option>
            <option value="US">United States</option>
          </select>
        </div>
      </div>

      {status === "saved" && <p className="text-sm font-medium text-forest">{t("infoSaved")}</p>}
      {status === "error" && <p className="text-sm text-rust">{t("errorGeneric")}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? t("saving") : t("saveInfo")}
      </button>
    </form>
  );
}
