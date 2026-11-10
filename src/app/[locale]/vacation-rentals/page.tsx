import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { editorial } from "@/config/media";
import { PageHero } from "@/components/layout/PageHero";
import { RentalCatalog } from "@/components/properties/RentalCatalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { getVacationRentals } from "@/lib/content";
import { toRentalCard } from "@/lib/view-models";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

const PATH = "/vacation-rentals";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: PATH, title: t("rentalsTitle"), description: t("rentalsDescription"), image: editorial.rentalsHero?.src });
}

export default async function VacationRentalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "rentals" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const rentals = (await getVacationRentals()).map((r) => toRentalCard(r, locale));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { em: (c) => <em className="font-light italic">{c}</em> })}
        lede={t("hero.lede")}
        image={editorial.rentalsHero}
        locale={locale}
        variant="fullBleed"
        tone="ink"
      />
      <section className="pb-28 sm:pb-36">
        <div className="container-site">
          <RentalCatalog rentals={rentals} />
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: tNav("home"), path: "/" }, { name: tNav("vacationRentals"), path: PATH }], locale)} />
    </>
  );
}
