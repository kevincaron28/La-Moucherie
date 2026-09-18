import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect, Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { AccountProfileForm } from "@/components/AccountProfileForm";
import { AccountDetailsForms } from "@/components/AccountDetailsForms";
import { VerifyEmailBanner } from "@/components/VerifyEmailBanner";
import { AccountSection } from "@/components/AccountSection";
import { SignOutButton } from "@/components/SignOutButton";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
import { HATCHES } from "@/lib/hatches";
import type { Locale } from "@/i18n/routing";
import type { OrderStatus } from "@prisma/client";

const STATUS_KEYS: Record<OrderStatus, string> = {
  PENDING: "statusPending",
  PAID: "statusPaid",
  FAILED: "statusFailed",
  REFUNDED: "statusRefunded",
  FULFILLED: "statusFulfilled",
  CANCELLED: "statusCancelled",
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Account");

  const session = await auth();
  if (!session || !session.user) {
    redirect({ href: "/account/login", locale });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect({ href: "/account/login", locale });
    return;
  }

  const [orders, hatchReports, catches] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: user.id,
        status: { notIn: ["CANCELLED", "FAILED"] },
      },
      include: {
        items: { include: { product: { select: { slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.hatchReport.findMany({
      where: { userId: user.id },
      orderBy: { observedOn: "desc" },
      select: {
        id: true,
        observedOn: true,
        approved: true,
        hatchId: true,
        waterOther: true,
        water: { select: { nameFr: true, nameEn: true } },
      },
    }),
    prisma.catchPhoto.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        approved: true,
        createdAt: true,
        species: true,
      },
    }),
  ]);

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">
            {t("myAccount")}
          </h1>
          <p className="mt-1 text-ink/70">{t("welcomeBack", { name: user.name })}</p>
        </div>
        <SignOutButton />
      </div>

      {!user.emailVerified && <VerifyEmailBanner email={user.email} />}

      <div className="mt-8 space-y-3">
      <AccountSection
        title={t("orderHistory")}
        count={orders.length}
        defaultOpen
      >
        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-forest/10 bg-cream/50 p-6 text-center">
            <p className="text-ink/60">{t("noOrders")}</p>
            <Link
              href="/shop"
              className="mt-4 inline-block rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark"
            >
              {t("shopCta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10 border-y border-forest/10">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                <div>
                  <p className="font-mono text-sm text-forest">{order.id}</p>
                  <p className="text-xs text-ink/50">{dateFormatter.format(order.createdAt)}</p>
                  <p className="mt-1 text-sm text-ink/70">
                    {order.items.map((item, idx) => {
                      const label = pick(
                        item.nameSnapshotFr,
                        item.nameSnapshotEn,
                        locale
                      );
                      const size = pick(
                        item.variantSnapshotFr,
                        item.variantSnapshotEn,
                        locale
                      );
                      return (
                        <span key={item.id}>
                          {idx > 0 && ", "}
                          {/* A discontinued product leaves productId null, so the
                              name snapshot still reads correctly with no link. */}
                          {item.product ? (
                            <Link
                              href={`/shop/${item.product.slug}`}
                              className="underline decoration-forest/30 underline-offset-2 transition hover:text-forest hover:decoration-forest"
                            >
                              {label}
                            </Link>
                          ) : (
                            label
                          )}
                          {size && <span className="text-ink/50"> ({size})</span>}
                          {item.quantity > 1 && (
                            <span className="text-ink/50"> &times; {item.quantity}</span>
                          )}
                        </span>
                      );
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold text-forest">
                    {formatPrice(order.amountTotalCents, locale, order.currency)}
                  </p>
                  <p className="text-xs text-ink/50">{t(STATUS_KEYS[order.status])}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountSection>

      <AccountSection title={t("myHatchReports")} hint={t("myHatchReportsHint")} count={hatchReports.length}>
        {hatchReports.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-forest/10 bg-cream/50 p-6 text-center">
            <p className="text-ink/60">{t("noHatchReports")}</p>
            <Link
              href="/reports/submit"
              className="mt-4 inline-block rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark"
            >
              {t("fileReportCta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10 border-y border-forest/10">
            {hatchReports.map((r) => {
              const hatch = HATCHES.find((h) => h.id === r.hatchId);
              const where =
                (r.water && pick(r.water.nameFr, r.water.nameEn, locale)) ||
                r.waterOther ||
                null;
              return (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <div>
                    <p className="text-sm font-medium text-forest">
                      {where}
                      {hatch && ` · ${pick(hatch.nameFr, hatch.nameEn, locale)}`}
                    </p>
                    <p className="text-xs text-ink/50">{dateFormatter.format(r.observedOn)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.approved ? "bg-forest/10 text-forest" : "bg-rust/10 text-rust"
                    }`}
                  >
                    {r.approved ? t("reportPublished") : t("reportPending")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </AccountSection>

      <AccountSection title={t("myCatches")} hint={t("myCatchesHint")} count={catches.length}>
        {catches.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-forest/10 bg-cream/50 p-6 text-center">
            <p className="text-ink/60">{t("noCatches")}</p>
            <Link
              href="/catches/submit"
              className="mt-4 inline-block rounded-full bg-rust px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust-dark"
            >
              {t("submitCatchCta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {catches.map((c) => (
              <li key={c.id} className="overflow-hidden rounded-2xl border border-forest/10">
                {/* Curated URLs, not uploads -- same reasoning as /catches. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.imageUrl}
                  alt=""
                  className="aspect-square w-full bg-cream object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="text-xs text-ink/50">{dateFormatter.format(c.createdAt)}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.approved ? "bg-forest/10 text-forest" : "bg-rust/10 text-rust"
                    }`}
                  >
                    {c.approved ? t("catchPublished") : t("catchPending")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountSection>

      <AccountSection title={t("accountDetails")} hint={t("accountDetailsHint")}>
        <div className="max-w-lg">
          <AccountDetailsForms initialName={user.name} initialEmail={user.email} />
        </div>
      </AccountSection>

      <AccountSection title={t("savedInfo")} hint={t("savedInfoHint")}>
        <div className="max-w-lg">
          <AccountProfileForm
            initial={{
              shippingLine1: user.shippingLine1 ?? "",
              shippingLine2: user.shippingLine2 ?? "",
              shippingCity: user.shippingCity ?? "",
              shippingProvince: user.shippingProvince ?? "",
              shippingPostalCode: user.shippingPostalCode ?? "",
              shippingCountry: user.shippingCountry ?? "CA",
            }}
          />
        </div>
      </AccountSection>
      </div>
    </div>
  );
}
