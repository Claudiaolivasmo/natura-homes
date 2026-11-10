"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ListingCard } from "./ListingCard";
import { buttonClasses } from "@/components/ui/Button";
import type { ListingCardData } from "@/lib/view-models";
import type { ListingStatus } from "@/schemas/content";

type Sort = "featured" | "price-asc" | "price-desc" | "land-desc";
type StatusFilter = "active" | ListingStatus | "all";
const PAGE_SIZE = 9;

export function ListingCatalog({ listings }: { listings: ListingCardData[] }) {
  const t = useTranslations("realEstate");
  const ids = { status: useId(), type: useId(), location: useId(), bedrooms: useId(), sort: useId() };

  const [status, setStatus] = useState<StatusFilter>("active");
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");
  const [bedrooms, setBedrooms] = useState(0);
  const [sort, setSort] = useState<Sort>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const types = useMemo(() => Array.from(new Set(listings.map((l) => l.propertyType).filter((v): v is string => !!v))).sort(), [listings]);
  const locations = useMemo(() => Array.from(new Set(listings.map((l) => l.city))).sort(), [listings]);
  const maxBeds = useMemo(() => Math.max(0, ...listings.map((l) => l.bedrooms ?? 0)), [listings]);

  const typeLabel = (v: string) => (t.has(`types.${v}`) ? t(`types.${v}`) : v);

  const filtered = useMemo(() => {
    const list = listings.filter((l) => {
      const statusOk =
        status === "all" ? true : status === "active" ? l.status !== "sold" : l.status === status;
      return (
        statusOk &&
        (type === "all" || l.propertyType === type) &&
        (location === "all" || l.city === location) &&
        (bedrooms === 0 || (l.bedrooms ?? 0) >= bedrooms)
      );
    });
    const price = (l: ListingCardData) => (l.status === "sold" ? null : l.price.amount);
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => (price(a) ?? Infinity) - (price(b) ?? Infinity));
        break;
      case "price-desc":
        sorted.sort((a, b) => (price(b) ?? -Infinity) - (price(a) ?? -Infinity));
        break;
      case "land-desc":
        sorted.sort((a, b) => (b.landArea ?? -1) - (a.landArea ?? -1));
        break;
      default:
        // Featured first, sold always last
        sorted.sort((a, b) => Number(a.status === "sold") - Number(b.status === "sold") || Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [listings, status, type, location, bedrooms, sort]);

  const reset = () => {
    setStatus("active");
    setType("all");
    setLocation("all");
    setBedrooms(0);
    setVisible(PAGE_SIZE);
  };

  if (listings.length === 0) {
    return (
      <div className="border border-line px-6 py-16 text-center sm:px-12">
        <p className="font-display text-display-sm text-ink">{t("catalog.comingSoonTitle")}</p>
        <p className="mx-auto mt-4 max-w-xl text-mist">{t("catalog.comingSoonText")}</p>
      </div>
    );
  }

  const field = "field-input";

  return (
    <div>
      <form role="search" aria-label={t("catalog.filtersLabel")} onSubmit={(e) => e.preventDefault()} className="grid gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor={ids.status} className="eyebrow text-mist">{t("catalog.status")}</label>
          <select id={ids.status} className={field} value={status} onChange={(e) => { setStatus(e.target.value as StatusFilter); setVisible(PAGE_SIZE); }}>
            <option value="active">{t("catalog.statusActive")}</option>
            <option value="available">{t("status.available")}</option>
            <option value="under-contract">{t("status.under-contract")}</option>
            <option value="sold">{t("status.sold")}</option>
            <option value="all">{t("catalog.statusAll")}</option>
          </select>
        </div>
        <div>
          <label htmlFor={ids.type} className="eyebrow text-mist">{t("catalog.type")}</label>
          <select id={ids.type} className={field} value={type} onChange={(e) => { setType(e.target.value); setVisible(PAGE_SIZE); }}>
            <option value="all">{t("catalog.allTypes")}</option>
            {types.map((v) => <option key={v} value={v}>{typeLabel(v)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.location} className="eyebrow text-mist">{t("catalog.location")}</label>
          <select id={ids.location} className={field} value={location} onChange={(e) => { setLocation(e.target.value); setVisible(PAGE_SIZE); }}>
            <option value="all">{t("catalog.allLocations")}</option>
            {locations.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.bedrooms} className="eyebrow text-mist">{t("catalog.bedrooms")}</label>
          <select id={ids.bedrooms} className={field} value={bedrooms} onChange={(e) => { setBedrooms(Number(e.target.value)); setVisible(PAGE_SIZE); }} disabled={maxBeds === 0}>
            <option value={0}>{t("catalog.any")}</option>
            {Array.from({ length: maxBeds }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{t("catalog.atLeast", { count: n })}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.sort} className="eyebrow text-mist">{t("catalog.sortBy")}</label>
          <select id={ids.sort} className={field} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">{t("catalog.sortFeatured")}</option>
            <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
            <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
            <option value="land-desc">{t("catalog.sortLand")}</option>
          </select>
        </div>
      </form>

      <p role="status" aria-live="polite" className="mt-8 text-[0.875rem] text-mist">{t("catalog.results", { count: filtered.length })}</p>

      {filtered.length === 0 ? (
        <div className="mt-10 border border-line px-6 py-16 text-center">
          <p className="font-display text-display-sm text-ink">{t("catalog.emptyTitle")}</p>
          <p className="mx-auto mt-3 max-w-md text-mist">{t("catalog.emptyText")}</p>
          <button type="button" onClick={reset} className={buttonClasses("outline", "mt-8")}>{t("catalog.clearFilters")}</button>
        </div>
      ) : (
        <>
          <ul className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((l) => (
              <li key={l.slug}>
                <ListingCard listing={l} headingLevel="h2" />
              </li>
            ))}
          </ul>
          {visible < filtered.length && (
            <div className="mt-16 text-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={buttonClasses("outline")}>{t("catalog.loadMore")}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
