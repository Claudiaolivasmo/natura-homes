import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, BedDouble, Bath, Ruler, Trees, House, ArrowDown } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getRealEstateListing, getRealEstateListings, getRelatedRealEstate } from "@/lib/content";
import { asLocale, localize } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { formatArea, formatLocation, formatNumber } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { toListingCard } from "@/lib/view-models";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/animations/Reveal";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { ListingCard, ListingPrice, StatusBadge } from "@/components/real-estate/ListingCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SetWhatsAppMessage } from "@/components/whatsapp/WhatsAppContext";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const items = await getRealEstateListings();
  return routing.locales.flatMap((locale) => items.map((l) => ({ locale, slug: l.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  const listing = await getRealEstateListing(slug);
  if (!listing) return {};
  return buildMetadata({
    locale,
    path: `/real-estate/${listing.slug}`,
    title: localize(listing.seo?.title, locale) || `${listing.name}, ${listing.location.city}`,
    description: localize(listing.seo?.description, locale) || localize(listing.summary, locale) || localize(listing.description, locale).slice(0, 160) || listing.name,
    image: listing.images[0]?.src,
  });
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  setRequestLocale(locale);
  const listing = await getRealEstateListing(slug);
  if (!listing) notFound();

  const t = await getTranslations({ locale, namespace: "realEstate" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const related = await getRelatedRealEstate(listing.slug, 3);
  const sold = listing.status === "sold";

  const waMessage = tw("listingMessage", { name: listing.name });
  const wa = whatsappUrl(waMessage);
  const description = localize(listing.description, locale);
  const features = listing.features.map((f) => localize(f, locale)).filter(Boolean);
  const locationLabel = formatLocation(listing.location);
  const typeLabel = listing.propertyType ? (t.has(`types.${listing.propertyType}`) ? t(`types.${listing.propertyType}`) : listing.propertyType) : null;


  const coords = listing.location.coordinates;
  const crumbs = [
    { name: tNav("home"), path: "/" },
    { name: tNav("realEstate"), path: "/real-estate" },
    { name: listing.name, path: `/real-estate/${listing.slug}` },
  ];

  return (
    <>
      <SetWhatsAppMessage message={waMessage} />

      {/* Immersive, editorial introduction: photography and story before specifications. */}
      <section className="relative isolate min-h-[75svh] overflow-hidden bg-ink text-ivory sm:min-h-[88svh]">
        <div className="absolute inset-0">
          <MediaFrame image={listing.images[0]} locale={locale} ratio="16 / 9" priority sizes="100vw" zoom={false} className={`!h-full !w-full !aspect-auto ${sold ? "grayscale-[35%]" : ""}`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
        <div className="container-site relative flex min-h-[75svh] flex-col justify-end pb-16 pt-28 sm:min-h-[88svh] sm:pb-24">
          <Reveal variant="fade"><p className="eyebrow mb-6 flex items-center gap-2 text-white/80"><MapPin className="size-4" strokeWidth={1.5} aria-hidden="true" />{locationLabel}, {listing.location.country}</p></Reveal>
          <Reveal delay={80}><h1 className="max-w-5xl font-display text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.98] tracking-tight text-white">{listing.name}</h1></Reveal>
          {localize(listing.summary, locale) && <Reveal delay={140}><p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-2xl">{localize(listing.summary, locale)}</p></Reveal>}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ListingPrice listing={listing} className="font-display text-3xl text-white sm:text-4xl" />
            <a href="#property-story" className="inline-flex items-center gap-2 border-b border-white/70 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">{locale === "es" ? "Descubrir la propiedad" : "Discover the property"}<ArrowDown className="size-4" /></a>
          </div>
        </div>
      </section>

      {/* Practical details stay visible, accessible and never fabricated. */}
      <section className="border-b border-line bg-ivory" aria-label={locale === "es" ? "Características de la propiedad" : "Property at a glance"}>
        <div className="container-site grid grid-cols-2 gap-x-6 gap-y-7 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:py-11">
          {[
            typeLabel && { icon: House, label: t("detail.type"), value: typeLabel },
            listing.bedrooms != null && { icon: BedDouble, label: t("detail.bedrooms"), value: String(listing.bedrooms) },
            listing.bathrooms != null && { icon: Bath, label: t("detail.bathrooms"), value: formatNumber(listing.bathrooms, locale) },
            listing.constructionArea != null && { icon: Ruler, label: t("detail.construction"), value: formatArea(listing.constructionArea, locale) },
            listing.landArea != null && { icon: Trees, label: t("detail.land"), value: formatArea(listing.landArea, locale) },
          ].filter((item): item is { icon: typeof House; label: string; value: string } => Boolean(item)).map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <Icon aria-hidden="true" strokeWidth={1.3} className="size-7 shrink-0 text-ink/75" />
              <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-mist">{label}</p><p className="mt-1 font-display text-xl text-ink sm:text-2xl">{value}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="property-story" className="section-y scroll-mt-20 bg-white">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-mist">NATURA HOMES · {locale === "es" ? "PROPIEDADES SELECCIONADAS" : "CURATED REAL ESTATE"}</p>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,4.5vw,5rem)] leading-[1.05] text-ink">{locale === "es" ? "Un lugar con una historia propia" : "A place with a story of its own"}</h2>
            {description ? <Paragraphs text={description} className="mt-8 text-lede leading-relaxed text-charcoal/90" /> : <p className="mt-8 text-mist">{t("detail.descriptionPending")}</p>}
          </Reveal>
          <Reveal variant="mask" className="lg:col-span-7">
            {listing.images[1] ? <MediaFrame image={listing.images[1]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 55vw, 100vw" zoom={false} /> : <MediaFrame image={listing.images[0]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 55vw, 100vw" zoom={false} />}
          </Reveal>
        </div>
      </section>

      <section className="section-y-sm bg-sand/40">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {sold && <p className="mb-10 border-l-2 border-ink bg-sand px-6 py-4 text-charcoal">{t("detail.soldNotice")}</p>}



            {features.length > 0 && (
              <div className="mt-14">
                <p className="eyebrow text-mist">{locale === "es" ? "LOS DETALLES" : "THE DETAILS"}</p><h2 className="mt-4 text-display-md">{t("detail.features")}</h2>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {features.map((f) => <li key={f} className="border-b border-line py-4 text-charcoal">{f}</li>)}
                </ul>
              </div>
            )}

            <div className="mt-14">
              <h2 className="text-display-sm">{t("detail.location")}</h2>
              <p className="mt-4 text-charcoal">{locationLabel}, {listing.location.region}, {listing.location.country}</p>
              {coords ? (
                <div className="mt-6 aspect-[16/10] w-full overflow-hidden border border-line bg-sand">
                  <iframe
                    title={t("detail.mapTitle", { name: listing.name })}
                    src={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=14&output=embed`}
                    className="size-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <p className="mt-2 text-[0.875rem] text-mist">{t("detail.locationNote")}</p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="listing-contact">
            <div className="border border-line bg-white/60 p-7 sm:p-9 lg:sticky lg:top-28">
              <h2 id="listing-contact" className="text-display-sm">{sold ? t("detail.contactSoldTitle") : t("detail.contactTitle")}</h2>
              <p className="mt-3 text-[0.9375rem] text-mist">{sold ? t("detail.contactSoldText") : t("detail.contactText")}</p>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-ink px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-ink-soft">
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              )}
              <a href="#inquiry" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-ink/30 px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink">
                {t("detail.sendInquiry")}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {listing.images.length + listing.videos.length > 1 && (
        <section className="pb-20" aria-labelledby="gallery-heading">
          <div className="container-site">
            <p className="eyebrow mb-4 text-mist">{locale === "es" ? "RECORRE LOS ESPACIOS" : "EXPLORE THE SPACES"}</p><h2 id="gallery-heading" className="mb-10 text-display-md">{t("detail.gallery")}</h2>
            <MediaGallery images={listing.images} videos={listing.videos} title={listing.name} />
          </div>
        </section>
      )}

      <section id="inquiry" className="section-y scroll-mt-24 bg-sand/60">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-mist">{t("detail.inquiryEyebrow")}</p>
            <h2 className="mt-5 text-display-md">{t("detail.inquiryTitle", { name: listing.name })}</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <InquiryForm subject="listing" slug={listing.slug} itemName={listing.name} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <h2 className="text-display-md">{t("detail.related")}</h2>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <li key={r.slug}><ListingCard listing={toListingCard(r)} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbSchema(crumbs, locale)} />
    </>
  );
}
