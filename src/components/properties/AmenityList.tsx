import { useTranslations } from "next-intl";
import { humanize } from "@/lib/text";

export function AmenityList({ amenities }: { amenities: string[] }) {
  const t = useTranslations("amenities");
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
      {amenities.map((a) => (
        <li key={a} className="border-b border-line py-3.5 text-[0.9375rem] text-charcoal">
          {t.has(a) ? t(a) : humanize(a)}
        </li>
      ))}
    </ul>
  );
}
