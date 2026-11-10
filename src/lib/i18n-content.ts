import type { LocalizedText } from "@/schemas/content";
import type { Locale } from "@/i18n/routing";

/** Returns the text in the requested locale, falling back to the other language, then to "". */
export function localize(text: LocalizedText | null | undefined, locale: Locale | string): string {
  if (!text) return "";
  const primary = locale === "es" ? text.es : text.en;
  return (primary && primary.trim()) || text.en || text.es || "";
}

export function asLocale(value: string): Locale {
  return value === "es" ? "es" : "en";
}
