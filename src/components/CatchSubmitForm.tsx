"use client";

import { useState } from "react";
import { SPECIES } from "@/lib/angling";
import { instagramImageUrl } from "@/lib/instagram";

type WaterOption = { id: string; name: string };
type ProductOption = { id: string; slug: string; name: string };

type Props = {
  waters: WaterOption[];
  products: ProductOption[];
  /** Copy is passed in so the whole form stays one client component, same
   * approach as HatchReportForm. */
  t: Record<string, string>;
};

const FIELD =
  "w-full rounded-lg border border-forest/20 bg-white px-3 py-2.5 text-sm text-ink " +
  "focus:border-forest/50 focus:outline-none focus:ring-1 focus:ring-forest/30";
const LABEL = "block text-xs font-semibold uppercase tracking-wide text-ink/50";

export function CatchSubmitForm({ waters, products, t }: Props) {
  const [instagramUrl, setInstagramUrl] = useState("");
  const [species, setSpecies] = useState("");
  const [waterId, setWaterId] = useState("");
  const [productId, setProductId] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");

  const [fetchedUsername, setFetchedUsername] = useState<string | null>(null);
  const [fetchedCaption, setFetchedCaption] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const previewUrl = instagramImageUrl(instagramUrl) || "";

  async function handleFetchInfo() {
    if (!instagramUrl) return;
    setFetching(true);
    setFetchError(false);
    try {
      const res = await fetch(
        `/api/catches/instagram-info?url=${encodeURIComponent(instagramUrl)}`
      );
      const info = res.ok ? await res.json() : { username: null, caption: null };
      if (!info.username && !info.caption) {
        setFetchError(true);
        return;
      }
      setFetchedUsername(info.username);
      setFetchedCaption(info.caption);
    } catch {
      setFetchError(true);
    } finally {
      setFetching(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const payload: Record<string, unknown> = { instagramUrl };
    if (species) payload.species = species;
    if (waterId) payload.waterId = waterId;
    if (productId) payload.productId = productId;
    if (sizeLabel.trim()) payload.sizeLabel = sizeLabel.trim();

    try {
      const res = await fetch("/api/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          body.error === "rate_limited"
            ? t.errorRate
            : body.error === "unsupported_url"
              ? t.unsupportedUrl
              : t.errorGeneric
        );
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="instagramUrl" className={LABEL}>
          {t.instagramUrlLabel} *
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="instagramUrl"
            type="url"
            required
            value={instagramUrl}
            onChange={(e) => {
              setInstagramUrl(e.target.value);
              setFetchedUsername(null);
              setFetchedCaption(null);
              setFetchError(false);
            }}
            placeholder={t.instagramUrlPlaceholder}
            className={`${FIELD} flex-1`}
          />
          <button
            type="button"
            disabled={!instagramUrl || fetching}
            onClick={handleFetchInfo}
            className="rounded-lg border border-forest/25 px-4 py-2.5 text-sm font-semibold text-forest transition hover:border-forest/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {fetching ? t.fetching : t.fetchButton}
          </button>
        </div>
        {fetchError && <p className="mt-2 text-sm text-rust">{t.fetchError}</p>}
      </div>

      {previewUrl && (
        <div className="flex gap-4 rounded-xl border border-forest/10 bg-cream/40 p-4">
          {/* Live preview only -- what the shop actually stores is derived
              server-side from the same URL on submit. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="h-24 w-24 shrink-0 rounded-lg bg-cream object-cover"
          />
          <div className="min-w-0 text-sm text-ink/70">
            {fetchedUsername && <p className="font-medium text-forest">@{fetchedUsername}</p>}
            {fetchedCaption && <p className="mt-1 line-clamp-3">{fetchedCaption}</p>}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="species" className={LABEL}>
            {t.species}
          </label>
          <select
            id="species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.chooseOptional}</option>
            {SPECIES.map((s) => (
              <option key={s} value={s}>
                {t[`species${s}`] ?? s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sizeLabel" className={LABEL}>
            {t.sizeLabel}
          </label>
          <input
            id="sizeLabel"
            type="text"
            value={sizeLabel}
            onChange={(e) => setSizeLabel(e.target.value)}
            placeholder={t.sizeLabelPlaceholder}
            maxLength={50}
            className={`mt-2 ${FIELD}`}
          />
        </div>

        <div>
          <label htmlFor="water" className={LABEL}>
            {t.water}
          </label>
          <select
            id="water"
            value={waterId}
            onChange={(e) => setWaterId(e.target.value)}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.chooseOptional}</option>
            {waters.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product" className={LABEL}>
            {t.product}
          </label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">{t.chooseOptional}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
