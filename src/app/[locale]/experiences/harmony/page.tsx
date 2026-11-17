import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HarmonyOverview } from "@/components/experiences/HarmonyPages";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/experiences/harmony";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "harmony" });
  return buildMetadata({
    locale,
    path: PATH,
    title: t("meta.overviewTitle"),
    description: t("meta.overviewDescription"),
    image: "/images/experiences/harmony/harmony-overview.webp",
  });
}

export default async function HarmonyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  return <HarmonyOverview locale={locale} />;
}
