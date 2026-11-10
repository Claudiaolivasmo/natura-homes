import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getRelatedVacationRentals, getVacationRental, getVacationRentals } from "@/lib/content";
import { localize, asLocale } from "@/lib/i18n-content";
import { buildMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { formatLocation, formatNumber } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { toRentalCard } from "@/lib/view-models";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/animations/Reveal";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { FactsBar, type Fact } from "@/components/ui/FactsBar";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { ButtonLink } from "@/components/ui/Button";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { RentalCard } from "@/components/properties/RentalCard";
import { AmenityList } from "@/components/properties/AmenityList";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SetWhatsAppMessage } from "@/components/whatsapp/WhatsAppContext";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const rentals = await getVacationRentals();
  return routing.locales.flatMap((locale) => rentals.map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  const rental = await getVacationRental(slug);
  if (!rental) return {};
  const t = await getTranslations({ locale, namespace: "rentals.detail" });
  const description =
    localize(rental.seo?.description, locale) ||
    localize(rental.summary, locale) ||
    localize(rental.description, locale).slice(0, 160) ||
    t("metaFallback", { name: rental.name, location: formatLocation(rental.location) });
  return buildMetadata({
    locale,
    path: `/vacation-rentals/${rental.slug}`,
    title: localize(rental.seo?.title, locale) || `${rental.name}, ${rental.location.city}`,
    description,
    image: rental.images[0]?.src,
  });
}

export default async function RentalPage({ params }: { params: Promise<Params> }) {
  const { locale: l, slug } = await params;
  const locale = asLocale(l);
  setRequestLocale(locale);
  const rental = await getVacationRental(slug);
  if (!rental) notFound();

  const t = await getTranslations({ locale, namespace: "rentals" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const related = await getRelatedVacationRentals(rental.slug, 3);
  const waMessage = tw("rentalMessage", { name: rental.name });
  const wa = whatsappUrl(waMessage);
  const description = localize(rental.description, locale);
  const summary = localize(rental.summary, locale);
  const locationLabel = formatLocation(rental.location);

  const facts: Fact[] = [];
  if (rental.bedrooms != null) facts.push({ label: t("detail.bedrooms"), value: String(rental.bedrooms) });
  if (rental.bathrooms != null) facts.push({ label: t("detail.bathrooms"), value: formatNumber(rental.bathrooms, locale) });
  if (rental.maxGuests != null) facts.push({ label: t("detail.guests"), value: String(rental.maxGuests) });
  if (rental.checkIn) facts.push({ label: t("detail.checkIn"), value: rental.checkIn });
  if (rental.checkOut) facts.push({ label: t("detail.checkOut"), value: rental.checkOut });

  const coords = rental.location.coordinates;
  const mapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${locationLabel}, ${rental.location.region}, ${rental.location.country}`)}`;

  const keyFeatures = rental.keyFeatures.map((f) => localize(f, locale)).filter(Boolean);
  const houseRules = rental.houseRules.map((r) => localize(r, locale)).filter(Boolean);
  const hasMedia = rental.images.length + rental.videos.length > 1;

  const crumbs = [
    { name: tNav("home"), path: "/" },
    { name: tNav("vacationRentals"), path: "/vacation-rentals" },
    { name: rental.name, path: `/vacation-rentals/${rental.slug}` },
  ];

  // Only emitted when there is enough real data to describe the property honestly.
  const lodgingLd =
    rental.images.length > 0 && description
      ? {
          "@context": "https://schema.org",
          "@type": "VacationRental",
          name: rental.name,
          description,
          url: absoluteUrl(localizedPath(locale, `/vacation-rentals/${rental.slug}`)),
          image: rental.images.slice(0, 8).map((i) => (i.src.startsWith("http") ? i.src : absoluteUrl(i.src))),
          address: { "@type": "PostalAddress", addressLocality: rental.location.city, addressRegion: rental.location.region, addressCountry: "CR" },
          ...(coords ? { latitude: coords.latitude, longitude: coords.longitude } : {}),
          ...(rental.maxGuests ? { containsPlace: { "@type": "Accommodation", occupancy: { "@type": "QuantitativeValue", value: rental.maxGuests } } } : {}),
        }
      : null;

  return (
    <>
      <SetWhatsAppMessage message={waMessage} />

      <section className="pt-10 sm:pt-14">
        <div className="container-site">
          <Breadcrumbs label={t("detail.breadcrumb")} items={[{ name: tNav("home"), href: "/" }, { name: tNav("vacationRentals"), href: "/vacation-rentals" }, { name: rental.name }]} />
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal variant="fade">
                <p className="eyebrow flex items-center gap-3 text-mist">
                  <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                  {locationLabel}, {rental.location.country}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 text-display-xl">{rental.name}</h1>
              </Reveal>
            </div>
            {summary && (
              <Reveal delay={160} className="lg:col-span-4">
                <p className="text-lede text-mist">{summary}</p>
              </Reveal>
            )}
          </div>
        </div>
        <Reveal variant="mask" className="container-site mt-12">
          <MediaFrame image={rental.images[0]} locale={locale} ratio="16 / 9" priority sizes="(min-width: 1408px) 1312px, 100vw" zoom={false} tone="sage" className="max-sm:!aspect-[4/3]" />
        </Reveal>
      </section>

      <section className="section-y-sm">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {facts.length > 0 ? <FactsBar facts={facts} /> : <p className="border-y border-line py-6 text-mist">{t("detail.detailsOnRequest")}</p>}

            <div className="mt-14">
              <h2 className="text-display-sm">{t("detail.about")}</h2>
              {description ? (
                <Paragraphs text={description} className="mt-6 text-lede text-charcoal/90" />
              ) : (
                <p className="mt-6 text-mist">{t("detail.descriptionPending")}</p>
              )}
            </div>

            {keyFeatures.length > 0 && (
              <div className="mt-14">
                <h2 className="text-display-sm">{t("detail.highlights")}</h2>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {keyFeatures.map((f) => (
                    <li key={f} className="border-b border-line py-4 text-charcoal">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {rental.amenities.length > 0 && (
              <div className="mt-14">
                <h2 className="text-display-sm">{t("detail.amenities")}</h2>
                <AmenityList amenities={rental.amenities} />
              </div>
            )}

            {houseRules.length > 0 && (
              <div className="mt-14">
                <h2 className="text-display-sm">{t("detail.houseRules")}</h2>
                <ul className="mt-6 space-y-3 text-charcoal">
                  {houseRules.map((r) => (
                    <li key={r} className="flex gap-4">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sage-deep" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-14">
              <h2 className="text-display-sm">{t("detail.location")}</h2>
              <p className="mt-4 text-charcoal">
                {locationLabel}, {rental.location.region}, {rental.location.country}
              </p>
              <p className="mt-2 text-[0.875rem] text-mist">{t("detail.locationNote")}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-5 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink">
                {t("detail.openMap")}
              </a>
            </div>
          </div>

          {/* Booking + WhatsApp */}
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="booking-heading">
            <div className="lg:sticky lg:top-28">
              <div className="border border-line bg-white/60 p-7 sm:p-9">
                <h2 id="booking-heading" className="text-display-sm">{t("detail.bookingTitle")}</h2>
                <p className="mt-3 text-[0.9375rem] text-mist">{t("detail.bookingDescription")}</p>
                <div className="mt-7 flex flex-col gap-3">
                  {rental.airbnbUrl.trim() && (
                    <ButtonLink href={rental.airbnbUrl} external arrow>
                      {t("detail.checkAvailability")}
                    </ButtonLink>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink/30 px-7 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink">
                      <WhatsAppIcon className="size-4" />
                      {t("detail.askWhatsApp")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {hasMedia && (
        <section className="pb-20" aria-labelledby="gallery-heading">
          <div className="container-site">
            <h2 id="gallery-heading" className="mb-8 text-display-sm">{t("detail.gallery")}</h2>
            <MediaGallery images={rental.images} videos={rental.videos} title={rental.name} />
          </div>
        </section>
      )}

      <section id="inquiry" className="section-y scroll-mt-24 bg-sand/60">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-mist">{t("detail.inquiryEyebrow")}</p>
            <h2 className="mt-5 text-display-md">{t("detail.inquiryTitle", { name: rental.name })}</h2>
            <p className="mt-6 text-mist">{t("detail.inquiryText")}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <InquiryForm subject="rental" slug={rental.slug} itemName={rental.name} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <h2 className="text-display-md">{t("detail.related")}</h2>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <RentalCard rental={toRentalCard(r, locale)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd data={lodgingLd ? [breadcrumbSchema(crumbs, locale), lodgingLd] : breadcrumbSchema(crumbs, locale)} />
    </>
  );
}
