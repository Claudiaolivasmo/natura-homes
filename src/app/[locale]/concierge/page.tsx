import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { editorial } from "@/config/media";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ConciergeRequestForm } from "@/components/forms/ConciergeRequestForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { getExperiences } from "@/lib/content";
import { experienceCategories } from "@/schemas/content";
import { toExperienceCard } from "@/lib/view-models";
import { asLocale, localize } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

const PATH = "/concierge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: PATH, title: t("conciergeTitle"), description: t("conciergeDescription"), image: editorial.conciergeHero?.src });
}

export default async function ConciergePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "concierge" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const wa = whatsappUrl(tw("conciergeMessage"));
  const experiences = await getExperiences();

  // Only categories that currently have experiences get a section
  const groups = experienceCategories
    .map((cat) => ({ cat, items: experiences.filter((e) => e.category === cat) }))
    .filter((g) => g.items.length > 0);

  const options = experiences.map((e) => ({ slug: e.slug, title: localize(e.title, locale) }));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { em: (c) => <em className="font-light italic">{c}</em> })}
        lede={t("hero.lede")}
        image={editorial.conciergeHero}
        locale={locale}
        variant="fullBleed"
        tone="ink"
        actions={
          <>
            <ButtonLink href="#request" variant="light" arrow>{t("hero.cta")}</ButtonLink>
            {wa && <ButtonLink href={wa} external variant="outline-light">{t("hero.whatsapp")}</ButtonLink>}
          </>
        }
      />

      {/* Category index */}
      <section className="border-y border-line">
        <div className="container-site">
          <nav aria-label={t("categoriesLabel")} className="-mx-1 flex gap-1 overflow-x-auto py-4">
            {experienceCategories.map((cat) => {
              const has = groups.some((g) => g.cat === cat);
              return has ? (
                <a key={cat} href={`#${cat}`} className="shrink-0 px-4 py-2 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-sand">
                  {t(`categories.${cat}`)}
                </a>
              ) : (
                <span key={cat} className="shrink-0 px-4 py-2 text-[0.8125rem] text-mist/70">{t(`categories.${cat}`)}</span>
              );
            })}
          </nav>
        </div>
      </section>

      {groups.length === 0 ? (
        <section className="section-y">
          <div className="container-site">
            <p className="max-w-xl text-lede text-mist">{t("empty")}</p>
          </div>
        </section>
      ) : (
        groups.map((g, gi) => (
          <section key={g.cat} id={g.cat} className={`section-y-sm scroll-mt-24 ${gi % 2 === 1 ? "bg-sand/50" : ""}`}>
            <div className="container-site grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal variant="fade">
                  <p className="eyebrow text-mist">{String(gi + 1).padStart(2, "0")}</p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-4 text-display-md">{t(`categories.${g.cat}`)}</h2>
                </Reveal>
                <Reveal delay={140}>
                  <p className="mt-4 text-mist">{t(`categoryText.${g.cat}`)}</p>
                </Reveal>
              </div>
              <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
                {g.items.filter((e) => e.featured).concat(g.items.filter((e) => !e.featured)).slice(0, 3).map((e, i) => (
                  <Reveal as="li" key={e.slug} delay={(i % 3) * 100}>
                    <ExperienceCard experience={toExperienceCard(e, locale)} ratio="4 / 5" tone={(gi + i) % 2 ? "sage" : "sand"} headingLevel="h3" showCategory={false} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  </Reveal>
                ))}
                <li className="sm:col-span-2 lg:col-span-3 mt-1">
                  <Link href={`/concierge/category/${g.cat}`} className="inline-flex min-h-11 items-center border-b border-ink pb-2 text-sm font-semibold tracking-wide text-ink transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                    {t("viewAllCategory", { category: t(`categories.${g.cat}`), count: g.items.length })} <span aria-hidden="true" className="ml-3">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        ))
      )}

      {/* Request form */}
      <section id="request" className="on-dark section-y scroll-mt-24 bg-ink text-ivory">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro tone="light" eyebrow={t("request.eyebrow")} title={t("request.title")} lede={t("request.lede")} />
          </div>
          <Reveal className="on-light bg-ivory p-6 text-charcoal sm:p-10 lg:col-span-7 lg:col-start-6">
            {/* Form sits on an ivory card so field styles keep full contrast */}
            <ConciergeRequestForm options={options} />
          </Reveal>
        </div>
      </section>

      <JsonLd
        data={[
          serviceSchema(t("hero.plainTitle"), t("hero.lede"), locale, PATH),
          breadcrumbSchema([{ name: tNav("home"), path: "/" }, { name: tNav("concierge"), path: PATH }], locale),
        ]}
      />
    </>
  );
}
