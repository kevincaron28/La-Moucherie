import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConstructionBanner } from "@/components/ConstructionBanner";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamoucherie.ca";

  return {
    // Without a metadataBase, every relative image path in a page's own
    // metadata resolves against localhost at build time.
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: "%s — La Moucherie",
    },
    description: t("description"),
    // Inherited by every page that doesn't set its own. Until this existed,
    // only a product page produced a link preview — a link to the hatch chart
    // or an insect guide shared on Instagram or in a message showed a bare URL,
    // which is most of what this shop is discovered through.
    openGraph: {
      type: "website",
      siteName: "La Moucherie",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      images: [{ url: "/brand/logo-512.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/brand/logo-512.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-parchment text-ink">
        <NextIntlClientProvider>
          <SessionProvider>
            <CartProvider>
              <ConstructionBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </SessionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
