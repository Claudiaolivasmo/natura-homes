import type { ImageAsset } from "@/schemas/content";

/**
 * Editorial photography used across the brand pages.
 *
 * Drop files into /public/images/editorial/ and fill in each slot below.
 * While a slot is `null`, the layout renders a toned placeholder of the same
 * proportions, so swapping in real photography never shifts the design.
 * Use `width`/`height` of the original file to keep aspect ratios exact.
 */
type Slot = ImageAsset | null;

export const editorial: Record<
  | "hero"
  | "introPrimary"
  | "introSecondary"
  | "expertiseManagement"
  | "expertiseRentals"
  | "expertiseConcierge"
  | "managementSplit"
  | "ownerCta"
  | "pmHero"
  | "pmDetail"
  | "rentalsHero"
  | "conciergeHero"
  | "realEstateHero"
  | "aboutHero"
  | "aboutDetail",
  Slot
> = {
  hero: null,
  introPrimary: {
    src: "/images/natura-about.webp",
    alt: {
      en: "Luxury vacation rental surrounded by nature in La Fortuna",
      es: "Alojamiento vacacional rodeado de naturaleza en La Fortuna",
    },
  },

  introSecondary: {
    src: "/images/natura-about-2.webp",
    alt: {
      en: "Thoughtfully designed interior at Natura Homes",
      es: "Interior cuidadosamente diseñado en Natura Homes",
    },
  },
  expertiseManagement: null,
  expertiseRentals: null,
  expertiseConcierge: null,
  managementSplit: null,
  ownerCta: null,
  pmHero: {
    src: "/images/pm-hero-v2.webp",
    alt: {
      en: "Property management  at Natura Homes",
      es: "Gestión de propiedades en Natura Homes",
    },
  },
  pmDetail: null,
  rentalsHero: {
    src: "/images/rentals-hero.webp",
    alt: {
      en: "Vacation rentals at Natura Homes",
      es: "Alojamientos vacacionales en Natura Homes",
    },
  },
  conciergeHero: {
    src: "/images/concierge-hero.webp",
    alt: {
      en: "Experiences in La Fortuna curated by Natura Homes",
      es: "Experiencias en La Fortuna curadas por Natura Homes",
    },
  },
  realEstateHero: {
    src: "/images/real-estate-hero-v2.webp",
    alt: {
      en: "Real estate at Natura Homes",
      es: "Bienes raíces en Natura Homes",
    },
  },
  aboutHero: null,
  aboutDetail: null,
};

/* Example once photography is in place:
  hero: {
    src: "/images/editorial/hero-arenal.jpg",
    alt: { en: "Arenal Volcano at first light seen from a private terrace", es: "El Volcán Arenal al amanecer desde una terraza privada" },
    width: 2400, height: 1600,
  },
*/
