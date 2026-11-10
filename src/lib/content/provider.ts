import type { Experience, RealEstateListing, Testimonial, VacationRental } from "@/schemas/content";

/**
 * Every content source (JSON today; Sanity, a PMS, a channel manager or a
 * database later) implements this interface. Pages and components only ever
 * talk to the repository in ./index.ts, never to a concrete source.
 */
export interface ContentProvider {
  listVacationRentals(): Promise<VacationRental[]>;
  listRealEstate(): Promise<RealEstateListing[]>;
  listExperiences(): Promise<Experience[]>;
  listTestimonials(): Promise<Testimonial[]>;
}
