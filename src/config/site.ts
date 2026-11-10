/** Central business configuration. */
export const siteConfig = {
  name: "Natura Homes",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  serviceArea: "La Fortuna, Alajuela, Costa Rica",
  geo: { latitude: 10.4678, longitude: -84.6427 },
  contact: {
    whatsapp: "50685675060",
    whatsappDisplay: "+506 8567 5060",
    whatsappUrl: "https://wa.me/50685675060",
    email: "naturahomescr@gmail.com",
  },
  social: {
    instagram: "https://www.instagram.com/naturahomescr/",
    instagramHandle: "@naturahomescr",
    facebook: "https://www.facebook.com/naturahomescr",
    facebookHandle: "@naturahomescr",
  },
  /**
   * Logo file. Place the supplied `natura-homes-logo` file in /public/branding/
   * and set its real intrinsic width and height here. While `null`, the header
   * shows a plain typographic name instead of an image.
   * `srcLight` is used over dark backgrounds (hero, footer) if provided.
   */
  logo: null as null | { src: string; srcLight?: string; width: number; height: number },
} as const;

export const navItems = [
  { key: "home", href: "/" },
  { key: "propertyManagement", href: "/property-management" },
  { key: "vacationRentals", href: "/vacation-rentals" },
  { key: "concierge", href: "/concierge" },
  { key: "realEstate", href: "/real-estate" },
  { key: "aboutContact", href: "/about-contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];
