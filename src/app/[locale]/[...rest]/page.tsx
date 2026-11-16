import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, rest: ["not-found"] }));
}

// Routes any unknown path inside a locale to the localized not-found page.
export default function CatchAll() {
  notFound();
}
