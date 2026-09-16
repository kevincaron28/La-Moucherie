"use client";

import { useState } from "react";
import { StarRating } from "@/components/StarRating";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";

type PendingReview = {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  product: {
    id: string;
    slug: string;
    nameFr: string;
    nameEn: string;
  };
};

type LowStockVariant = {
  id: string;
  sku: string;
  nameFr: string;
  nameEn: string;
  stock: number;
  product: {
    slug: string;
    nameFr: string;
    nameEn: string;
  };
};

type RecentOrder = {
  id: string;
  customerName: string;
  email: string;
  amountTotalCents: number;
  currency: string;
  status: string;
  shippingMethod: string;
  createdAt: string;
  itemCount: number;
};

type RecentReport = {
  id: string;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  conditionsFr: string;
  conditionsEn: string;
};

type NewsletterCampaign = {
  id: string;
  subjectFr: string;
  subjectEn: string;
  recipientCount: number;
  sentAt: string;
};

export function AdminDashboardClient({
  pendingReviews: initialReviews,
  lowStockVariants,
  recentOrders,
  subscriberCount,
  recentReports,
  recentCampaigns: initialCampaigns,
  locale,
}: {
  pendingReviews: PendingReview[];
  lowStockVariants: LowStockVariant[];
  recentOrders: RecentOrder[];
  subscriberCount: number;
  recentReports: RecentReport[];
  recentCampaigns: NewsletterCampaign[];
  locale: string;
}) {
  const [reviews, setReviews] = useState<PendingReview[]>(initialReviews);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [campaign, setCampaign] = useState({
    subjectFr: "",
    subjectEn: "",
    bodyFr: "",
    bodyEn: "",
  });
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>(initialCampaigns);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  function prefillFromReport(r: RecentReport) {
    setCampaign({
      subjectFr: r.titleFr,
      subjectEn: r.titleEn,
      bodyFr: `<h2>${r.titleFr}</h2><p><strong>Conditions :</strong> ${r.conditionsFr}</p><p>${r.bodyFr}</p>`,
      bodyEn: `<h2>${r.titleEn}</h2><p><strong>Conditions:</strong> ${r.conditionsEn}</p><p>${r.bodyEn}</p>`,
    });
    setSendResult(null);
  }

  async function handleSendCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCampaigns((prev) => [data.campaign, ...prev]);
      setCampaign({ subjectFr: "", subjectEn: "", bodyFr: "", bodyEn: "" });
      setSendResult(
        locale === "fr"
          ? `Envoyé à ${data.campaign.recipientCount} abonné${data.campaign.recipientCount > 1 ? "s" : ""}.`
          : `Sent to ${data.campaign.recipientCount} subscriber${data.campaign.recipientCount > 1 ? "s" : ""}.`
      );
    } catch {
      setSendResult(
        locale === "fr" ? "Erreur lors de l'envoi." : "Something went wrong sending it."
      );
    } finally {
      setSending(false);
    }
  }

  async function handleModeration(reviewId: string, status: "APPROVED" | "REJECTED") {
    setProcessingId(reviewId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert("Erreur lors de la modération de l'avis.");
      }
    } catch {
      alert("Erreur de connexion.");
    } finally {
      setProcessingId(null);
    }
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-12">
      {/* 1. Pending Reviews */}
      <section>
        <div className="flex items-center justify-between border-b border-forest/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              {locale === "fr" ? "Avis en attente de modération" : "Pending Reviews"}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              {locale === "fr"
                ? "Les avis approuvés apparaissent immédiatement sur la fiche produit."
                : "Approved reviews appear publicly on the product page immediately."}
            </p>
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {reviews.length}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr"
              ? "Aucun avis en attente pour le moment."
              : "No pending reviews at the moment."}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-forest/15 bg-parchment p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} size="sm" />
                      <span className="font-semibold text-forest">
                        {locale === "fr" ? r.product.nameFr : r.product.nameEn}
                      </span>
                      <span className="text-xs text-ink/40">·</span>
                      <span className="text-xs text-ink/50">
                        {dateFormatter.format(new Date(r.createdAt))}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-semibold text-forest">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink/80">{r.body}</p>
                    <p className="mt-2 text-xs text-ink/50">
                      Par <span className="font-medium text-ink/70">{r.customerName}</span> ({r.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processingId === r.id}
                      onClick={() => handleModeration(r.id, "APPROVED")}
                      className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition hover:bg-forest/90 disabled:opacity-50"
                    >
                      {locale === "fr" ? "Approuver" : "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={processingId === r.id}
                      onClick={() => handleModeration(r.id, "REJECTED")}
                      className="rounded-full border border-rust/40 px-4 py-2 text-xs font-semibold text-rust transition hover:bg-rust/10 disabled:opacity-50"
                    >
                      {locale === "fr" ? "Rejeter" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Low Stock Alerts */}
      <section>
        <div className="flex items-center justify-between border-b border-forest/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              {locale === "fr" ? "Alertes stock faible (≤ 3)" : "Low Stock Alerts (≤ 3)"}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              {locale === "fr"
                ? "Tailles d'hameçons à remonter à l'étau rapidement."
                : "Hook sizes and flies that need bench time soon."}
            </p>
          </div>
          <span className="rounded-full bg-rust/10 px-3 py-1 font-mono text-xs font-semibold text-rust">
            {lowStockVariants.length}
          </span>
        </div>

        {lowStockVariants.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr"
              ? "Tous les stocks sont confortables."
              : "All inventory levels are healthy."}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-forest/15 bg-parchment">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest/10 bg-cream/60 text-xs font-semibold text-forest">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Patron</th>
                  <th className="p-3">Taille / Variante</th>
                  <th className="p-3 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {lowStockVariants.map((v) => (
                  <tr key={v.id} className="hover:bg-cream/20">
                    <td className="p-3 font-mono text-xs text-ink/60">{v.sku}</td>
                    <td className="p-3 font-semibold text-forest">
                      <Link href={`/shop/${v.product.slug}`} className="hover:text-rust">
                        {locale === "fr" ? v.product.nameFr : v.product.nameEn}
                      </Link>
                    </td>
                    <td className="p-3 text-ink/70">
                      {locale === "fr" ? v.nameFr : v.nameEn}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold">
                      <span className={v.stock === 0 ? "text-rust font-bold" : "text-amber-700"}>
                        {v.stock === 0 ? (locale === "fr" ? "Épuisé (0)" : "Out of stock (0)") : v.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. Recent Paid Orders & Bench Print Slips */}
      <section>
        <div className="flex items-center justify-between border-b border-forest/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              {locale === "fr" ? "Commandes récentes & Fiches d'étau" : "Recent Orders & Bench Slips"}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              {locale === "fr"
                ? "Imprimez la fiche d'étau prête à cocher pour préparer vos commandes."
                : "Print bench tying checklists to fulfill your orders at the vise."}
            </p>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr" ? "Aucune commande pour le moment." : "No orders yet."}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-forest/15 bg-parchment">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest/10 bg-cream/60 text-xs font-semibold text-forest">
                <tr>
                  <th className="p-3">Commande</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Articles</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Fiche d&apos;étau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/20">
                    <td className="p-3 font-mono text-xs text-forest">{o.id}</td>
                    <td className="p-3 font-medium text-ink/80">
                      {o.customerName}
                      <span className="block text-xs font-normal text-ink/50">{o.email}</span>
                    </td>
                    <td className="p-3 text-ink/70">{o.itemCount}</td>
                    <td className="p-3 font-mono text-forest">
                      {formatPrice(o.amountTotalCents, locale, o.currency)}
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/orders/${o.id}/print`}
                        className="inline-block rounded-full border border-forest/30 px-3 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-cream"
                      >
                        📄 {locale === "fr" ? "Imprimer" : "Print"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Newsletter */}
      <section>
        <div className="flex items-center justify-between border-b border-forest/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              {locale === "fr" ? "Infolettre" : "Newsletter"}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              {locale === "fr"
                ? "Rapports de pêche, nouveaux patrons ou promotions — envoyés à tous les abonnés actifs."
                : "Fishing reports, new patterns, or sales — sent to every active subscriber."}
            </p>
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {subscriberCount} {locale === "fr" ? "abonnés" : "subscribers"}
          </span>
        </div>

        {recentReports.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {locale === "fr" ? "Pré-remplir depuis un rapport" : "Prefill from a report"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recentReports.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => prefillFromReport(r)}
                  className="rounded-full border border-forest/25 px-3 py-1.5 text-xs font-medium text-forest transition hover:border-forest/50 hover:bg-forest/5"
                >
                  {locale === "fr" ? r.titleFr : r.titleEn}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendCampaign}
          className="mt-6 space-y-4 rounded-2xl border border-forest/15 bg-parchment p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                {locale === "fr" ? "Sujet (FR)" : "Subject (FR)"}
              </label>
              <input
                type="text"
                required
                value={campaign.subjectFr}
                onChange={(e) => setCampaign((c) => ({ ...c, subjectFr: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                {locale === "fr" ? "Sujet (EN)" : "Subject (EN)"}
              </label>
              <input
                type="text"
                required
                value={campaign.subjectEn}
                onChange={(e) => setCampaign((c) => ({ ...c, subjectEn: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                {locale === "fr" ? "Contenu (FR, HTML)" : "Body (FR, HTML)"}
              </label>
              <textarea
                required
                rows={8}
                value={campaign.bodyFr}
                onChange={(e) => setCampaign((c) => ({ ...c, bodyFr: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-cream/40 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                {locale === "fr" ? "Contenu (EN, HTML)" : "Body (EN, HTML)"}
              </label>
              <textarea
                required
                rows={8}
                value={campaign.bodyEn}
                onChange={(e) => setCampaign((c) => ({ ...c, bodyEn: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-cream/40 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-halo"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={sending || subscriberCount === 0}
              className="rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending
                ? locale === "fr"
                  ? "Envoi en cours…"
                  : "Sending…"
                : locale === "fr"
                  ? `Envoyer à ${subscriberCount} abonné${subscriberCount > 1 ? "s" : ""}`
                  : `Send to ${subscriberCount} subscriber${subscriberCount > 1 ? "s" : ""}`}
            </button>
            {sendResult && <p className="text-sm text-forest">{sendResult}</p>}
          </div>
        </form>

        {campaigns.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {locale === "fr" ? "Campagnes envoyées" : "Sent campaigns"}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
              {campaigns.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <span>{locale === "fr" ? c.subjectFr : c.subjectEn}</span>
                  <span className="shrink-0 text-xs text-ink/50">
                    {c.recipientCount} · {dateFormatter.format(new Date(c.sentAt))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 5. Quick Operational Links */}
      <section className="rounded-2xl border border-forest/15 bg-cream/30 p-6">
        <h3 className="font-display text-lg font-semibold text-forest">
          {locale === "fr" ? "Diagnostics & Outils" : "Diagnostics & Tools"}
        </h3>
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href="/api/admin/canada-post-check"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-parchment px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:bg-forest/10"
          >
            📦 {locale === "fr" ? "Vérifier l'API Postes Canada" : "Check Canada Post API"} &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
