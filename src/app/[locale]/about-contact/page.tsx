import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";
import { editorial } from "@/config/media";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

const PATH = "/about-contact";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: PATH, title: t("aboutTitle"), description: t("aboutDescription"), image: editorial.aboutHero?.src });
}

const values = ["v1", "v2", "v3", "v4"] as const;

export default async function AboutContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const { email, whatsappDisplay, whatsappUrl } = siteConfig.contact;
  const { instagram, instagramHandle, facebook, facebookHandle } = siteConfig.social;
  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { em: (c) => <em className="font-light italic">{c}</em> })}
        lede={t("hero.lede")}
        image={editorial.aboutHero}
        locale={locale}
        variant="fullBleed"
        tone="ink"
      />

      {/* Story */}
      <section className="section-y border-t border-line">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro index="01" eyebrow={t("story.eyebrow")} title={t("story.title")} />
          </div>
          <Reveal delay={120} className="space-y-6 text-lede text-charcoal/90 lg:col-span-6 lg:col-start-7">
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <p>{t("story.p3")}</p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-y-sm bg-sand/60">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12">
          <Reveal variant="mask" className="lg:col-span-5">
            <MediaFrame image={editorial.aboutDetail} locale={locale} ratio="4 / 5" tone="sage" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionIntro index="02" eyebrow={t("values.eyebrow")} title={t("values.title")} />
            <dl className="mt-12 divide-y divide-line border-y border-line">
              {values.map((v, i) => (
                <Reveal key={v} delay={i * 80} className="grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="font-display text-[1.375rem] leading-snug text-ink">{t(`values.${v}.title`)}</dt>
                  <dd className="text-mist">{t(`values.${v}.text`)}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-y scroll-mt-24">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro index="03" eyebrow={t("contact.eyebrow")} title={t("contact.title")} lede={t("contact.lede")} />
            <ul className="mt-12 space-y-6">
              {whatsappUrl && (
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4">
                    <WhatsAppIcon className="mt-1 size-5 text-ink" />
                    <span>
                      <span className="eyebrow block text-mist">WhatsApp</span>
                      <span className="link-line mt-1 inline-block text-ink">{whatsappDisplay}</span>
                    </span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="group flex items-start gap-4">
                    <Mail aria-hidden="true" className="mt-1 size-5 text-ink" strokeWidth={1.5} />
                    <span>
                      <span className="eyebrow block text-mist">{t("contact.email")}</span>
                      <span className="link-line mt-1 inline-block text-ink">{email}</span>
                    </span>
                  </a>
                </li>
              )}
              <li className="flex items-start gap-4">
                <MapPin aria-hidden="true" className="mt-1 size-5 text-ink" strokeWidth={1.5} />
                <span>
                  <span className="eyebrow block text-mist">{t("contact.serviceArea")}</span>
                  <span className="mt-1 block text-ink">{t("contact.serviceAreaText")}</span>
                </span>
              </li>
            </ul>
            {(instagram || facebook) && (
              <ul className="mt-10 flex gap-2" aria-label={t("contact.social")}>
                {instagram && (
                  <li>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label={t("contact.instagramLabel")} className="group inline-flex min-h-11 items-center gap-3 border border-line px-3 text-ink transition-colors hover:border-ink">
                      <span className="flex size-8 shrink-0 items-center justify-center border border-line transition-colors group-hover:border-ink">
                        <InstagramIcon className="size-4" />
                      </span>
                      <span className="text-sm">{instagramHandle}</span>
                    </a>
                  </li>
                )}
                {facebook && (
                  <li>
                    <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label={t("contact.facebookLabel")} className="group inline-flex min-h-11 items-center gap-3 border border-line px-3 text-ink transition-colors hover:border-ink">
                      <span className="flex size-8 shrink-0 items-center justify-center border border-line transition-colors group-hover:border-ink">
                        <FacebookIcon className="size-4" />
                      </span>
                      <span className="text-sm">{facebookHandle}</span>
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: tNav("home"), path: "/" }, { name: tNav("aboutContact"), path: PATH }], locale)} />
    </>
  );
}
