import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HarmonySpacePage } from "@/components/experiences/HarmonyPages";
import { getHarmonySpace, harmonySpaces } from "@/lib/harmony";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";

type Params = { locale: string; space: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => harmonySpaces.map(({ slug }) => ({ locale, space: slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, space: slug } = await params;
  const space = getHarmonySpace(slug);
  if (!space) return {};
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "harmony" });
  const name = t(`spaces.${space.slug}.name`);
  return buildMetadata({
    locale,
    path: `/experiences/harmony/${slug}`,
    title: `${name} | ${t("meta.overviewTitle")}`,
    description: t("meta.spaceDescription", { name }),
    image: space.image,
  });
}

export default async function HarmonySpaceRoute({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, space: slug } = await params;
  const space = getHarmonySpace(slug);
  if (!space) notFound();
  const locale = asLocale(rawLocale);
  setRequestLocale(locale);
  return <HarmonySpacePage locale={locale} slug={space.slug} />;
}
