import type { Locale } from "@/i18n/routing";

const intlLocale = (locale: Locale | string) => (locale === "es" ? "es-CR" : "en-US");

export function formatPrice(amount: number, currency: "USD" | "CRC", locale: Locale | string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(m2: number, locale: Locale | string) {
  return `${new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 0 }).format(m2)} m²`;
}

export function formatNumber(value: number, locale: Locale | string) {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 }).format(value);
}

export function formatLocation(loc: { area?: string | null; city: string; region?: string }) {
  return [loc.area, loc.city].filter(Boolean).join(", ");
}
