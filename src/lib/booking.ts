import type { VacationRental } from "@/schemas/content";

/**
 * Booking integration layer.
 *
 * Today: properties can link out to an external listing (Airbnb, Booking.com,
 * a direct booking page). Nothing here simulates inventory or confirms stays.
 *
 * Later: implement `BookingAdapter` for a channel manager (Guesty, Hostaway,
 * Lodgify...) and return real availability from `getAvailability`. The UI
 * already reads `mode` to decide between "Check Availability" and live dates.
 */

export type BookingMode = "external" | "inquiry";

export interface BookingInfo {
  mode: BookingMode;
  url: string | null;
  provider: VacationRental["booking"]["provider"];
}

export interface AvailabilityQuery {
  slug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingAdapter {
  getAvailability(query: AvailabilityQuery): Promise<{ available: boolean; quote?: { total: number; currency: string } }>;
}

/** No live adapter is connected in the initial release. */
export const bookingAdapter: BookingAdapter | null = null;

export function getBookingInfo(rental: VacationRental): BookingInfo {
  const { provider, url } = rental.booking;
  if (url) return { mode: "external", url, provider };
  return { mode: "inquiry", url: null, provider };
}
