import "server-only";
import type { z } from "zod";
import {
  experienceSchema,
  realEstateListingSchema,
  testimonialSchema,
  vacationRentalSchema,
} from "@/schemas/content";
import type { ContentProvider } from "./provider";

import rentalsData from "@/data/vacation-rentals.json";
import realEstateData from "@/data/real-estate.json";
import experiencesData from "@/data/experiences.json";
import testimonialsData from "@/data/testimonials.json";

/**
 * Validates each record on its own so one malformed entry never takes the
 * whole catalog down. Invalid records are skipped and reported in the
 * server log (and fail `npm run validate:data`).
 */
function parseCollection<T extends z.ZodType>(name: string, schema: T, raw: unknown): z.infer<T>[] {
  if (!Array.isArray(raw)) {
    console.error(`[content] ${name}: expected an array`);
    return [];
  }
  const out: z.infer<T>[] = [];
  const seen = new Set<string>();
  raw.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      console.error(`[content] ${name}[${index}] skipped:`, result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
      return;
    }
    const slug = (result.data as { slug?: string; id: string }).slug ?? (result.data as { id: string }).id;
    if (seen.has(slug)) {
      console.error(`[content] ${name}[${index}] skipped: duplicate slug "${slug}"`);
      return;
    }
    seen.add(slug);
    out.push(result.data);
  });
  return out;
}

export const jsonProvider: ContentProvider = {
  async listVacationRentals() {
    return parseCollection("vacation-rentals", vacationRentalSchema, rentalsData);
  },
  async listRealEstate() {
    return parseCollection("real-estate", realEstateListingSchema, realEstateData);
  },
  async listExperiences() {
    return parseCollection("experiences", experienceSchema, experiencesData);
  },
  async listTestimonials() {
    return parseCollection("testimonials", testimonialSchema, testimonialsData);
  },
};
