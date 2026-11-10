import type { Experience, ImageAsset, RealEstateListing, VacationRental } from "@/schemas/content";
import { localize } from "./i18n-content";
import { formatLocation } from "./format";

/**
 * Slim, serializable shapes for cards and client-side catalogs, so only the
 * fields a card needs are sent to the browser.
 */

export interface RentalCardData {
  slug: string;
  name: string;
  location: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  amenities: string[];
  keyFeatures: string[];
  image: ImageAsset | null;
  featured: boolean;
}

export function toRentalCard(r: VacationRental, locale: string): RentalCardData {
  return {
    slug: r.slug,
    name: r.name,
    location: formatLocation(r.location),
    city: r.location.city,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    maxGuests: r.maxGuests,
    amenities: r.amenities,
    keyFeatures: r.keyFeatures.map((f) => localize(f, locale)).filter(Boolean).slice(0, 3),
    image: r.images[0] ?? null,
    featured: r.featured,
  };
}

export interface ListingCardData {
  slug: string;
  name: string;
  location: string;
  city: string;
  status: RealEstateListing["status"];
  propertyType: string | null;
  price: RealEstateListing["price"];
  bedrooms: number | null;
  bathrooms: number | null;
  landArea: number | null;
  constructionArea: number | null;
  image: ImageAsset | null;
  featured: boolean;
}

export function toListingCard(l: RealEstateListing): ListingCardData {
  return {
    slug: l.slug,
    name: l.name,
    location: formatLocation(l.location),
    city: l.location.city,
    status: l.status,
    propertyType: l.propertyType,
    price: l.price,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    landArea: l.landArea,
    constructionArea: l.constructionArea,
    image: l.images[0] ?? null,
    featured: l.featured,
  };
}

export interface ExperienceCardData {
  slug: string;
  title: string;
  summary: string;
  category: Experience["category"];
  duration: string;
  image: ImageAsset | null;
  pricing: Experience["pricing"];
  legacyPrice: Experience["price"];
}

export function toExperienceCard(e: Experience, locale: string): ExperienceCardData {
  return {
    slug: e.slug,
    title: localize(e.title, locale),
    summary: localize(e.summary, locale),
    category: e.category,
    duration: localize(e.duration, locale),
    image: e.images[0] ?? null,
    pricing: e.pricing,
    legacyPrice: e.price,
  };
}
