import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { withBasePath } from "@/config/paths";
import { routing, type Locale } from "@/i18n/routing";

export function absoluteUrl(path: string) {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${withBasePath(withLeadingSlash)}`;
}

/** Path without locale, e.g. "/vacation-rentals/volterra-house" or "/" */
export function localizedPath(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

interface BuildMetadataArgs {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  noIndex?: boolean;
}

export function buildMetadata({ locale, path, title, description, image, noIndex }: BuildMetadataArgs): Metadata {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l === "en" ? "en" : "es-CR"] = absoluteUrl(localizedPath(l, path));
  languages["x-default"] = absoluteUrl(localizedPath(routing.defaultLocale as Locale, path));

  const url = absoluteUrl(localizedPath(locale, path));
  const ogImage = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_CR" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_CR"],
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
