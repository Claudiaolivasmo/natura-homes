import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { editorial } from "@/config/media";
import { PageHero } from "@/components/layout/PageHero";
import { ListingCatalog } from "@/components/real-estate/ListingCatalog";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRealEstateListings } from "@/lib/content";
import { toListingCard } from "@/lib/view-models";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

const PATH = "/real-estate";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: PATH, title: t("realEstateTitle"), description: t("realEstateDescription"), image: editorial.realEstateHero?.src });
}

export default async function RealEstatePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "realEstate" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const listings = (await getRealEstateListings()).map(toListingCard);
  const wa = whatsappUrl(tw("realEstateGeneral"));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { em: (c) => <em className="font-light italic">{c}</em> })}
        lede={t("hero.lede")}
        image={editorial.realEstateHero}
        locale={locale}
        variant="fullBleed"
        tone="ink"
        actions={
          <>
            <ButtonLink href="/about-contact#contact" variant="light" arrow>{t("hero.cta")}</ButtonLink>
            {wa && <ButtonLink href={wa} external variant="text-light">WhatsApp</ButtonLink>}
          </>
        }
      />
      <section className="pb-28 sm:pb-36">
        <div className="container-site">
          <ListingCatalog listings={listings} />
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: tNav("home"), path: "/" }, { name: tNav("realEstate"), path: PATH }], locale)} />
    </>
  );
}
