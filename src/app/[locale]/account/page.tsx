import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect, Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { AccountProfileForm } from "@/components/AccountProfileForm";
import { AccountDetailsForms } from "@/components/AccountDetailsForms";
import { VerifyEmailBanner } from "@/components/VerifyEmailBanner";
import { SignOutButton } from "@/components/SignOutButton";
import { pick } from "@/lib/localize";
import { formatPrice } from "@/lib/format";
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

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { product: { select: { slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

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

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          {t("orderHistory")}
        </h2>

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
      </section>

      <section className="mt-10 max-w-lg">
        <h2 className="font-display text-xl font-semibold text-forest">
          {t("accountDetails")}
        </h2>
        <p className="mt-1 text-sm text-ink/60">{t("accountDetailsHint")}</p>
        <AccountDetailsForms initialName={user.name} initialEmail={user.email} />
      </section>

      <section className="mt-10 max-w-lg">
        <h2 className="font-display text-xl font-semibold text-forest">{t("savedInfo")}</h2>
        <p className="mt-1 text-sm text-ink/60">{t("savedInfoHint")}</p>
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
      </section>
    </div>
  );
}
