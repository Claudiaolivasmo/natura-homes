import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/layout/LegalPage";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return buildMetadata({ locale, path: "/privacy", title: t("title"), description: t("metaDescription") });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  return <LegalPage locale={locale} namespace="legal.privacy" />;
}
