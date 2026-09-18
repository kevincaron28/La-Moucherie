"use client";

import { useMemo, useState } from "react";
import { HATCHES, HATCH_GROUPS, sizeLabel } from "@/lib/hatches";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/temperature";
import type { Locale } from "@/i18n/routing";

type WaterOption = { id: string; name: string };
type ProductOption = { id: string; slug: string; name: string };

type Props = {
  locale: Locale;
  waters: WaterOption[];
  products: ProductOption[];
  /** Signed-in reporter, fetched server-side. When set, the form skips
   * asking for a name/email — the API derives both from the session — and
   * files the report against the account. */
  user: { name: string; email: string } | null;
  /** Copy is passed in so the whole form stays one client component. */
  t: Record<string, string>;
};

const OTHER = "__other__";

const FIELD =
  "w-full rounded-lg border border-forest/20 bg-white px-3 py-2.5 text-sm text-ink " +
  "focus:border-forest/50 focus:outline-none focus:ring-1 focus:ring-forest/30";
const LABEL = "block text-xs font-semibold uppercase tracking-wide text-ink/50";

/** A row of radio-style buttons — one tap, no dropdown to open. */
function Choice({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset>
      <legend className={LABEL}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? "" : o.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/25 bg-white text-forest hover:border-forest/50"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <input type="hidden" name={name} value={value} />
    </fieldset>
  );
}

export function HatchReportForm({ locale, waters, products, user, t }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const [anglerName, setAnglerName] = useState("");
  const [email, setEmail] = useState("");
  const [waterId, setWaterId] = useState("");
  const [waterOther, setWaterOther] = useState("");
  const [observedOn, setObservedOn] = useState(today);
  const [hatchId, setHatchId] = useState("");
  const [hookSize, setHookSize] = useState("");
  const [species, setSpecies] = useState("");
  const [intensity, setIntensity] = useState("");
  const [waterLevel, setWaterLevel] = useState("");
  const [waterClarity, setWaterClarity] = useState("");
  const [sky, setSky] = useState("");
  // Kept in whichever unit the angler is currently entering it in, and
  // converted to Celsius only at submit time -- so switching units mid-entry
  // doesn't require guessing at a shared internal representation.
  const [waterTemp, setWaterTemp] = useState("");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [productId, setProductId] = useState("");
  const [note, setNote] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const hatch = useMemo(() => HATCHES.find((h) => h.id === hatchId), [hatchId]);

  // Re-expresses whatever's already typed in the new unit, so toggling
  // doesn't blank the field or leave a stale number behind.
  function switchTempUnit(next: "C" | "F") {
    if (next === tempUnit) return;
    const n = Number(waterTemp);
    if (waterTemp.trim() !== "" && !Number.isNaN(n)) {
      const converted = tempUnit === "C" ? celsiusToFahrenheit(n) : fahrenheitToCelsius(n);
      setWaterTemp(String(Math.round(converted * 10) / 10));
    }
    setTempUnit(next);
  }

  // Hook sizes and suggested flies both come from the chosen insect, so the
  // two hardest questions on the form answer themselves once it's picked.
  const sizeOptions = hatch?.sizes ?? [];
  const suggestedProducts = useMemo(() => {
    if (!hatch) return products;
    const wanted = new Set(hatch.patternSlugs);
    const matching = products.filter((p) => wanted.has(p.slug));
    return matching.length > 0 ? matching : products;
  }, [hatch, products]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const payload: Record<string, unknown> = {
      locale,
      observedOn,
      newsletterOptIn: optIn,
      website,
    };
    // Signed-in identity comes from the session on the server, not from
    // anything typed here -- the fields below don't even render when `user`
    // is set.
    if (!user) {
      payload.anglerName = anglerName;
      payload.email = email;
    }
    if (waterId && waterId !== OTHER) payload.waterId = waterId;
    if (waterId === OTHER && waterOther.trim()) payload.waterOther = waterOther.trim();
    if (hatchId) payload.hatchId = hatchId;
    if (hookSize) payload.hookSize = Number(hookSize);
    if (species) payload.species = species;
    if (intensity) payload.intensity = intensity;
    if (waterLevel) payload.waterLevel = waterLevel;
    if (waterClarity) payload.waterClarity = waterClarity;
    if (sky) payload.sky = sky;
    if (waterTemp.trim()) {
      const n = Number(waterTemp);
      if (!Number.isNaN(n)) {
        const celsius = tempUnit === "F" ? fahrenheitToCelsius(n) : n;
        payload.waterTempC = Math.round(celsius * 10) / 10;
      }
    }
    if (productId) payload.productId = productId;
    if (note.trim()) payload.note = note.trim();

    try {
      const res = await fetch("/api/hatch-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === "rate_limited" ? t.errorRate : t.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError(t.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-forest/20 bg-cream/50 p-8 text-center">
        <p className="font-display text-xl font-semibold text-forest">{t.thanksTitle}</p>
        <p className="mt-2 text-sm text-ink/70">{t.thanksBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Where and when — the only genuinely required part. */}
      <div className="space-y-4">
        <div>
          <label htmlFor="water" className={LABEL}>
            {t.water} *
          </label>
          <select
            id="water"
            value={waterId}
            onChange={(e) => setWaterId(e.target.value)}
            required
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.choose}</option>
            {waters.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
            <option value={OTHER}>{t.waterOther}</option>
          </select>
          {waterId === OTHER && (
            <input
              type="text"
              value={waterOther}
              onChange={(e) => setWaterOther(e.target.value)}
              placeholder={t.waterOtherPlaceholder}
              required
              maxLength={120}
              className={`mt-2 ${FIELD}`}
            />
          )}
        </div>

        <div>
          <label htmlFor="observedOn" className={LABEL}>
            {t.date} *
          </label>
          <input
            id="observedOn"
            type="date"
            value={observedOn}
            max={today}
            onChange={(e) => setObservedOn(e.target.value)}
            required
            className={`mt-2 ${FIELD}`}
          />
        </div>
      </div>

      {/* What was hatching. */}
      <div className="space-y-4 border-t border-forest/10 pt-6">
        <div>
          <label htmlFor="hatch" className={LABEL}>
            {t.insect}
          </label>
          <select
            id="hatch"
            value={hatchId}
            onChange={(e) => {
              setHatchId(e.target.value);
              setHookSize("");
              setProductId("");
            }}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.chooseOptional}</option>
            {HATCH_GROUPS.map((group) => {
              const rows = HATCHES.filter((h) => h.group === group);
              if (rows.length === 0) return null;
              return (
                <optgroup key={group} label={t[`group${group}`] ?? group}>
                  {rows.map((h) => (
                    <option key={h.id} value={h.id}>
                      {locale === "fr" ? h.nameFr : h.nameEn} · {sizeLabel(h.sizes)}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {sizeOptions.length > 0 && (
          <Choice
            label={t.hookSize}
            name="hookSize"
            value={hookSize}
            onChange={setHookSize}
            options={sizeOptions.map((s) => ({ value: String(s), label: `#${s}` }))}
          />
        )}

        <Choice
          label={t.intensity}
          name="intensity"
          value={intensity}
          onChange={setIntensity}
          options={[
            { value: "NONE", label: t.intensityNONE },
            { value: "SPARSE", label: t.intensitySPARSE },
            { value: "STEADY", label: t.intensitySTEADY },
            { value: "HEAVY", label: t.intensityHEAVY },
          ]}
        />
      </div>

      {/* Conditions. */}
      <div className="space-y-4 border-t border-forest/10 pt-6">
        <Choice
          label={t.waterLevel}
          name="waterLevel"
          value={waterLevel}
          onChange={setWaterLevel}
          options={[
            { value: "LOW", label: t.waterLevelLOW },
            { value: "NORMAL", label: t.waterLevelNORMAL },
            { value: "HIGH", label: t.waterLevelHIGH },
          ]}
        />
        <Choice
          label={t.waterClarity}
          name="waterClarity"
          value={waterClarity}
          onChange={setWaterClarity}
          options={[
            { value: "CLEAR", label: t.waterClarityCLEAR },
            { value: "STAINED", label: t.waterClaritySTAINED },
            { value: "MUDDY", label: t.waterClarityMUDDY },
          ]}
        />
        <Choice
          label={t.sky}
          name="sky"
          value={sky}
          onChange={setSky}
          options={[
            { value: "SUNNY", label: t.skySUNNY },
            { value: "PARTLY_CLOUDY", label: t.skyPARTLY_CLOUDY },
            { value: "OVERCAST", label: t.skyOVERCAST },
            { value: "RAIN", label: t.skyRAIN },
          ]}
        />
        <div>
          <label htmlFor="temp" className={LABEL}>
            {t.waterTemp}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="temp"
              type="number"
              inputMode="decimal"
              step={tempUnit === "C" ? 0.5 : 1}
              min={tempUnit === "C" ? -2 : 28}
              max={tempUnit === "C" ? 35 : 95}
              value={waterTemp}
              onChange={(e) => setWaterTemp(e.target.value)}
              placeholder={tempUnit === "C" ? "14" : "57"}
              className={`${FIELD} max-w-28`}
            />
            <div className="flex rounded-lg border border-forest/20 text-xs font-semibold">
              {(["C", "F"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={tempUnit === u}
                  onClick={() => switchTempUnit(u)}
                  className={`px-2.5 py-2 transition first:rounded-l-lg last:rounded-r-lg ${
                    tempUnit === u
                      ? "bg-forest text-cream"
                      : "bg-white text-forest hover:bg-forest/5"
                  }`}
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What worked. */}
      <div className="space-y-4 border-t border-forest/10 pt-6">
        <Choice
          label={t.species}
          name="species"
          value={species}
          onChange={setSpecies}
          options={[
            { value: "BROOK_TROUT", label: t.speciesBROOK_TROUT },
            { value: "BROWN_TROUT", label: t.speciesBROWN_TROUT },
            { value: "RAINBOW_TROUT", label: t.speciesRAINBOW_TROUT },
            { value: "LANDLOCKED_SALMON", label: t.speciesLANDLOCKED_SALMON },
            { value: "ATLANTIC_SALMON", label: t.speciesATLANTIC_SALMON },
            { value: "SMALLMOUTH_BASS", label: t.speciesSMALLMOUTH_BASS },
            { value: "LARGEMOUTH_BASS", label: t.speciesLARGEMOUTH_BASS },
            { value: "NORTHERN_PIKE", label: t.speciesNORTHERN_PIKE },
            { value: "WALLEYE", label: t.speciesWALLEYE },
          ]}
        />
        <div>
          <label htmlFor="product" className={LABEL}>
            {t.flyUsed}
          </label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.chooseOptional}</option>
            {suggestedProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="note" className={LABEL}>
            {t.note}
          </label>
          <input
            id="note"
            type="text"
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notePlaceholder}
            className={`mt-2 ${FIELD}`}
          />
        </div>
      </div>

      {/* Who. */}
      <div className="space-y-4 border-t border-forest/10 pt-6">
        {user ? (
          <p className="text-sm text-ink/70">
            {t.filingAs.replace("{name}", user.name)}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={LABEL}>
                {t.name} *
              </label>
              <input
                id="name"
                type="text"
                value={anglerName}
                onChange={(e) => setAnglerName(e.target.value)}
                required
                maxLength={120}
                className={`mt-2 ${FIELD}`}
              />
            </div>
            <div>
              <label htmlFor="email" className={LABEL}>
                {t.email} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={200}
                className={`mt-2 ${FIELD}`}
              />
              <p className="mt-1 text-xs text-ink/50">{t.emailNote}</p>
            </div>
          </div>
        )}

        {/* CASL: separate, unticked, and about marketing only — filing a report
            is never itself consent to be emailed. */}
        <label className="flex items-start gap-3 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-forest/30"
          />
          <span>{t.optIn}</span>
        </label>

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p className="text-xs text-ink/50">{t.moderationNote}</p>
      </div>
    </form>
  );
}
