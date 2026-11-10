import { siteConfig } from "@/config/site";

/** Builds a wa.me URL. Returns null when no number is configured. */
export function whatsappUrl(message?: string): string | null {
  const number = siteConfig.contact.whatsapp;
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
