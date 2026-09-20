"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StarRating } from "@/components/StarRating";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { chipClass } from "@/lib/chip";
import { instagramImageUrl } from "@/lib/instagram";
import { formatDualTemp } from "@/lib/temperature";
import { HATCHES } from "@/lib/hatches";

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

type NewsletterCampaign = {
  id: string;
  subjectFr: string;
  subjectEn: string;
  recipientCount: number;
  sentAt: string;
};

type NoVariantProduct = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
};

type PlannedFly = {
  id: string;
  nameFr: string;
  nameEn: string;
  category: string;
  species: string[];
  notes: string | null;
};

type WaterRef = { slug: string; nameFr: string; nameEn: string };
type WaterOption = { id: string; slug: string; nameFr: string; nameEn: string };
type ProductOption = { id: string; slug: string; nameFr: string; nameEn: string };

type AdminCatch = {
  id: string;
  anglerName: string | null;
  imageUrl: string;
  instagramUrl: string | null;
  captionFr: string | null;
  captionEn: string | null;
  species: string | null;
  sizeLabel: string | null;
  conditionsFr: string | null;
  conditionsEn: string | null;
  approved: boolean;
  /** The submitting account's name, when this came in through
   * /catches/submit rather than being posted by the shop. */
  submittedByName: string | null;
  water: WaterRef | null;
  product: WaterRef | null;
};

type AdminHatchReport = {
  id: string;
  anglerName: string;
  email: string;
  observedOn: string;
  waterName: string | null;
  hatchId: string | null;
  hookSize: number | null;
  intensity: string | null;
  species: string | null;
  waterLevel: string | null;
  waterClarity: string | null;
  sky: string | null;
  waterTempC: number | null;
  note: string | null;
  approved: boolean;
  fromShop: boolean;
  productName: string | null;
};

const emptyCatchForm = {
  anglerName: "",
  imageUrl: "",
  instagramUrl: "",
  captionFr: "",
  captionEn: "",
  species: "",
  waterId: "",
  productId: "",
  sizeLabel: "",
  conditionsFr: "",
  conditionsEn: "",
  approved: true,
};

const PLANNED_CATEGORY_OPTIONS = [
  { value: "DRY_FLY", fr: "Mouche sèche", en: "Dry Fly" },
  { value: "NYMPH", fr: "Nymphe", en: "Nymph" },
  { value: "STREAMER", fr: "Streamer", en: "Streamer" },
  { value: "WET_FLY", fr: "Mouche noyée", en: "Wet Fly" },
];

const PLANNED_SPECIES_OPTIONS = [
  { value: "BROOK_TROUT", fr: "Omble de fontaine", en: "Brook Trout" },
  { value: "BROWN_TROUT", fr: "Truite brune", en: "Brown Trout" },
  { value: "RAINBOW_TROUT", fr: "Truite arc-en-ciel", en: "Rainbow Trout" },
  { value: "LANDLOCKED_SALMON", fr: "Ouananiche", en: "Landlocked Salmon" },
  { value: "ATLANTIC_SALMON", fr: "Saumon atlantique", en: "Atlantic Salmon" },
  { value: "SMALLMOUTH_BASS", fr: "Achigan à petite bouche", en: "Smallmouth Bass" },
  { value: "LARGEMOUTH_BASS", fr: "Achigan à grande bouche", en: "Largemouth Bass" },
  { value: "NORTHERN_PIKE", fr: "Grand brochet", en: "Northern Pike" },
  { value: "WALLEYE", fr: "Doré jaune", en: "Walleye" },
  { value: "CARP", fr: "Carpe", en: "Carp" },
];

const emptyPlannedForm = {
  nameFr: "",
  nameEn: "",
  category: "NYMPH",
  species: [] as string[],
  notes: "",
};

const SECTION_NAV = [
  { id: "reviews", fr: "Avis", en: "Reviews" },
  { id: "hatch-reports", fr: "Rapports d'éclosion", en: "Hatch reports" },
  { id: "no-sizes", fr: "Sans tailles", en: "No sizes" },
  { id: "low-stock", fr: "Stock bas", en: "Low stock" },
  { id: "planned", fr: "Patrons à venir", en: "Planned patterns" },
  { id: "orders", fr: "Commandes", en: "Orders" },
  { id: "catches", fr: "Prises", en: "Catches" },
  { id: "newsletter", fr: "Infolettre", en: "Newsletter" },
  { id: "tools", fr: "Outils", en: "Tools" },
] as const;

export function AdminDashboardClient({
  pendingReviews: initialReviews,
  lowStockVariants,
  noVariantProducts,
  recentOrders,
  subscriberCount,
  recentCampaigns: initialCampaigns,
  plannedFlies: initialPlannedFlies,
  allCatches: initialAllCatches,
  hatchReports: initialHatchReports,
  waters,
  activeProducts,
  locale,
}: {
  pendingReviews: PendingReview[];
  lowStockVariants: LowStockVariant[];
  noVariantProducts: NoVariantProduct[];
  recentOrders: RecentOrder[];
  subscriberCount: number;
  recentCampaigns: NewsletterCampaign[];
  plannedFlies: PlannedFly[];
  allCatches: AdminCatch[];
  hatchReports: AdminHatchReport[];
  waters: WaterOption[];
  activeProducts: ProductOption[];
  locale: string;
}) {
  const tHatch = useTranslations("HatchReport");
  const tAngling = useTranslations("Angling");
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

  const [plannedFlies, setPlannedFlies] = useState<PlannedFly[]>(initialPlannedFlies);
  const [plannedForm, setPlannedForm] = useState(emptyPlannedForm);
  const [addingPlanned, setAddingPlanned] = useState(false);
  const [tyingId, setTyingId] = useState<string | null>(null);

  function togglePlannedSpecies(value: string) {
    setPlannedForm((f) => ({
      ...f,
      species: f.species.includes(value)
        ? f.species.filter((s) => s !== value)
        : [...f.species, value],
    }));
  }

  async function handleAddPlanned(e: React.FormEvent) {
    e.preventDefault();
    setAddingPlanned(true);
    try {
      const res = await fetch("/api/admin/planned-flies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plannedForm,
          notes: plannedForm.notes.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlannedFlies((prev) => [...prev, data.planned]);
        setPlannedForm(emptyPlannedForm);
      } else {
        alert(locale === "fr" ? "Erreur lors de l'ajout." : "Something went wrong adding it.");
      }
    } catch {
      alert(locale === "fr" ? "Erreur de connexion." : "Connection error.");
    } finally {
      setAddingPlanned(false);
    }
  }

  async function handleTied(id: string) {
    setTyingId(id);
    try {
      const res = await fetch(`/api/admin/planned-flies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlannedFlies((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setTyingId(null);
    }
  }

  const [catches, setCatches] = useState<AdminCatch[]>(initialAllCatches);
  const [hatchReports, setHatchReports] = useState<AdminHatchReport[]>(initialHatchReports);
  const [hatchBusyId, setHatchBusyId] = useState<string | null>(null);
  const [catchForm, setCatchForm] = useState(emptyCatchForm);
  const [addingCatch, setAddingCatch] = useState(false);
  const [catchBusyId, setCatchBusyId] = useState<string | null>(null);
  const [fetchingInstagram, setFetchingInstagram] = useState(false);
  const [instagramFetchError, setInstagramFetchError] = useState(false);
  const catchPreviewUrl =
    catchForm.imageUrl || instagramImageUrl(catchForm.instagramUrl) || "";

  // Only fills fields the admin hasn't already typed into -- never overwrites
  // an edit with whatever the post's own caption says. The same backfill
  // runs server-side on submit too, so skipping this button isn't a trap.
  async function handleFetchInstagramInfo() {
    if (!catchForm.instagramUrl) return;
    setFetchingInstagram(true);
    setInstagramFetchError(false);
    try {
      const res = await fetch(
        `/api/admin/instagram-info?url=${encodeURIComponent(catchForm.instagramUrl)}`
      );
      const info = res.ok ? await res.json() : { username: null, caption: null };
      if (!info.username && !info.caption) {
        setInstagramFetchError(true);
        return;
      }
      setCatchForm((f) => ({
        ...f,
        anglerName: f.anglerName || info.username || f.anglerName,
        captionFr: f.captionFr || info.caption || f.captionFr,
        captionEn: f.captionEn || info.caption || f.captionEn,
      }));
    } catch {
      setInstagramFetchError(true);
    } finally {
      setFetchingInstagram(false);
    }
  }

  async function handleAddCatch(e: React.FormEvent) {
    e.preventDefault();
    setAddingCatch(true);
    try {
      const res = await fetch("/api/admin/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...catchForm,
          imageUrl: catchForm.imageUrl || undefined,
          instagramUrl: catchForm.instagramUrl || undefined,
          captionFr: catchForm.captionFr || undefined,
          captionEn: catchForm.captionEn || undefined,
          species: catchForm.species || undefined,
          waterId: catchForm.waterId || undefined,
          productId: catchForm.productId || undefined,
          sizeLabel: catchForm.sizeLabel || undefined,
          conditionsFr: catchForm.conditionsFr || undefined,
          conditionsEn: catchForm.conditionsEn || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const water = waters.find((w) => w.id === catchForm.waterId) ?? null;
        const product = activeProducts.find((p) => p.id === catchForm.productId) ?? null;
        setCatches((prev) => [{ ...data.catchPhoto, water, product }, ...prev]);
        setCatchForm(emptyCatchForm);
      } else {
        alert(locale === "fr" ? "Erreur lors de l'ajout." : "Something went wrong adding it.");
      }
    } catch {
      alert(locale === "fr" ? "Erreur de connexion." : "Connection error.");
    } finally {
      setAddingCatch(false);
    }
  }

  async function handleToggleCatchApproved(c: AdminCatch) {
    setCatchBusyId(c.id);
    try {
      const res = await fetch(`/api/admin/catches/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !c.approved }),
      });
      if (res.ok) {
        setCatches((prev) =>
          prev.map((x) => (x.id === c.id ? { ...x, approved: !x.approved } : x))
        );
      }
    } finally {
      setCatchBusyId(null);
    }
  }

  async function handleDeleteCatch(id: string) {
    setCatchBusyId(id);
    try {
      const res = await fetch(`/api/admin/catches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCatches((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setCatchBusyId(null);
    }
  }

  async function handleToggleHatchReport(r: AdminHatchReport) {
    setHatchBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/hatch-reports/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !r.approved }),
      });
      if (res.ok) {
        setHatchReports((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, approved: !x.approved } : x))
        );
      }
    } finally {
      setHatchBusyId(null);
    }
  }

  async function handleDeleteHatchReport(id: string) {
    setHatchBusyId(id);
    try {
      const res = await fetch(`/api/admin/hatch-reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHatchReports((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setHatchBusyId(null);
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

  const attentionItems = [
    { id: "reviews", count: reviews.length, fr: "avis à modérer", en: "reviews to moderate" },
    {
      id: "hatch-reports",
      count: hatchReports.filter((r) => !r.approved).length,
      fr: "rapports d'éclosion à approuver",
      en: "hatch reports to approve",
    },
    { id: "no-sizes", count: noVariantProducts.length, fr: "produits sans tailles", en: "products with no sizes" },
    { id: "low-stock", count: lowStockVariants.length, fr: "tailles en stock bas", en: "low-stock sizes" },
  ].filter((item) => item.count > 0);

  return (
    <div className="space-y-12">
      {/* Dashboard overview: what needs a decision right now, plus a quick
          jump to every section below. This page runs to ten sections — the
          fastest way to find the newsletter composer without scrolling past
          nine others is a real nav, not muscle memory. */}
      {attentionItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-rust/30 bg-rust/5 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-rust">
            {locale === "fr" ? "À faire" : "Needs attention"}
          </span>
          {attentionItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={chipClass("accent")}>
              {item.count} {locale === "fr" ? item.fr : item.en}
            </a>
          ))}
        </div>
      )}

      <nav className="flex flex-wrap gap-x-4 gap-y-1.5 border-b border-forest/10 pb-6 text-xs font-medium text-ink/50">
        {SECTION_NAV.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="underline-offset-2 hover:text-rust hover:underline"
          >
            {locale === "fr" ? s.fr : s.en}
          </a>
        ))}
      </nav>

      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rust">
        {locale === "fr" ? "En attente d'une décision" : "Awaiting a decision"}
      </p>

      {/* 1. Pending Reviews */}
      <details id="reviews" className="group" open>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
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
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {reviews.length}
          </span>
        </summary>

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
      </details>

      {/* 2. Angler hatch reports — moderation queue */}
      <details
        id="hatch-reports"
        className="group rounded-2xl border border-forest/15 bg-cream/30 p-6"
        open
      >
        <summary className="cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-forest">
                  {locale === "fr" ? "Rapports d'éclosion" : "Hatch reports"}
                </h3>
                {hatchReports.some((r) => !r.approved) && (
                  <span className="rounded-full bg-rust px-3 py-1 text-xs font-semibold text-cream">
                    {hatchReports.filter((r) => !r.approved).length}{" "}
                    {locale === "fr" ? "en attente" : "waiting"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-ink/55">
                {locale === "fr"
                  ? "Rien n'apparaît sur /reports tant que ce n'est pas approuvé."
                  : "Nothing appears on /reports until it's approved."}
              </p>
            </div>
          </div>
        </summary>

        {hatchReports.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">
            {locale === "fr" ? "Aucun rapport pour l'instant." : "No reports yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {hatchReports.map((r) => {
              const hatch = HATCHES.find((h) => h.id === r.hatchId);
              const hatchName = hatch
                ? locale === "fr"
                  ? hatch.nameFr
                  : hatch.nameEn
                : null;
              return (
              <li
                key={r.id}
                className={`rounded-xl border p-4 ${
                  r.approved ? "border-forest/15 bg-parchment" : "border-rust/30 bg-rust/5"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-forest">
                    {r.waterName ??
                      (locale === "fr" ? "Plan d'eau non nommé" : "Unnamed water")}
                  </p>
                  <p className="text-xs text-ink/50">
                    {new Date(r.observedOn).toLocaleDateString(
                      locale === "fr" ? "fr-CA" : "en-CA",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </p>
                </div>

                <p className="mt-1 text-xs text-ink/60">
                  {[
                    hatchName,
                    r.hookSize ? `#${r.hookSize}` : null,
                    r.intensity ? tHatch(`intensity${r.intensity}`) : null,
                    r.species ? tAngling(`species.${r.species}`) : null,
                    r.productName,
                  ]
                    .filter(Boolean)
                    .join(" · ") || (locale === "fr" ? "Aucun détail" : "No details")}
                </p>

                {(r.waterLevel || r.waterClarity || r.sky || r.waterTempC != null) && (
                  <p className="mt-1 text-xs text-ink/45">
                    {[
                      r.waterLevel
                        ? `${tHatch("waterLevel")}: ${tHatch(`waterLevel${r.waterLevel}`)}`
                        : null,
                      r.waterClarity
                        ? `${tHatch("waterClarity")}: ${tHatch(`waterClarity${r.waterClarity}`)}`
                        : null,
                      r.sky ? `${tHatch("sky")}: ${tHatch(`sky${r.sky}`)}` : null,
                      r.waterTempC != null ? formatDualTemp(r.waterTempC) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}

                {r.note && <p className="mt-2 text-sm text-ink/80">{r.note}</p>}

                <p className="mt-2 text-xs text-ink/45">
                  {r.fromShop
                    ? locale === "fr"
                      ? "Notre propre rapport"
                      : "Our own report"
                    : `${r.anglerName} · ${r.email}`}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={hatchBusyId === r.id}
                    onClick={() => handleToggleHatchReport(r)}
                    className="rounded-full border border-forest/30 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest/10 disabled:opacity-50"
                  >
                    {r.approved
                      ? locale === "fr"
                        ? "Retirer du site"
                        : "Unpublish"
                      : locale === "fr"
                        ? "Approuver"
                        : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={hatchBusyId === r.id}
                    onClick={() => handleDeleteHatchReport(r.id)}
                    className="rounded-full border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust transition hover:bg-rust/10 disabled:opacity-50"
                  >
                    {locale === "fr" ? "Supprimer" : "Delete"}
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </details>

      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rust">
        {locale === "fr" ? "Alertes de stock" : "Stock alerts"}
      </p>

      {/* 3. No Sizes Yet — more urgent than low stock: nothing to add to cart at all */}
      {noVariantProducts.length > 0 && (
        <details id="no-sizes" className="group" open>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-rust/30 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
            <div className="flex items-start gap-3">
              <SectionChevron />
              <div>
                <h2 className="font-display text-2xl font-semibold text-rust">
                  {locale === "fr" ? "Aucune taille en stock" : "No sizes in stock"}
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  {locale === "fr"
                    ? "Ces patrons n'ont aucune variante (taille d'hameçon) — impossible de les commander tant qu'on n'en ajoute pas."
                    : "These patterns have no variants (hook sizes) at all — nothing can be ordered until some are added back."}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-rust/15 px-3 py-1 font-mono text-xs font-semibold text-rust">
              {noVariantProducts.length}
            </span>
          </summary>
          <ul className="mt-6 flex flex-wrap gap-2">
            {noVariantProducts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/shop/${p.slug}`}
                  className="inline-block rounded-full border border-rust/30 bg-rust/5 px-4 py-2 text-sm font-medium text-rust transition hover:bg-rust/10"
                >
                  {locale === "fr" ? p.nameFr : p.nameEn}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink/50">
            {locale === "fr"
              ? "Ajoutez des tailles via npm run db:studio (table ProductVariant) une fois l'inventaire confirmé."
              : "Add sizes via npm run db:studio (ProductVariant table) once real inventory is confirmed."}
          </p>
        </details>
      )}

      {/* 4. Low Stock Alerts */}
      <details id="low-stock" className="group" open>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
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
          </div>
          <span className="rounded-full bg-rust/10 px-3 py-1 font-mono text-xs font-semibold text-rust">
            {lowStockVariants.length}
          </span>
        </summary>

        {lowStockVariants.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr"
              ? "Tous les stocks sont confortables."
              : "All inventory levels are healthy."}
          </div>
        ) : (
          <div className="mt-6 max-h-[32rem] overflow-y-auto rounded-2xl border border-forest/15 bg-parchment">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-forest/10 bg-cream/95 text-xs font-semibold text-forest backdrop-blur">
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
      </details>

      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rust">
        {locale === "fr" ? "Catalogue et commandes" : "Catalog and orders"}
      </p>

      {/* 5. Planned Patterns — what to tie next, not a real product yet */}
      <details id="planned" className="group" open>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest">
                {locale === "fr" ? "Patrons à monter" : "Planned Patterns"}
              </h2>
              <p className="mt-1 text-sm text-ink/70">
                {locale === "fr"
                  ? "Une liste de montage, pas le catalogue — une fois monté, prix et photographié, créez le vrai produit et retirez-le d'ici."
                  : "A tying to-do list, not the catalog — once it's actually tied, priced and photographed, create the real product and clear it from here."}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {plannedFlies.length}
          </span>
        </summary>

        {plannedFlies.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr" ? "Rien de planifié pour le moment." : "Nothing planned right now."}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {plannedFlies.map((p) => {
              const categoryLabel = PLANNED_CATEGORY_OPTIONS.find(
                (c) => c.value === p.category
              );
              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-forest/15 bg-parchment p-5"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-forest">
                        {locale === "fr" ? p.nameFr : p.nameEn}
                      </span>
                      <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-medium text-forest">
                        {categoryLabel ? (locale === "fr" ? categoryLabel.fr : categoryLabel.en) : p.category}
                      </span>
                    </div>
                    {p.species.length > 0 && (
                      <p className="mt-1.5 text-xs text-ink/60">
                        {p.species
                          .map((sp) => {
                            const opt = PLANNED_SPECIES_OPTIONS.find((o) => o.value === sp);
                            return opt ? (locale === "fr" ? opt.fr : opt.en) : sp;
                          })
                          .join(" · ")}
                      </p>
                    )}
                    {p.notes && <p className="mt-1.5 text-sm text-ink/75">{p.notes}</p>}
                  </div>
                  <button
                    type="button"
                    disabled={tyingId === p.id}
                    onClick={() => handleTied(p.id)}
                    className="shrink-0 rounded-full border border-forest/25 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-forest/10 disabled:opacity-50"
                  >
                    {locale === "fr" ? "Monté ✓" : "Tied it ✓"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <form
          onSubmit={handleAddPlanned}
          className="mt-6 space-y-4 rounded-2xl border border-forest/15 bg-cream/30 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            {locale === "fr" ? "Ajouter un patron planifié" : "Add a planned pattern"}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Nom (FR)" : "Name (FR)"}
              </label>
              <input
                type="text"
                required
                value={plannedForm.nameFr}
                onChange={(e) => setPlannedForm((f) => ({ ...f, nameFr: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Nom (EN)" : "Name (EN)"}
              </label>
              <input
                type="text"
                required
                value={plannedForm.nameEn}
                onChange={(e) => setPlannedForm((f) => ({ ...f, nameEn: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Catégorie" : "Category"}
              </label>
              <select
                value={plannedForm.category}
                onChange={(e) => setPlannedForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              >
                {PLANNED_CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {locale === "fr" ? c.fr : c.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60">
              {locale === "fr" ? "Espèces" : "Species"}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLANNED_SPECIES_OPTIONS.map((sp) => {
                const active = plannedForm.species.includes(sp.value);
                return (
                  <button
                    key={sp.value}
                    type="button"
                    onClick={() => togglePlannedSpecies(sp.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-forest bg-forest text-cream"
                        : "border-forest/20 text-forest hover:border-forest/50"
                    }`}
                  >
                    {locale === "fr" ? sp.fr : sp.en}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60">
              {locale === "fr" ? "Notes" : "Notes"}
            </label>
            <textarea
              rows={2}
              value={plannedForm.notes}
              onChange={(e) => setPlannedForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder={
                locale === "fr"
                  ? "Taille, rivière, saison — tout ce qui aide à s'en souvenir."
                  : "Size, river, season — whatever helps remember it later."
              }
              className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
            />
          </div>

          <button
            type="submit"
            disabled={addingPlanned}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingPlanned
              ? locale === "fr"
                ? "Ajout…"
                : "Adding…"
              : locale === "fr"
                ? "Ajouter à la liste"
                : "Add to the list"}
          </button>
        </form>
      </details>

      {/* 6. Recent Paid Orders & Bench Print Slips */}
      <details id="orders" className="group" open>
        <summary className="flex cursor-pointer list-none items-start gap-3 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <SectionChevron />
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
        </summary>

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
      </details>

      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rust">
        {locale === "fr" ? "Contenu publié" : "Published content"}
      </p>

      {/* 7. Community Catches — real ones only, added by hand */}
      <details id="catches" className="group" open>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest">
                {locale === "fr" ? "Prises de la communauté" : "Community Catches"}
              </h2>
              <p className="mt-1 text-sm text-ink/70">
                {locale === "fr"
                  ? "Vos prises, celles d'amis ou de clients — jamais inventées. Approuvé = visible sur /catches."
                  : "Yours, a friend's, a customer's — never fabricated. Approved = live on /catches."}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {catches.length}
          </span>
        </summary>

        {catches.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/40 p-8 text-center text-ink/60">
            {locale === "fr" ? "Aucune prise pour le moment." : "No catches yet."}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {catches.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-forest/15 bg-parchment p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-forest">
                      {c.anglerName || (locale === "fr" ? "Pêcheur anonyme" : "Anonymous angler")}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        c.approved ? "bg-forest/10 text-forest" : "bg-ink/10 text-ink/60"
                      }`}
                    >
                      {c.approved
                        ? locale === "fr"
                          ? "Approuvé"
                          : "Approved"
                        : locale === "fr"
                          ? "En attente"
                          : "Pending"}
                    </span>
                    {c.submittedByName && (
                      <span className={chipClass("outline")}>
                        {locale === "fr"
                          ? `Soumis par ${c.submittedByName}`
                          : `Submitted by ${c.submittedByName}`}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-ink/60">
                    {[
                      c.species,
                      c.sizeLabel,
                      c.water && (locale === "fr" ? c.water.nameFr : c.water.nameEn),
                      c.product && (locale === "fr" ? c.product.nameFr : c.product.nameEn),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {(c.captionFr || c.captionEn) && (
                    <p className="mt-1.5 text-sm text-ink/75">
                      {locale === "fr" ? c.captionFr : c.captionEn}
                    </p>
                  )}
                  {c.instagramUrl && (
                    <a
                      href={c.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2 inline-block ${chipClass("accent")}`}
                    >
                      {locale === "fr" ? "Voir la publication ↗" : "View the post ↗"}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={catchBusyId === c.id}
                    onClick={() => handleToggleCatchApproved(c)}
                    className="rounded-full border border-forest/25 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-forest/10 disabled:opacity-50"
                  >
                    {c.approved
                      ? locale === "fr"
                        ? "Retirer"
                        : "Unapprove"
                      : locale === "fr"
                        ? "Approuver"
                        : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={catchBusyId === c.id}
                    onClick={() => handleDeleteCatch(c.id)}
                    className="rounded-full border border-rust/40 px-4 py-2 text-xs font-semibold text-rust transition hover:bg-rust/10 disabled:opacity-50"
                  >
                    {locale === "fr" ? "Supprimer" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleAddCatch}
          className="mt-6 space-y-4 rounded-2xl border border-forest/15 bg-cream/30 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            {locale === "fr" ? "Ajouter une prise" : "Add a catch"}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Nom du pêcheur (optionnel)" : "Angler name (optional)"}
              </label>
              <input
                type="text"
                value={catchForm.anglerName}
                onChange={(e) => setCatchForm((f) => ({ ...f, anglerName: e.target.value }))}
                placeholder={locale === "fr" ? "Tiré d'Instagram si vide" : "Pulled from Instagram if left blank"}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Lien Instagram" : "Instagram link"}
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={catchForm.instagramUrl}
                  onChange={(e) => {
                    setInstagramFetchError(false);
                    setCatchForm((f) => ({ ...f, instagramUrl: e.target.value }));
                  }}
                  placeholder="https://www.instagram.com/p/…"
                  className="w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
                />
                <button
                  type="button"
                  disabled={!catchForm.instagramUrl || fetchingInstagram}
                  onClick={handleFetchInstagramInfo}
                  className="shrink-0 rounded-lg border border-forest/25 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-forest/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {fetchingInstagram
                    ? locale === "fr"
                      ? "Récupération…"
                      : "Fetching…"
                    : locale === "fr"
                      ? "Récupérer nom + légende"
                      : "Fetch name + caption"}
                </button>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                {locale === "fr"
                  ? "Ça suffit à soi seul — la photo est tirée automatiquement de la publication. \"Récupérer\" tente aussi de remplir le nom et la légende ci-dessous, s'ils sont vides."
                  : "This is enough on its own — the photo is pulled automatically from the post. \"Fetch\" also tries to fill in the name and caption below, if they're empty."}
              </p>
              {instagramFetchError && (
                <p className="mt-1 text-xs text-rust">
                  {locale === "fr"
                    ? "Rien trouvé sur cette publication — Instagram la bloque peut-être, ou elle n'a pas de légende. Remplissez à la main."
                    : "Couldn't find anything on that post — Instagram may be blocking it, or it has no caption. Fill in by hand."}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr"
                  ? "URL de la photo (optionnel — si ce n'est pas Instagram, ou si le lien ci-dessus ne fonctionne pas)"
                  : "Photo URL (optional — if it's not from Instagram, or the link above doesn't work)"}
              </label>
              <input
                type="text"
                value={catchForm.imageUrl}
                onChange={(e) => setCatchForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="/catches/example.jpg"
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Taille (optionnel)" : "Size (optional)"}
              </label>
              <input
                type="text"
                value={catchForm.sizeLabel}
                onChange={(e) => setCatchForm((f) => ({ ...f, sizeLabel: e.target.value }))}
                placeholder={locale === "fr" ? "ex. 18 po" : 'e.g. 18"'}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
          </div>
          {/* One live preview covering whichever field resolves to an image —
              the fastest way to catch a bad paste or a post the automatic
              derivation doesn't work for, before it ever goes live. */}
          {catchPreviewUrl && (
            <div>
              <p className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Aperçu" : "Preview"}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={catchPreviewUrl}
                alt=""
                className="mt-1 h-20 w-20 rounded-lg border border-forest/15 bg-cream object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "";
                }}
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Espèce (optionnel)" : "Species (optional)"}
              </label>
              <select
                value={catchForm.species}
                onChange={(e) => setCatchForm((f) => ({ ...f, species: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              >
                <option value="">{locale === "fr" ? "Aucune" : "None"}</option>
                {PLANNED_SPECIES_OPTIONS.map((sp) => (
                  <option key={sp.value} value={sp.value}>
                    {locale === "fr" ? sp.fr : sp.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Plan d'eau (optionnel)" : "Water (optional)"}
              </label>
              <select
                value={catchForm.waterId}
                onChange={(e) => setCatchForm((f) => ({ ...f, waterId: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              >
                <option value="">{locale === "fr" ? "Aucun" : "None"}</option>
                {waters.map((w) => (
                  <option key={w.id} value={w.id}>
                    {locale === "fr" ? w.nameFr : w.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Mouche utilisée (optionnel)" : "Fly used (optional)"}
              </label>
              <select
                value={catchForm.productId}
                onChange={(e) => setCatchForm((f) => ({ ...f, productId: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              >
                <option value="">{locale === "fr" ? "Aucune" : "None"}</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {locale === "fr" ? p.nameFr : p.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Conditions (optionnel)" : "Conditions (optional)"}
              </label>
              <input
                type="text"
                value={catchForm.conditionsFr}
                onChange={(e) =>
                  setCatchForm((f) => ({
                    ...f,
                    conditionsFr: e.target.value,
                    conditionsEn: f.conditionsEn || e.target.value,
                  }))
                }
                placeholder={locale === "fr" ? "ex. Soir, eau claire" : "e.g. Evening, clear water"}
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">
                {locale === "fr" ? "Légende (optionnel)" : "Caption (optional)"}
              </label>
              <input
                type="text"
                value={catchForm.captionFr}
                onChange={(e) =>
                  setCatchForm((f) => ({
                    ...f,
                    captionFr: e.target.value,
                    captionEn: f.captionEn || e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-halo"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={catchForm.approved}
              onChange={(e) => setCatchForm((f) => ({ ...f, approved: e.target.checked }))}
              className="h-4 w-4 rounded border-forest/40"
            />
            {locale === "fr" ? "Approuver immédiatement" : "Approve immediately"}
          </label>
          <button
            type="submit"
            disabled={addingCatch}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingCatch
              ? locale === "fr"
                ? "Ajout…"
                : "Adding…"
              : locale === "fr"
                ? "Ajouter la prise"
                : "Add the catch"}
          </button>
        </form>
      </details>

      {/* 8. Newsletter */}
      <details id="newsletter" className="group" open>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 border-b border-forest/15 pb-4 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex items-start gap-3">
            <SectionChevron />
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
          </div>
          <span className="rounded-full bg-forest/10 px-3 py-1 font-mono text-xs font-semibold text-forest">
            {subscriberCount} {locale === "fr" ? "abonnés" : "subscribers"}
          </span>
        </summary>

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
      </details>

      {/* 9. Quick Operational Links */}
      <details
        id="tools"
        className="group rounded-2xl border border-forest/15 bg-cream/30 p-6"
        open
      >
        <summary className="flex cursor-pointer list-none items-center gap-3 marker:hidden [&::-webkit-details-marker]:hidden">
          <SectionChevron align="center" />
          <h3 className="font-display text-lg font-semibold text-forest">
            {locale === "fr" ? "Diagnostics & Outils" : "Diagnostics & Tools"}
          </h3>
        </summary>
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href="/api/admin/canada-post-check"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-parchment px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:bg-forest/10"
          >
            📦 {locale === "fr" ? "Vérifier l'API Postes Canada" : "Check Canada Post API"} &rarr;
          </a>
          <a
            href={`/${locale}/admin/production`}
            className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-parchment px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:bg-forest/10"
          >
            🧵{" "}
            {locale === "fr"
              ? "Feuille de production (à monter + matériaux)"
              : "Production run sheet (to tie + materials)"}{" "}
            &rarr;
          </a>
        </div>
      </details>
    </div>
  );
}

/** Rotates via the parent <details>'s `group` class when it's open. */
function SectionChevron({ align = "start" }: { align?: "start" | "center" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180 ${
        align === "start" ? "mt-1" : ""
      }`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
