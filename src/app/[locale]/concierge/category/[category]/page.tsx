import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getExperiences } from "@/lib/content";
import { experienceCategories, type ExperienceCategory } from "@/schemas/content";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { toExperienceCard } from "@/lib/view-models";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";

type Params = { locale: string; category: string };
const validCategory = (value: string): value is ExperienceCategory =>
  (experienceCategories as readonly string[]).includes(value);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => experienceCategories.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, category } = await params;
  if (!validCategory(category)) return {};
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "concierge" });
  return buildMetadata({ locale, path: `/concierge/category/${category}`, title: t(`categories.${category}`), description: t(`categoryText.${category}`) });
}

export default async function ConciergeCategoryPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, category } = await params;
  if (!validCategory(category)) notFound();
  const locale = asLocale(rawLocale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "concierge" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const experiences = (await getExperiences()).filter((e) => e.category === category);

  return (
    <>
      <section className="border-b border-line bg-sand/40 py-14 sm:py-20 lg:py-24">
        <div className="container-site">
          <Breadcrumbs label={t("allExperiences")} items={[{ name: nav("home"), href: "/" }, { name: nav("concierge"), href: "/concierge" }, { name: t(`categories.${category}`) }]} />
          <p className="eyebrow mt-12 text-mist">{t("allExperiences")} · {experiences.length}</p>
          <h1 className="mt-5 max-w-4xl text-display-xl">{t(`categories.${category}`)}</h1>
          <p className="mt-6 max-w-2xl text-lede text-mist">{t(`categoryText.${category}`)}</p>
          <Link href="/concierge" className="mt-8 inline-flex min-h-11 items-center border-b border-ink pb-1 text-sm font-medium text-ink hover:opacity-60">← {t("backToConcierge")}</Link>
        </div>
      </section>
      <section className="section-y-sm">
        <div className="container-site">
          {experiences.length ? (
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((experience, i) => (
                <li key={experience.slug}>
                  <ExperienceCard experience={toExperienceCard(experience, locale)} ratio="5 / 4" tone={i % 2 ? "sage" : "sand"} showCategory={false} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          ) : <p className="text-lede text-mist">{t("noExperiences")}</p>}
        </div>
      </section>
    </>
  );
}
