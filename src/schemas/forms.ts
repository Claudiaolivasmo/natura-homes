import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js/min";

/**
 * Form schemas are shared by the browser (instant feedback) and the API
 * route (authoritative validation). Error messages are translation keys
 * resolved through `forms.errors.<key>`.
 */

const name = z.string().trim().min(2, "nameRequired").max(120, "tooLong");
const email = z.string().trim().email("emailInvalid").max(200, "tooLong");
const phone = z
  .string()
  .trim()
  .max(30, "tooLong")
  .refine((v) => v === "" || isValidPhoneNumber(v), "phoneInvalid");
const message = z.string().trim().max(3000, "tooLong");
const consent = z.boolean().refine((v) => v === true, "consentRequired");

/** Anti-spam fields: a hidden honeypot and the time the form was rendered. */
const antiSpam = {
  company_website: z.string().max(0).optional(),
  startedAt: z.number().int().positive(),
};

export const consultationSchema = z.object({
  kind: z.literal("consultation"),
  name,
  email,
  whatsapp: phone.refine((v) => v.length > 0, "phoneRequired"),
  propertyLocation: z.string().trim().min(2, "required").max(200, "tooLong"),
  propertyType: z.enum(["house", "villa", "condo", "cabin", "other"], "required"),
  bedrooms: z.string().trim().max(10, "tooLong"),
  rentalStatus: z.enum(["not-rented", "self-managed", "other-manager", "new-build"], "required"),
  message,
  consent: consent,
  ...antiSpam,
});

export const contactSchema = z.object({
  kind: z.literal("contact"),
  name,
  email,
  whatsapp: phone,
  topic: z.enum(["stay", "management", "concierge", "real-estate", "other"], "required"),
  message: message.min(10, "messageRequired"),
  consent: consent,
  ...antiSpam,
});

export const conciergeSchema = z.object({
  kind: z.literal("concierge"),
  name,
  email,
  whatsapp: phone,
  experiences: z.array(z.string().max(80)).min(1, "selectExperience").max(20),
  arrival: z.string().trim().max(20),
  departure: z.string().trim().max(20),
  guests: z.string().trim().max(10),
  pricingSelection: z.string().trim().max(3000).optional(),
  message,
  consent: consent,
  ...antiSpam,
});

export const propertyInquirySchema = z.object({
  kind: z.literal("property-inquiry"),
  /** "rental" or "listing" plus the slug, so the team knows the context */
  subject: z.enum(["rental", "listing", "experience"]),
  slug: z.string().max(120),
  name,
  email,
  whatsapp: phone,
  message: message.min(10, "messageRequired"),
  consent: consent,
  ...antiSpam,
});

export const inquirySchema = z.discriminatedUnion("kind", [
  consultationSchema,
  contactSchema,
  conciergeSchema,
  propertyInquirySchema,
]);

export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ConciergeInput = z.infer<typeof conciergeSchema>;
export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;

/** Browser-side variants: anti-spam fields are attached at submit time, not typed by users. */
export const clientSchemas = {
  consultation: consultationSchema.omit({ startedAt: true, company_website: true }),
  contact: contactSchema.omit({ startedAt: true, company_website: true }),
  concierge: conciergeSchema.omit({ startedAt: true, company_website: true }),
  "property-inquiry": propertyInquirySchema.omit({ startedAt: true, company_website: true }),
};

export type ConsultationValues = z.infer<typeof clientSchemas.consultation>;
export type ContactValues = z.infer<typeof clientSchemas.contact>;
export type ConciergeValues = z.infer<typeof clientSchemas.concierge>;
export type PropertyInquiryValues = z.infer<typeof clientSchemas["property-inquiry"]>;
