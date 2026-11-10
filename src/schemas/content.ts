import { z } from "zod";

/* ---------- Shared primitives ---------- */

export const localizedText = z.object({
  en: z.string(),
  es: z.string(),
});

const optionalLocalized = localizedText.nullable().optional();

/** Local files under /public (no traversal) or https URLs only. */
export const mediaSrc = z
  .string()
  .refine(
    (v) => (v.startsWith("/") && !v.includes("..") && !v.startsWith("//")) || v.startsWith("https://"),
    { message: "Media src must be a /public path or an https URL" },
  );

export const imageSchema = z.object({
  src: mediaSrc,
  alt: localizedText,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const videoSchema = z.object({
  src: mediaSrc,
  poster: mediaSrc.optional(),
  title: optionalLocalized,
});

export const locationSchema = z.object({
  area: z.string().nullable().optional(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  coordinates: z
    .object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) })
    .nullable()
    .optional(),
});

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs use lowercase letters, numbers and hyphens");

export const seoSchema = z
  .object({
    title: optionalLocalized,
    description: optionalLocalized,
  })
  .nullable()
  .optional();

const baseEntry = {
  id: z.string().min(1),
  slug: slugSchema,
  published: z.boolean(),
  featured: z.boolean().default(false),
  images: z.array(imageSchema).default([]),
  videos: z.array(videoSchema).default([]),
  seo: seoSchema,
};

/* ---------- Vacation rentals ---------- */

export const bookingProviders = ["airbnb", "booking", "vrbo", "direct", "other"] as const;

export const vacationRentalSchema = z.object({
  ...baseEntry,
  name: z.string().min(1),
  location: locationSchema,
  propertyType: z.string().nullable().optional(),
  maxGuests: z.number().int().positive().nullable(),
  bedrooms: z.number().int().nonnegative().nullable(),
  bathrooms: z.number().nonnegative().nullable(),
  summary: optionalLocalized,
  description: localizedText,
  keyFeatures: z.array(localizedText).default([]),
  /** Amenity keys, translated through messages `amenities.<key>`. Unknown keys are shown as-is. */
  amenities: z.array(z.string()).default([]),
  houseRules: z.array(localizedText).default([]),
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
  airbnbUrl: z.string().url().startsWith("https://").or(z.literal("")).default(""),
  booking: z
    .object({
      provider: z.enum(bookingProviders).nullable(),
      url: z.string().url().startsWith("https://").nullable(),
    })
    .default({ provider: null, url: null }),
});

/* ---------- Real estate ---------- */

export const listingStatuses = ["available", "under-contract", "sold"] as const;

export const realEstateListingSchema = z.object({
  ...baseEntry,
  name: z.string().min(1),
  status: z.enum(listingStatuses),
  propertyType: z.string().nullable(),
  location: locationSchema,
  price: z.object({
    amount: z.number().positive().nullable(),
    currency: z.enum(["USD", "CRC"]).default("USD"),
  }),
  bedrooms: z.number().int().nonnegative().nullable(),
  bathrooms: z.number().nonnegative().nullable(),
  /** Square meters */
  landArea: z.number().positive().nullable(),
  /** Square meters */
  constructionArea: z.number().positive().nullable(),
  summary: optionalLocalized,
  description: localizedText,
  features: z.array(localizedText).default([]),
});

/* ---------- Experiences ---------- */

export const experienceCategories = [
  "adventure-nature",
  "wellness",
  "private-dining",
  "transportation",
  "romantic",
  "itineraries",
] as const;

/** Optional future operator offerings. Existing experiences.json entries remain valid. */
export const experienceOperatorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: optionalLocalized,
  images: z.array(imageSchema).default([]),
  duration: optionalLocalized,
  inclusions: z.array(localizedText).default([]),
  price: z.object({ amount: z.number().positive(), currency: z.enum(["USD", "CRC"]).default("USD") }).nullable().optional(),
  availability: optionalLocalized,
  booking: z.object({ url: z.string().url().startsWith("https://").nullable().optional(), notes: optionalLocalized }).nullable().optional(),
});

const experiencePriceBase = {
  currency: z.enum(["USD", "CRC"]).default("USD"),
};

export const experiencePricingSchema = z.discriminatedUnion("type", [
  z.object({ ...experiencePriceBase, type: z.literal("per_person") }).extend({ amount: z.number().nonnegative() }),
  z.object({ ...experiencePriceBase, type: z.literal("per_age") }).extend({
    rates: z.array(z.object({
      category: z.enum(["adult", "child", "infant"]),
      minAge: z.number().int().nonnegative(),
      maxAge: z.number().int().nonnegative().nullable(),
      amount: z.number().nonnegative(),
    })).min(1),
  }),
  z.object({ ...experiencePriceBase, type: z.literal("per_option") }).extend({
    options: z.array(z.object({
      id: z.string().min(1),
      name: localizedText,
      duration: optionalLocalized,
      amount: z.number().nonnegative(),
      confirmed: z.boolean().optional(),
    })).min(1),
  }),
  z.object({ ...experiencePriceBase, type: z.literal("per_group") }).extend({
    amount: z.number().nonnegative(),
    unit: optionalLocalized,
  }),
  z.object({ ...experiencePriceBase, type: z.literal("per_duration") }).extend({
    durations: z.array(z.object({
      id: z.string().min(1),
      duration: localizedText,
      amount: z.number().nonnegative(),
    })).min(1),
  }),
  z.object({ ...experiencePriceBase, type: z.literal("from") }).extend({ amount: z.number().nonnegative() }),
  z.object({ type: z.literal("on_request"), currency: z.enum(["USD", "CRC"]).default("USD") }),
]).superRefine((pricing, ctx) => {
  if (pricing.type !== "per_age") return;
  for (let i = 0; i < pricing.rates.length; i += 1) {
    const current = pricing.rates[i];
    if (!current) continue;
    if (current.maxAge !== null && current.minAge > current.maxAge) {
      ctx.addIssue({ code: "custom", message: "minAge must not exceed maxAge", path: ["rates", i, "minAge"] });
    }
    for (let j = 0; j < i; j += 1) {
      const previous = pricing.rates[j];
      if (!previous) continue;
      if (previous.category === current.category) {
        ctx.addIssue({ code: "custom", message: "Duplicate age category", path: ["rates", i, "category"] });
      }
      if (current.maxAge !== null && previous.maxAge !== null &&
          current.minAge <= previous.maxAge && previous.minAge <= current.maxAge) {
        ctx.addIssue({ code: "custom", message: "Overlapping age ranges", path: ["rates", i] });
      }
    }
  }
});

export const experienceSchema = z.object({
  ...baseEntry,
  category: z.enum(experienceCategories),
  operators: z.array(experienceOperatorSchema).optional(),
  provider: z.object({
    name: z.string().min(1),
    bookingMode: z.enum(["request", "direct", "inquiry"]).optional(),
  }).optional(),
  title: localizedText,
  summary: localizedText,
  description: localizedText,
  duration: optionalLocalized,
  location: z.string().nullable().optional(),
  inclusions: z.array(localizedText).default([]),
  exclusions: z.array(localizedText).default([]),
  price: z
    .object({
      amount: z.number().positive(),
      currency: z.enum(["USD", "CRC"]).default("USD"),
      unit: optionalLocalized,
    })
    .nullable()
    .optional(),
  pricing: experiencePricingSchema.optional(),
  availability: optionalLocalized,
});

/* ---------- Testimonials ---------- */

export const testimonialSchema = z.object({
  id: z.string().min(1),
  published: z.boolean(),
  author: z.string().min(1),
  origin: z.string().nullable().optional(),
  /** The review exactly as written by the guest. Never edited or invented. */
  text: z.string().min(1),
  language: z.enum(["en", "es"]),
  source: z.string().nullable().optional(),
  sourceUrl: z.string().url().startsWith("https://").nullable().optional(),
  date: z.string().nullable().optional(),
  propertySlug: slugSchema.nullable().optional(),
});

/* ---------- Types ---------- */

export type LocalizedText = z.infer<typeof localizedText>;
export type ImageAsset = z.infer<typeof imageSchema>;
export type VideoAsset = z.infer<typeof videoSchema>;
export type Location = z.infer<typeof locationSchema>;
export type VacationRental = z.infer<typeof vacationRentalSchema>;
export type RealEstateListing = z.infer<typeof realEstateListingSchema>;
export type ListingStatus = (typeof listingStatuses)[number];
export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceCategory = (typeof experienceCategories)[number];
export type ExperiencePricing = z.infer<typeof experiencePricingSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
