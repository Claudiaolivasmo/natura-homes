import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { Reveal } from "@/components/animations/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getHarmonySpace, harmonyInquiryHref, harmonySpaces, type HarmonySpaceSlug } from "@/lib/harmony";
import { asLocale } from "@/lib/i18n-content";

function ImagePlaceholder({
  src,
  alt,
  label,
  priority = false,
  ratio = "4 / 3",
}: {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
  ratio?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-sand" style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-editorial)]"
      />
      <span className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] bg-ivory/90 px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur-sm sm:bottom-6 sm:left-6">
        {label}
      </span>
    </div>
  );
}

export async function HarmonyOverview({ locale: rawLocale }: { locale: string }) {
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "harmony" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return (
    <>
      <section className="bg-[#1A2E35] pb-16 pt-[calc(5.5rem+2rem)] text-ivory sm:pb-24 sm:pt-36">
        <div className="container-site">
          <Breadcrumbs
            label={t("overview.eyebrow")}
            items={[
              { name: nav("home"), href: "/" },
              { name: nav("concierge"), href: "/concierge" },
              { name: t("overview.title") },
            ]}
          />
          <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal variant="fade">
                <p className="eyebrow text-sage">{t("overview.eyebrow")}</p>
                <h1 className="mt-6 font-display text-[clamp(3.5rem,9vw,7.5rem)] font-light leading-[0.9] tracking-[-0.06em]">
                  {t("overview.title")}
                </h1>
                <p className="mt-5 max-w-lg font-display text-2xl font-light italic leading-snug text-ivory/75 sm:text-3xl">
                  {t("overview.subtitle")}
                </p>
              </Reveal>
              <Reveal delay={140}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <ButtonLink href="#spaces" variant="light" arrow>{t("overview.exploreButton")}</ButtonLink>
                  <ButtonLink href={harmonyInquiryHref(t("overview.inquiryMessage"))} variant="outline-light" arrow>
                    {t("common.requestAvailability")}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <Reveal variant="mask" className="lg:col-span-6 lg:col-start-7">
              <ImagePlaceholder
                src="/images/experiences/harmony/harmony-overview.webp"
                alt={t("overview.imageAlt")}
                priority
                ratio="5 / 4"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="eyebrow text-mist">{t("common.category")}</p>
            <span aria-hidden="true" className="mt-8 inline-flex size-12 items-center justify-center rounded-full border border-line text-ink">
              <ArrowDown className="size-4" strokeWidth={1.3} />
            </span>
          </div>
          <div className="lg:col-span-7 lg:col-start-5">
            <Paragraphs text={t("overview.intro")} className="text-lede leading-relaxed text-charcoal/90" />
          </div>
        </div>
      </section>

      <section id="spaces" className="section-y scroll-mt-24 bg-sand/45">
        <div className="container-site">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-end">
            <div>
              <p className="eyebrow text-mist">{t("common.category")}</p>
              <h2 className="mt-4 max-w-2xl text-display-lg">{t("overview.spacesTitle")}</h2>
            </div>
            <p className="max-w-md text-mist sm:justify-self-end">{t("overview.spacesLede")}</p>
          </div>

          <ul className="mt-12 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {harmonySpaces.map((space, index) => (
              <Reveal as="li" key={space.slug} delay={index * 100} className="group">
                <Link href={`/experiences/harmony/${space.slug}`} className="block">
                  <div className="overflow-hidden">
                    <ImagePlaceholder
                      src={space.image}
                      alt={t(`spaces.${space.slug}.imageAlt`)}
                      ratio="4 / 5"
                    />
                  </div>
                  <p className="eyebrow mt-6 text-mist">{t("common.category")}</p>
                  <h3 className="mt-2 text-display-md transition-colors duration-300 group-hover:text-mist">
                    {t(`spaces.${space.slug}.name`)}
                  </h3>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-mist">
                    {t(`spaces.${space.slug}.shortDescription`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 border-b border-ink/40 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors group-hover:border-ink">
                    {t("overview.exploreSpace")} <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-[#1A2E35] text-ivory">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-sage">{t("overview.eyebrow")}</p>
            <h2 className="mt-5 max-w-3xl text-display-lg">{t("overview.ctaTitle")}</h2>
            <p className="mt-5 max-w-xl text-ivory/70">{t("overview.ctaText")}</p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
            <ButtonLink href="#spaces" variant="outline-light" arrow>{t("overview.exploreButton")}</ButtonLink>
            <ButtonLink href={harmonyInquiryHref(t("overview.inquiryMessage"))} variant="light" arrow>
              {t("common.requestAvailability")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: nav("home"), path: "/" },
          { name: nav("concierge"), path: "/concierge" },
          { name: t("overview.title"), path: "/experiences/harmony" },
        ], locale)}
      />
    </>
  );
}

export async function HarmonySpacePage({
  locale: rawLocale,
  slug,
}: {
  locale: string;
  slug: HarmonySpaceSlug;
}) {
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "harmony" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const space = getHarmonySpace(slug);
  if (!space) return null;

  const name = t(`spaces.${slug}.name`);
  const inquiryMessage = t("common.spaceInquiryMessage", { name });
  const hasSchedule = space.pricing.rates.some((rate) => rate.schedule !== null);
  const hasAmenities = space.amenities.length > 0;
  const priceFormatter = new Intl.NumberFormat(`${locale}-CR`, {
    style: "currency",
    currency: space.pricing.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

  return (
    <>
      <section className="pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="container-site">
          <Breadcrumbs
            label={t("common.category")}
            items={[
              { name: nav("home"), href: "/" },
              { name: nav("concierge"), href: "/concierge" },
              { name: t("overview.title"), href: "/experiences/harmony" },
              { name },
            ]}
          />
          <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Reveal variant="fade">
                <p className="eyebrow text-mist">{t("common.category")} · {t("common.location")}</p>
                <h1 className="mt-5 text-display-xl">{name}</h1>
                <p className="mt-6 text-display-sm text-mist">{t(`spaces.${slug}.shortDescription`)}</p>
              </Reveal>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={harmonyInquiryHref(inquiryMessage)} arrow>
                  {t("common.requestAvailability")}
                </ButtonLink>
                <ButtonLink href="/experiences/harmony" variant="text">
                  {t("common.backToHarmony")}
                </ButtonLink>
              </div>
            </div>
            <Reveal variant="mask" className="lg:col-span-6 lg:col-start-7">
              <ImagePlaceholder
                src={space.image}
                alt={t(`spaces.${slug}.imageAlt`)}
                label={t("imagePlaceholder")}
                priority
                ratio="4 / 3"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y-sm border-y border-line bg-sand/45">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-mist">{t("common.category")}</p>
            <h2 className="mt-4 text-display-md">{t("common.spaceDescriptionTitle")}</h2>
            <Paragraphs text={t(`spaces.${slug}.description`)} className="mt-7 max-w-2xl text-lede text-charcoal/85" />
          </div>
          <div className="space-y-10 lg:col-span-5 lg:col-start-8">
            {space.activityGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-display-sm">{t(`common.${group.title}`)}</h3>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {group.items.map((activity) => (
                    <li key={activity} className="flex items-start gap-4 py-4 text-charcoal">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1A2E35]" />
                      {t(`spaces.${slug}.${group.title === "activitiesTitle" ? "activities" : group.title === "professionalTitle" ? "professionalActivities" : "socialActivities"}.${activity}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-line pt-6">
              <p className="eyebrow text-mist">{t("common.locationLabel")}</p>
              <p className="mt-2 text-charcoal">{t("common.location")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y-sm bg-sand/45">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className={hasAmenities ? "lg:col-span-7" : "lg:col-span-8"}>
            <p className="eyebrow text-mist">{t("common.pricingEyebrow")}</p>
            <h2 className="mt-4 text-display-md">{t("common.pricingTitle")}</h2>
            <div className="mt-7 overflow-x-auto">
              <table className={`w-full border-collapse text-left ${hasSchedule ? "min-w-[34rem]" : "min-w-[24rem]"}`}>
                <caption className="sr-only">{t("common.pricingCaption")}</caption>
                <thead className="border-y border-line text-[0.7rem] uppercase tracking-[0.12em] text-mist">
                  <tr>
                    <th scope="col" className="py-4 pr-6 font-semibold">{t("common.rentalOption")}</th>
                    {hasSchedule && (
                      <th scope="col" className="py-4 pr-6 font-semibold">{t("common.schedule")}</th>
                    )}
                    <th scope="col" className="py-4 text-right font-semibold">{t("common.price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {space.pricing.rates.map((rate) => (
                    <tr key={rate.label} className="border-b border-line">
                      <th scope="row" className="py-5 pr-6 font-medium text-charcoal">
                        {t(`common.pricingOptions.${rate.label}`)}
                      </th>
                      {hasSchedule && (
                        <td className="py-5 pr-6 text-mist">
                          {rate.schedule ? t(`common.pricingSchedules.${rate.schedule}`) : ""}
                        </td>
                      )}
                      <td className="py-5 text-right font-medium tabular-nums text-ink">
                        {priceFormatter.format(rate.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-mist">
              {t("common.pricingVatNote")}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
              {t("common.pricingAvailabilityNote")}
            </p>
          </div>

          {hasAmenities && (
            <aside className="lg:col-span-5">
              {space.capacity !== null && (
                <div className="border-y border-line py-6">
                  <p className="eyebrow text-mist">{t("common.capacityTitle")}</p>
                  <p className="mt-2 text-display-sm">
                    {t("common.capacityValue", { count: space.capacity })}
                  </p>
                </div>
              )}
              <h3 className="mt-8 text-display-sm">{t("common.amenitiesTitle")}</h3>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {space.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-4 py-4 text-charcoal">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1A2E35]" />
                    {t(`common.amenities.${amenity}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-mist">{t("common.separateCateringNote")}</p>
            </aside>
          )}
        </div>
      </section>

      <section className="section-y-sm">
        <div className="container-site">
          <h2 className="mb-8 text-display-md">{t("common.gallery")}</h2>
          <MediaGallery
            title={name}
            videos={[]}
            images={space.galleryImages.map((src, index) => {
              const alt = t(`spaces.${slug}.${index === 0 ? "galleryAlt" : "galleryAlt2"}`);
              return { src, alt: { en: alt, es: alt } };
            })}
          />
        </div>
      </section>

      <section className="section-y bg-[#1A2E35] text-ivory">
        <div className="container-site grid gap-8 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="eyebrow text-sage">{t("common.category")}</p>
            <h2 className="mt-4 text-display-md">{t("common.availabilityTitle")}</h2>
            <p className="mt-4 max-w-xl text-ivory/70">{t("common.availabilityText")}</p>
          </div>
          <div className="sm:justify-self-end">
            <ButtonLink href={harmonyInquiryHref(inquiryMessage)} variant="light" arrow>
              {t("common.requestAvailability")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: nav("home"), path: "/" },
          { name: nav("concierge"), path: "/concierge" },
          { name: t("overview.title"), path: "/experiences/harmony" },
          { name, path: `/experiences/harmony/${slug}` },
        ], locale)}
      />
    </>
  );
}
