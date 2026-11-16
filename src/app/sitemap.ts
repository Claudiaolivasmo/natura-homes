import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getExperiences, getRealEstateListings, getVacationRentals } from "@/lib/content";
import { absoluteUrl, localizedPath } from "@/lib/seo";

export const dynamic = "force-static";

const staticPaths = ["/", "/property-management", "/vacation-rentals", "/concierge", "/real-estate", "/about-contact", "/privacy", "/terms"];

function entry(path: string, priority: number): MetadataRoute.Sitemap[number][] {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l === "en" ? "en" : "es-CR", absoluteUrl(localizedPath(l, path))]),
  );
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rentals, listings, experiences] = await Promise.all([getVacationRentals(), getRealEstateListings(), getExperiences()]);
  return [
    ...staticPaths.flatMap((p) => entry(p, p === "/" ? 1 : p.startsWith("/privacy") || p.startsWith("/terms") ? 0.2 : 0.8)),
    ...rentals.flatMap((r) => entry(`/vacation-rentals/${r.slug}`, 0.7)),
    ...experiences.flatMap((e) => entry(`/concierge/${e.slug}`, 0.6)),
    ...listings.flatMap((l) => entry(`/real-estate/${l.slug}`, l.status === "sold" ? 0.3 : 0.6)),
  ];
}
