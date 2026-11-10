"use client";

import { useTranslations } from "next-intl";
import { humanize } from "@/lib/text";

/** Translates an amenity key; unknown keys are shown humanized rather than failing. */
export function useAmenityLabel() {
  const t = useTranslations("amenities");
  return (key: string) => (t.has(key) ? t(key) : humanize(key));
}
