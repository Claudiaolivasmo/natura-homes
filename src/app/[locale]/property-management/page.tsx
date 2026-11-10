import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { editorial } from "@/config/media";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ButtonLink } from "@/components/ui/Button";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

const PATH = "/property-management";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: PATH, title: t("pmTitle"), description: t("pmDescription"), image: editorial.pmHero?.src });
}

const serviceGroups = [
  { key: "launch", items: ["onboarding", "listing", "photography", "channels"] },
  { key: "revenue", items: ["pricing", "revenue", "reporting"] },
  { key: "guests", items: ["communication", "checkin", "concierge"] },
  { key: "care", items: ["housekeeping", "maintenance", "inspections", "inventory"] },
] as const;

const steps = ["consultation", "evaluation", "onboarding", "launch", "ongoing"] as const;

export default async function PropertyManagementPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pm" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const wa = whatsappUrl(tw("ownerMessage"));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { em: (c) => <em className="font-light italic">{c}</em> })}
        lede={t("hero.lede")}
        image={editorial.pmHero}
        locale={locale}
        variant="fullBleed"
        tone="ink"
        actions={
          <>
            <ButtonLink href="#consultation" variant="light" arrow>{t("hero.cta")}</ButtonLink>
            {wa && <ButtonLink href={wa} external variant="outline-light">{t("hero.whatsapp")}</ButtonLink>}
          </>
        }
      />

      {/* Positioning statement */}
      <section className="section-y-sm border-t border-line">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-mist">{t("approach.eyebrow")}</p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-8">
            <p className="font-display text-display-sm leading-snug text-ink">{t("approach.statement")}</p>
            <p className="mt-8 max-w-2xl text-lede text-mist">{t("approach.text")}</p>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section-y bg-sand/60">
        <div className="container-site">
          <SectionIntro index="01" eyebrow={t("services.eyebrow")} title={t("services.title")} lede={t("services.lede")} />
          <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {serviceGroups.map((group, gi) => (
              <Reveal key={group.key} delay={(gi % 2) * 120}>
                <h3 className="border-b border-ink/20 pb-4 text-display-sm">{t(`services.groups.${group.key}`)}</h3>
                <ul className="mt-2">
                  {group.items.map((item) => (
                    <li key={item} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                      <p className="font-semibold text-ink">{t(`services.items.${item}.title`)}</p>
                      <p className="text-[0.9375rem] text-mist">{t(`services.items.${item}.text`)}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="on-dark section-y bg-ink text-ivory">
        <div className="container-site">
          <SectionIntro tone="light" index="02" eyebrow={t("process.eyebrow")} title={t("process.title")} lede={t("process.lede")} />
          <ol className="mt-16 grid gap-px bg-ivory/15 md:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 100} className="relative bg-ink pb-10 pt-8 md:pr-6">
                <span aria-hidden="true" className="font-display text-[3.5rem] font-light leading-none text-sage/70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-[1.5rem] leading-snug text-ivory">
                  <span className="sr-only">{t("process.stepLabel", { n: i + 1 })} </span>
                  {t(`process.steps.${step}.title`)}
                </h3>
                <p className="mt-3 text-[0.9375rem] text-ivory/70">{t(`process.steps.${step}.text`)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Image + reporting note */}
      <section className="section-y">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12">
          <Reveal variant="mask" className="lg:col-span-6">
            <MediaFrame image={editorial.pmDetail} locale={locale} ratio="5 / 4" tone="sage" sizes="(min-width: 1024px) 50vw, 100vw" />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionIntro index="03" eyebrow={t("owners.eyebrow")} title={t("owners.title")} lede={t("owners.lede")} />
            <ul className="mt-10 space-y-4">
              {(["o1", "o2", "o3"] as const).map((o, i) => (
                <Reveal as="li" key={o} delay={i * 80} className="flex gap-4 border-t border-line pt-4 text-mist">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sage-deep" />
                  {t(`owners.${o}`)}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section id="consultation" className="section-y scroll-mt-24 bg-sand/60">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro index="04" eyebrow={t("form.eyebrow")} title={t("form.title")} lede={t("form.lede")} />
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <ConsultationForm />
          </Reveal>
        </div>
      </section>

      <JsonLd
        data={[
          serviceSchema(t("hero.plainTitle"), t("hero.lede"), locale, PATH),
          breadcrumbSchema([{ name: tNav("home"), path: "/" }, { name: tNav("propertyManagement"), path: PATH }], locale),
        ]}
      />
    </>
  );
}
