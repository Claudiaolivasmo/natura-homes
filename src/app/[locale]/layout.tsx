import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppProvider } from "@/components/whatsapp/WhatsAppContext";
import { WhatsAppFloat } from "@/components/whatsapp/WhatsAppFloat";
import { RevealObserver } from "@/components/animations/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/structured-data";
import { asLocale } from "@/lib/i18n-content";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#1A2E35",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: `%s | ${siteConfig.name}` },
    description: t("defaultDescription"),
    applicationName: siteConfig.name,
    formatDetection: { telephone: false },
    icons: {
      icon: [
        { url: "/branding/favicon-dark-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/branding/favicon-dark-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/branding/favicon-dark-180x180.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

// Marks the document as JS-capable so reveal animations may hide content
// before it scrolls in. A safety timer reveals everything if the observer
// never starts (e.g. a script error), so content can never stay hidden.
const revealBootstrap = `document.documentElement.classList.add('js-ready');setTimeout(function(){if(!window.__nhReveal){document.querySelectorAll('[data-reveal]').forEach(function(n){n.setAttribute('data-revealed','')})}},2500);`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "meta" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale === "es" ? "es-CR" : "en"} className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <WhatsAppProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory"
            >
              {tCommon("skipToContent")}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={asLocale(locale)} />
            <WhatsAppFloat />
            <RevealObserver />
          </WhatsAppProvider>
        </NextIntlClientProvider>
        <JsonLd data={organizationSchema(asLocale(locale), t("defaultDescription"))} />
      </body>
    </html>
  );
}
