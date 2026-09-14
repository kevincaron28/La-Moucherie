import { Resend } from "resend";
import { packagingFor, ORIGIN_POSTAL_CODE } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

// Everything here degrades to a log line when RESEND_API_KEY is unset, so local
// dev and the first production deploys work before email is configured. A
// failed send never throws into the caller either: losing a notification must
// not fail a payment webhook or a contact form submission.
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? "La Moucherie <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca").replace(
    /\/$/,
    ""
  );
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

async function send({ to, subject, html }: SendArgs) {
  if (!resend) {
    console.info(`[email:not-configured] would send "${subject}" to ${to}`);
    return;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("[email:failed]", subject, error);
  } catch (err) {
    console.error("[email:threw]", subject, err);
  }
}

function layout(bodyHtml: string) {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#241f18">
    <div style="background:#1f3327;color:#f4ead2;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:20px;font-weight:600">La Moucherie</div>
      <div style="font-size:13px;opacity:.75">Mouches artisanales du Québec</div>
    </div>
    <div style="border:1px solid #e6ded0;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      ${bodyHtml}
    </div>
  </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type OrderEmailData = {
  id: string;
  email: string;
  customerName: string;
  locale: string;
  currency: string;
  amountTotalCents: number;
  discountCents: number;
  shippingCents: number;
  shippingMethod: string;
  notes: string | null;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  items: {
    nameSnapshotFr: string;
    nameSnapshotEn: string;
    variantSnapshotFr: string;
    variantSnapshotEn: string;
    sku: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

export async function sendOrderConfirmation(order: OrderEmailData) {
  const fr = order.locale === "fr";
  const locale = fr ? "fr" : "en";

  const rows = order.items
    .map((item) => {
      const name = fr ? item.nameSnapshotFr : item.nameSnapshotEn;
      const size = fr ? item.variantSnapshotFr : item.variantSnapshotEn;
      const line = formatPrice(item.unitPriceCents * item.quantity, locale, order.currency);
      return `<tr>
        <td style="padding:6px 0">${name}${size ? ` <span style="color:#6b6357">(${size})</span>` : ""} &times; ${item.quantity}</td>
        <td style="padding:6px 0;text-align:right">${line}</td>
      </tr>`;
    })
    .join("");

  const total = formatPrice(order.amountTotalCents, locale, order.currency);

  const extraRow = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#6b6357">${label}</td>
     <td style="padding:6px 0;text-align:right;color:#6b6357">${value}</td></tr>`;

  const adjustments =
    (order.discountCents > 0
      ? extraRow(
          fr ? "Rabais quantité" : "Bulk discount",
          `-${formatPrice(order.discountCents, locale, order.currency)}`
        )
      : "") +
    extraRow(
      fr ? "Livraison" : "Shipping",
      order.shippingCents === 0
        ? fr
          ? "Offerte"
          : "Free"
        : formatPrice(order.shippingCents, locale, order.currency)
    );
  const address = [
    order.shippingLine1,
    order.shippingLine2,
    `${order.shippingCity}, ${order.shippingProvince} ${order.shippingPostalCode}`,
  ]
    .filter(Boolean)
    .join("<br>");

  const html = layout(
    fr
      ? `<p>Bonjour ${order.customerName},</p>
         <p>Merci pour votre commande ! Nous la préparons à la main et elle sera expédiée sous 2 à 5 jours ouvrables.</p>
         <p style="font-size:13px;color:#6b6357">Commande <strong>${order.id}</strong></p>
         <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}${adjustments}
           <tr><td style="border-top:1px solid #e6ded0;padding-top:10px;font-weight:600">Total</td>
           <td style="border-top:1px solid #e6ded0;padding-top:10px;text-align:right;font-weight:600">${total}</td></tr>
         </table>
         <p style="font-size:14px"><strong>Adresse de livraison</strong><br>${address}</p>
         <p style="font-size:13px;color:#6b6357">Des questions ? Répondez simplement à ce courriel.</p>`
      : `<p>Hi ${order.customerName},</p>
         <p>Thanks for your order! We're tying it up by hand and it ships within 2–5 business days.</p>
         <p style="font-size:13px;color:#6b6357">Order <strong>${order.id}</strong></p>
         <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}${adjustments}
           <tr><td style="border-top:1px solid #e6ded0;padding-top:10px;font-weight:600">Total</td>
           <td style="border-top:1px solid #e6ded0;padding-top:10px;text-align:right;font-weight:600">${total}</td></tr>
         </table>
         <p style="font-size:14px"><strong>Shipping to</strong><br>${address}</p>
         <p style="font-size:13px;color:#6b6357">Questions? Just reply to this email.</p>`
  );

  await send({
    to: order.email,
    subject: fr
      ? `Votre commande La Moucherie — ${order.id}`
      : `Your La Moucherie order — ${order.id}`,
    html,
  });
}

export async function sendOrderNotificationToOwner(order: OrderEmailData) {
  if (!OWNER_EMAIL) return;

  // This email is the tying list: pattern, hook size, SKU and count, so it can
  // be worked straight from the phone at the bench without opening the site.
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #e6ded0">
          <strong>${escapeHtml(i.nameSnapshotFr)}</strong><br>
          <span style="color:#6b6357;font-size:13px">${escapeHtml(i.variantSnapshotFr) || "&mdash;"} &middot; ${escapeHtml(i.sku)}</span>
        </td>
        <td style="padding:8px 10px;border-bottom:1px solid #e6ded0;text-align:right;font-size:18px;font-weight:600;white-space:nowrap">
          &times; ${i.quantity}
        </td>
      </tr>`
    )
    .join("");

  const flyCount = order.items.reduce((n, i) => n + i.quantity, 0);

  const notesBlock = order.notes
    ? `<div style="margin:16px 0;padding:12px 14px;border-left:3px solid #ac4d15;background:#faf3e8">
         <strong style="color:#ac4d15">Note du client</strong><br>
         ${escapeHtml(order.notes).replace(/\n/g, "<br>")}
       </div>`
    : "";

  const shippingLabel =
    order.shippingMethod === "LETTER"
      ? "Poste-lettre (Lettermail) — sans suivi"
      : "Colis régulier (Regular Parcel) — avec suivi";

  const pack = packagingFor(flyCount, order.shippingMethod === "LETTER" ? "LETTER" : "TRACKED");
  const shippingPaid =
    order.shippingCents === 0
      ? "Livraison offerte"
      : formatPrice(order.shippingCents, "fr", order.currency);

  // Canada Post's addressing standard: uppercase, no punctuation, municipality
  // and province and postal code on the last line. Written out ready to copy
  // onto a label rather than transcribed at the counter.
  const addressBlock = [
    order.customerName,
    order.shippingLine1,
    order.shippingLine2,
    `${order.shippingCity} ${order.shippingProvince}  ${order.shippingPostalCode}`,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(String(line).toUpperCase().replace(/,/g, "")))
    .join("\n");

  await send({
    to: OWNER_EMAIL,
    subject: `Nouvelle commande — ${flyCount} mouche${flyCount > 1 ? "s" : ""} — ${formatPrice(order.amountTotalCents, "fr", order.currency)}`,
    html: layout(
      `<p><strong>Nouvelle commande payée.</strong></p>
       <p style="font-size:13px;color:#6b6357">Commande ${order.id}</p>

       <h3 style="margin:18px 0 8px">À monter / prélever</h3>
       <table style="width:100%;border-collapse:collapse">${rows}</table>
       <p style="font-size:13px;color:#6b6357">Total : ${flyCount} mouche${flyCount > 1 ? "s" : ""}</p>

       ${notesBlock}

       <h3 style="margin:18px 0 8px">Au comptoir de Postes Canada</h3>
       <table style="width:100%;border-collapse:collapse;font-size:14px">
         <tr>
           <td style="padding:4px 0;color:#6b6357;width:42%">Service à demander</td>
           <td style="padding:4px 0"><strong>${shippingLabel}</strong></td>
         </tr>
         <tr>
           <td style="padding:4px 0;color:#6b6357">Emballage</td>
           <td style="padding:4px 0">${pack.labelFr} &mdash; ${pack.dimensionsCm} cm</td>
         </tr>
         <tr>
           <td style="padding:4px 0;color:#6b6357">Poids à déclarer</td>
           <td style="padding:4px 0">~${pack.weightGrams} g</td>
         </tr>
         <tr>
           <td style="padding:4px 0;color:#6b6357">Expédié depuis</td>
           <td style="padding:4px 0">${ORIGIN_POSTAL_CODE}</td>
         </tr>
         <tr>
           <td style="padding:4px 0;color:#6b6357">Payé par le client</td>
           <td style="padding:4px 0">${shippingPaid}</td>
         </tr>
       </table>

       <h3 style="margin:18px 0 8px">Adresse (format Postes Canada)</h3>
       <pre style="margin:0;padding:12px 14px;background:#f4efe4;border:1px solid #e6ded0;border-radius:6px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:15px;line-height:1.5;letter-spacing:.02em;white-space:pre-wrap">${addressBlock}</pre>
       <p style="font-size:13px;color:#6b6357;margin-top:10px">${escapeHtml(order.email)}</p>`
    ),
  });
}

export async function sendContactNotification(message: {
  name: string;
  email: string;
  message: string;
}) {
  if (!OWNER_EMAIL) return;
  const escaped = message.message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  await send({
    to: OWNER_EMAIL,
    subject: `Message du site — ${message.name}`,
    html: layout(
      `<p><strong>${message.name}</strong> &lt;${message.email}&gt;</p>
       <p>${escaped}</p>
       <p style="font-size:13px;color:#6b6357">Répondez directement à ${message.email}.</p>`
    ),
  });
}

export async function sendPasswordReset(args: {
  to: string;
  name: string;
  token: string;
  locale: string;
}) {
  const fr = args.locale === "fr";
  const url = `${siteUrl()}/${fr ? "fr" : "en"}/account/reset?token=${args.token}`;
  const html = layout(
    fr
      ? `<p>Bonjour ${args.name},</p>
         <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valide une heure et ne peut être utilisé qu'une seule fois.</p>
         <p><a href="${url}" style="display:inline-block;background:#a8461f;color:#f4ead2;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Choisir un nouveau mot de passe</a></p>
         <p style="font-size:13px;color:#6b6357">Si vous n'avez rien demandé, ignorez ce courriel — votre mot de passe reste inchangé.</p>`
      : `<p>Hi ${args.name},</p>
         <p>You asked to reset your password. This link is valid for one hour and can only be used once.</p>
         <p><a href="${url}" style="display:inline-block;background:#a8461f;color:#f4ead2;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Choose a new password</a></p>
         <p style="font-size:13px;color:#6b6357">If you didn't request this, ignore this email — your password stays unchanged.</p>`
  );
  await send({
    to: args.to,
    subject: fr ? "Réinitialiser votre mot de passe" : "Reset your password",
    html,
  });
}

export async function sendEmailVerification(args: {
  to: string;
  name: string;
  token: string;
  locale?: string;
}) {
  const fr = args.locale !== "en";
  const url = `${siteUrl()}/${fr ? "fr" : "en"}/account/verify?token=${args.token}`;
  const html = layout(
    fr
      ? `<p>Bonjour ${escapeHtml(args.name)},</p>
         <p>Bienvenue chez La Moucherie. Confirmez votre adresse courriel pour que nous puissions vous joindre au sujet de vos commandes.</p>
         <p><a href="${url}" style="display:inline-block;background:#ac4d15;color:#f2e9d5;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Confirmer mon courriel</a></p>
         <p style="font-size:13px;color:#6b6357">Ce lien est valide 24 heures. Vous pouvez magasiner et commander sans attendre — la confirmation sert seulement à protéger votre compte.</p>`
      : `<p>Hi ${escapeHtml(args.name)},</p>
         <p>Welcome to La Moucherie. Confirm your email so we can reach you about your orders.</p>
         <p><a href="${url}" style="display:inline-block;background:#ac4d15;color:#f2e9d5;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Confirm my email</a></p>
         <p style="font-size:13px;color:#6b6357">This link is valid for 24 hours. You can browse and order in the meantime — confirming just protects your account.</p>`
  );
  await send({
    to: args.to,
    subject: fr ? "Confirmez votre courriel" : "Confirm your email",
    html,
  });
}

export async function sendAbandonedCart(args: {
  to: string;
  name: string;
  locale: string;
  recoveryToken: string;
  items: { nameFr: string; nameEn: string; variantFr: string; variantEn: string; quantity: number }[];
}) {
  const fr = args.locale === "fr";
  const url = `${siteUrl()}/${fr ? "fr" : "en"}/cart?recover=${args.recoveryToken}`;
  const lines = args.items
    .map((i) => {
      const name = fr ? i.nameFr : i.nameEn;
      const size = fr ? i.variantFr : i.variantEn;
      return `<li style="padding:2px 0">${escapeHtml(name)}${size ? ` <span style="color:#6b6357">(${escapeHtml(size)})</span>` : ""} &times; ${i.quantity}</li>`;
    })
    .join("");
  const html = layout(
    fr
      ? `<p>Bonjour ${escapeHtml(args.name)},</p>
         <p>Vous avez laissé quelques mouches derrière vous. Elles vous attendent encore :</p>
         <ul style="margin:12px 0;padding-left:18px">${lines}</ul>
         <p><a href="${url}" style="display:inline-block;background:#ac4d15;color:#f2e9d5;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Reprendre ma commande</a></p>
         <p style="font-size:13px;color:#6b6357">Une question sur un patron ou une taille ? Répondez simplement à ce courriel — c'est moi qui monte les mouches.</p>`
      : `<p>Hi ${escapeHtml(args.name)},</p>
         <p>You left a few flies behind. They're still waiting:</p>
         <ul style="margin:12px 0;padding-left:18px">${lines}</ul>
         <p><a href="${url}" style="display:inline-block;background:#ac4d15;color:#f2e9d5;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Pick up where I left off</a></p>
         <p style="font-size:13px;color:#6b6357">Question about a pattern or a size? Just reply — I'm the one tying them.</p>`
  );
  await send({
    to: args.to,
    subject: fr ? "Vos mouches vous attendent" : "Your flies are waiting",
    html,
  });
}
