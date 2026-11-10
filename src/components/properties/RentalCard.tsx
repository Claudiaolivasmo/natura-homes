import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { formatNumber } from "@/lib/format";
import type { RentalCardData } from "@/lib/view-models";

interface RentalCardProps {
  rental: RentalCardData;
  ratio?: string;
  sizes?: string;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}

/** Works in both server and client trees (no client-only hooks). */
export function RentalCard({ rental, ratio = "4 / 5", sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", headingLevel: H = "h3", priority }: RentalCardProps) {
  const t = useTranslations("rentals");
  const locale = useLocale();

  const facts = [
    rental.bedrooms != null && t("bedroomsCount", { count: rental.bedrooms }),
    rental.bathrooms != null && t("bathroomsCount", { count: rental.bathrooms, formatted: formatNumber(rental.bathrooms, locale) }),
    rental.maxGuests != null && t("guestsCount", { count: rental.maxGuests }),
  ].filter(Boolean) as string[];

  return (
    <article className="group relative">
      <MediaFrame image={rental.image} locale={locale} ratio={ratio} sizes={sizes} priority={priority} />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="eyebrow text-mist">{rental.location}</p>
          <H className="mt-2 text-display-sm">
            <Link href={`/vacation-rentals/${rental.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {rental.name}
            </Link>
          </H>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.25}
          className="mt-6 size-6 shrink-0 text-ink transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      {facts.length > 0 && (
        <p className="mt-3 text-[0.875rem] text-mist">{facts.join("  ·  ")}</p>
      )}
      {rental.keyFeatures.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-ink/80">
          {rental.keyFeatures.map((f) => (
            <li key={f} className="before:mr-2 before:inline-block before:size-1 before:rounded-full before:bg-sage-deep before:align-middle before:content-['']">
              {f}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink">
        <span className="link-line">{t("viewProperty")}</span>
      </p>
    </article>
  );
}
