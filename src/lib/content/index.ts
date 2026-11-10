import "server-only";
import { cache } from "react";
import type { ExperienceCategory } from "@/schemas/content";
import { jsonProvider } from "./json-provider";
import type { ContentProvider } from "./provider";

/** Swap this one line to move to a CMS, PMS or database provider. */
const provider: ContentProvider = jsonProvider;

/* ---------- Vacation rentals ---------- */

export const getVacationRentals = cache(async () =>
  (await provider.listVacationRentals()).filter((r) => r.published),
);

export const getFeaturedVacationRentals = cache(async (limit = 4) =>
  (await getVacationRentals()).filter((r) => r.featured).slice(0, limit),
);

export const getVacationRental = cache(async (slug: string) =>
  (await getVacationRentals()).find((r) => r.slug === slug) ?? null,
);

export async function getRelatedVacationRentals(slug: string, limit = 3) {
  const all = await getVacationRentals();
  const current = all.find((r) => r.slug === slug);
  return all
    .filter((r) => r.slug !== slug)
    .sort((a, b) => Number(b.location.city === current?.location.city) - Number(a.location.city === current?.location.city))
    .slice(0, limit);
}

/* ---------- Real estate ---------- */

export const getRealEstateListings = cache(async () =>
  (await provider.listRealEstate()).filter((l) => l.published),
);

export const getRealEstateListing = cache(async (slug: string) =>
  (await getRealEstateListings()).find((l) => l.slug === slug) ?? null,
);

export async function getRelatedRealEstate(slug: string, limit = 3) {
  return (await getRealEstateListings())
    .filter((l) => l.slug !== slug && l.status !== "sold")
    .slice(0, limit);
}

/* ---------- Experiences ---------- */

export const getExperiences = cache(async () =>
  (await provider.listExperiences()).filter((e) => e.published),
);

export const getFeaturedExperiences = cache(async (limit = 7) =>
  (await getExperiences()).filter((e) => e.featured).slice(0, limit),
);

export const getExperience = cache(async (slug: string) =>
  (await getExperiences()).find((e) => e.slug === slug) ?? null,
);

export async function getRelatedExperiences(slug: string, category: ExperienceCategory, limit = 3) {
  const all = (await getExperiences()).filter((e) => e.slug !== slug);
  return [...all.filter((e) => e.category === category), ...all.filter((e) => e.category !== category)].slice(0, limit);
}

/* ---------- Testimonials ---------- */

export const getTestimonials = cache(async () =>
  (await provider.listTestimonials()).filter((t) => t.published),
);
