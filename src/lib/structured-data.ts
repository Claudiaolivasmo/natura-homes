import { siteConfig } from "@/config/site";
import { absoluteUrl, localizedPath } from "./seo";
import type { Locale } from "@/i18n/routing";

export function organizationSchema(locale: Locale, description: string) {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: absoluteUrl(localizedPath(locale, "/")),
    description,
    ...(siteConfig.logo ? { logo: absoluteUrl(siteConfig.logo.src) } : {}),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.whatsapp ? { telephone: `+${siteConfig.contact.whatsapp}` } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Fortuna",
      addressRegion: "Alajuela",
      addressCountry: "CR",
    },
    areaServed: { "@type": "Place", name: siteConfig.serviceArea },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function serviceSchema(name: string, description: string, locale: Locale, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(localizedPath(locale, path)),
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "Place", name: siteConfig.serviceArea },
  };
}
