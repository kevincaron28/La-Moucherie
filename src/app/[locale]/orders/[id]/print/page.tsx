import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { packagingFor, type ShippingMethod } from "@/lib/shipping";
import { PrintButton } from "@/components/PrintButton";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function OrderPrintPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const session = await auth();
  const operator = await isAdmin();
  const isOwner = Boolean(session?.user?.id && order.userId === session.user.id);

  if (!operator && !isOwner) {
    notFound();
  }

  const totalFlies = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const packaging = packagingFor(
    totalFlies,
    (order.shippingMethod as ShippingMethod) || "TRACKED"
  );

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 font-sans text-black print:p-0 print:m-0">
      {/* Top action bar - hidden when printing */}
      <div className="mb-8 flex items-center justify-between print:hidden border-b border-gray-200 pb-4">
        <Link
          href={operator ? "/admin" : "/account"}
          className="text-sm font-medium text-forest hover:underline"
        >
          &larr; {locale === "fr" ? "Retour au tableau de bord" : "Back to dashboard"}
        </Link>
        <PrintButton
          label={locale === "fr" ? "Imprimer la fiche d'étau" : "Print Bench Slip"}
        />
      </div>

      {/* Slip Header */}
      <div className="border-b-2 border-black pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">LA MOUCHERIE</h1>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              {locale === "fr" ? "Fiche d'étau & Préparation" : "Vise & Packing Slip"}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-bold block">{order.id}</span>
            <span className="text-xs text-gray-600">{dateFormatter.format(order.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Order & Shipping Info */}
      <div className="mt-6 grid grid-cols-2 gap-6 border-b border-gray-300 pb-6 text-sm">
        <div>
          <h2 className="text-xs font-bold uppercase text-gray-500">
            {locale === "fr" ? "Client & Destination" : "Customer & Destination"}
          </h2>
          <p className="mt-1 font-semibold">{order.customerName}</p>
          <p className="text-gray-700">{order.email}</p>
          <div className="mt-2 text-gray-700">
            <p>{order.shippingLine1}</p>
            {order.shippingLine2 && <p>{order.shippingLine2}</p>}
            <p>
              {order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}
            </p>
            <p>{order.shippingCountry}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase text-gray-500">
            {locale === "fr" ? "Expédition recommandée" : "Recommended Packaging"}
          </h2>
          <div className="mt-1 rounded border border-gray-300 bg-gray-50 p-3">
            <p className="font-semibold">
              {order.shippingMethod === "LETTER"
                ? (locale === "fr" ? "Poste-lettre" : "Lettermail")
                : (locale === "fr" ? "Colis avec suivi" : "Tracked Parcel")}
            </p>
            <p className="mt-1 text-xs text-gray-700">
              {locale === "fr" ? packaging.labelFr : packaging.labelEn}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {locale === "fr" ? "Dimensions:" : "Dimensions:"} {packaging.dimensionsCm} cm · ~{packaging.weightGrams} g
            </p>
            <p className="mt-2 text-xs font-bold text-black">
              {locale === "fr" ? "Total à monter:" : "Total flies to pack:"} {totalFlies} {locale === "fr" ? "mouches" : "flies"}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {order.notes && (
        <div className="mt-4 rounded border-2 border-black bg-yellow-50 p-4 text-sm">
          <p className="font-bold text-black">
            ⚠️ {locale === "fr" ? "Note spéciale du client :" : "Special instructions from customer:"}
          </p>
          <p className="mt-1 text-gray-900 whitespace-pre-line">{order.notes}</p>
        </div>
      )}

      {/* Checklist Table */}
      <div className="mt-6">
        <h2 className="text-xs font-bold uppercase text-gray-500 mb-2">
          {locale === "fr" ? "Patrons à monter / prélever" : "Patterns to tie / pick"}
        </h2>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-black text-xs uppercase">
              <th className="w-10 pb-2 text-center">✓</th>
              <th className="pb-2">Qté</th>
              <th className="pb-2">Patron</th>
              <th className="pb-2">Taille / Hameçon</th>
              <th className="pb-2 font-mono text-xs">SKU</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {order.items.map((item) => (
              <tr key={item.id} className="py-2">
                <td className="py-3 text-center">
                  <div className="mx-auto h-5 w-5 rounded border-2 border-black" />
                </td>
                <td className="py-3 font-bold text-base">{item.quantity}&times;</td>
                <td className="py-3 font-semibold text-black">
                  {locale === "fr" ? item.nameSnapshotFr : item.nameSnapshotEn}
                </td>
                <td className="py-3 text-gray-800 font-medium">
                  {locale === "fr" ? item.variantSnapshotFr : item.variantSnapshotEn || "—"}
                </td>
                <td className="py-3 font-mono text-xs text-gray-600">{item.sku}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature & Verification Box */}
      <div className="mt-12 border-t-2 border-dashed border-gray-400 pt-6">
        <div className="flex justify-between text-xs text-gray-600">
          <div>
            <p className="font-bold text-black">{locale === "fr" ? "Vérification qualité :" : "Quality Check:"}</p>
            <p className="mt-4 border-b border-black w-48"></p>
            <p className="mt-1">{locale === "fr" ? "Initiales du monteur" : "Tyer initials"}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-black">{locale === "fr" ? "Date de mise en boîte :" : "Packing date:"}</p>
            <p className="mt-4 border-b border-black w-48"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
