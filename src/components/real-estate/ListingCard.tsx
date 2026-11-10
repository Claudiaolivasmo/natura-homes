import { BedDouble, Bath, Ruler, Trees } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { formatArea, formatNumber, formatPrice } from "@/lib/format";
import type { ListingCardData } from "@/lib/view-models";
import type { ListingStatus } from "@/schemas/content";

export function StatusBadge({ status, className = "" }: { status: ListingStatus; className?: string }) {
  const t = useTranslations("realEstate.status");
  const styles: Record<ListingStatus, string> = {
    available: "bg-ivory text-ink",
    "under-contract": "bg-sand text-ink",
    sold: "bg-ink text-ivory",
  };
  return <span className={`eyebrow inline-block px-3 py-1.5 ${styles[status]} ${className}`}>{t(status)}</span>;
}

/** Price shown only for listings that are not sold, and only when a real amount exists. */
export function ListingPrice({ listing, className = "" }: { listing: Pick<ListingCardData, "status" | "price">; className?: string }) {
  const t = useTranslations("realEstate");
  const locale = useLocale();
  if (listing.status === "sold") return <p className={className}>{t("status.sold")}</p>;
  if (listing.price.amount == null) return <p className={className}>{t("priceOnRequest")}</p>;
  return <p className={className}>{formatPrice(listing.price.amount, listing.price.currency, locale)}</p>;
}

export function ListingCard({ listing, headingLevel: H = "h3" }: { listing: ListingCardData; headingLevel?: "h2" | "h3" }) {
  const t = useTranslations("realEstate");
  const locale = useLocale();


  return (
    <article className="group relative">
      <div className="relative">
        <MediaFrame image={listing.image} locale={locale} ratio="5 / 4" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className={listing.status === "sold" ? "grayscale-[35%]" : ""} />
        <StatusBadge status={listing.status} className="absolute left-4 top-4" />
      </div>
      <p className="eyebrow mt-5 text-mist">
        {[listing.propertyType ? (t.has(`types.${listing.propertyType}`) ? t(`types.${listing.propertyType}`) : listing.propertyType) : null, listing.location].filter(Boolean).join("  ·  ")}
      </p>
      <H className="mt-2 text-display-sm">
        <Link href={`/real-estate/${listing.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {listing.name}
        </Link>
      </H>
      <ListingPrice listing={listing} className="mt-2 font-display text-[1.375rem] text-ink" />
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-mist" aria-label={locale === "es" ? "Características" : "Property features"}>
        {listing.bedrooms != null && <span className="inline-flex items-center gap-1.5"><BedDouble className="size-4" strokeWidth={1.5} aria-hidden="true" />{listing.bedrooms}</span>}
        {listing.bathrooms != null && <span className="inline-flex items-center gap-1.5"><Bath className="size-4" strokeWidth={1.5} aria-hidden="true" />{formatNumber(listing.bathrooms, locale)}</span>}
        {listing.constructionArea != null && <span className="inline-flex items-center gap-1.5"><Ruler className="size-4" strokeWidth={1.5} aria-hidden="true" />{formatArea(listing.constructionArea, locale)}</span>}
        {listing.landArea != null && <span className="inline-flex items-center gap-1.5"><Trees className="size-4" strokeWidth={1.5} aria-hidden="true" />{formatArea(listing.landArea, locale)}</span>}
      </div>
    </article>
  );
}
