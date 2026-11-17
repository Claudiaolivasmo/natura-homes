import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getExperience, getExperiences, getRelatedExperiences } from "@/lib/content";
import { asLocale, localize } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { toExperienceCard } from "@/lib/view-models";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/animations/Reveal";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { FactsBar, type Fact } from "@/components/ui/FactsBar";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceRequestPanel } from "@/components/experiences/ExperienceRequestPanel";
import { SetWhatsAppMessage } from "@/components/whatsapp/WhatsAppContext";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const items = await getExperiences();
  return routing.locales.flatMap((locale) => items.map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  const exp = await getExperience(slug);
  if (!exp) return {};
  return buildMetadata({
    locale,
    path: `/concierge/${exp.slug}`,
    title: localize(exp.seo?.title, locale) || localize(exp.title, locale),
    description: localize(exp.seo?.description, locale) || localize(exp.summary, locale),
    image: exp.images[0]?.src,
  });
}

export default async function ExperiencePage({ params }: { params: Promise<Params> }) {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  setRequestLocale(locale);
  const exp = await getExperience(slug);
  if (exp?.slug === "harmony") redirect("/experiences/harmony");
  if (!exp) notFound();

  const t = await getTranslations({ locale, namespace: "concierge" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const [all, related] = await Promise.all([getExperiences(), getRelatedExperiences(exp.slug, exp.category, 3)]);

  const title = localize(exp.title, locale);
  const waMessage = tw("experienceMessage", { name: title });
  const wa = whatsappUrl(waMessage);
  const description = localize(exp.description, locale);
  const inclusions = exp.inclusions.map((i) => localize(i, locale)).filter(Boolean);
  const exclusions = exp.exclusions.map((i) => localize(i, locale)).filter(Boolean);
  const availability = localize(exp.availability, locale);

  const facts: Fact[] = [{ label: t("detail.category"), value: t(`categories.${exp.category}`) }];
  const duration = localize(exp.duration, locale);
  if (duration) facts.push({ label: t("detail.duration"), value: duration });
  if (exp.location) facts.push({ label: t("detail.location"), value: exp.location });
  if (exp.price) {
    const unit = localize(exp.price.unit, locale);
    facts.push({ label: t("detail.price"), value: `${formatPrice(exp.price.amount, exp.price.currency, locale)}${unit ? ` ${unit}` : ""}` });
  }

  const crumbs = [
    { name: tNav("home"), path: "/" },
    { name: tNav("concierge"), path: "/concierge" },
    { name: title, path: `/concierge/${exp.slug}` },
  ];

  return (
    <>
      <SetWhatsAppMessage message={waMessage} />

      <section className="pt-10 sm:pt-14">
        <div className="container-site">
          <Breadcrumbs label={t("detail.breadcrumb")} items={[{ name: tNav("home"), href: "/" }, { name: tNav("concierge"), href: "/concierge" }, { name: title }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <Reveal variant="fade">
                <p className="eyebrow text-mist">{t(`categories.${exp.category}`)}</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 text-display-xl">{title}</h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 max-w-xl text-lede text-mist">{localize(exp.summary, locale)}</p>
              </Reveal>
            </div>
            <Reveal variant="mask" className="lg:col-span-5 lg:col-start-8">
              <MediaFrame image={exp.images[0]} locale={locale} ratio="4 / 5" priority tone="sage" sizes="(min-width: 1024px) 40vw, 100vw" zoom={false} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y-sm">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FactsBar facts={facts} />
            {description && <Paragraphs text={description} className="mt-12 text-lede text-charcoal/90" />}

            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="mt-14 grid gap-10 sm:grid-cols-2">
                {inclusions.length > 0 && (
                  <div>
                    <h2 className="text-display-sm">{t("detail.included")}</h2>
                    <ul className="mt-5 space-y-3">
                      {inclusions.map((i) => <li key={i} className="border-b border-line pb-3 text-charcoal">{i}</li>)}
                    </ul>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div>
                    <h2 className="text-display-sm">{t("detail.notIncluded")}</h2>
                    <ul className="mt-5 space-y-3">
                      {exclusions.map((i) => <li key={i} className="border-b border-line pb-3 text-mist">{i}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-14 border-l-2 border-sage pl-6">
              <h2 className="eyebrow text-mist">{t("detail.availability")}</h2>
              <p className="mt-3 text-charcoal">{availability || t("detail.availabilityDefault")}</p>
              {!exp.price && <p className="mt-2 text-[0.9375rem] text-mist">{t("detail.priceOnRequest")}</p>}
            </div>

            {exp.images.length + exp.videos.length > 1 && (
              <div className="mt-16">
                <h2 className="mb-8 text-display-sm">{t("detail.gallery")}</h2>
                <MediaGallery images={exp.images} videos={exp.videos} title={title} />
              </div>
            )}
          </div>

          <aside id="request" className="scroll-mt-28 lg:col-span-5" aria-labelledby="exp-request">
            <div className="border border-line bg-white/60 p-6 sm:p-9 lg:sticky lg:top-28">
              <h2 id="exp-request" className="text-display-sm">{t("detail.requestTitle")}</h2>
              <p className="mt-3 text-[0.9375rem] text-mist">{t("detail.requestText")}</p>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-ink/30 px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink">
                  <WhatsAppIcon className="size-4" />
                  {t("detail.askWhatsApp")}
                </a>
              )}
              <ExperienceRequestPanel
                experience={exp}
                locale={locale}
                options={all.map((e) => ({ slug: e.slug, title: localize(e.title, locale) }))}
              />
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y bg-sand/60">
          <div className="container-site">
            <h2 className="text-display-md">{t("detail.related")}</h2>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <li key={r.slug}>
                  <ExperienceCard experience={toExperienceCard(r, locale)} ratio="5 / 4" tone={i % 2 ? "sage" : "sand"} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema(crumbs, locale)} />
    </>
  );
}
