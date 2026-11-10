"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { RentalCard } from "./RentalCard";
import { buttonClasses } from "@/components/ui/Button";
import type { RentalCardData } from "@/lib/view-models";
import { useAmenityLabel } from "./useAmenityLabel";

type Sort = "featured" | "name" | "guests" | "bedrooms";
const PAGE_SIZE = 9;

export function RentalCatalog({ rentals }: { rentals: RentalCardData[] }) {
  const t = useTranslations("rentals.catalog");
  const amenityLabel = useAmenityLabel();
  const ids = { location: useId(), guests: useId(), bedrooms: useId(), sort: useId(), amenities: useId() };

  const [location, setLocation] = useState("all");
  const [guests, setGuests] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const locations = useMemo(() => Array.from(new Set(rentals.map((r) => r.city))).sort(), [rentals]);
  const allAmenities = useMemo(() => Array.from(new Set(rentals.flatMap((r) => r.amenities))).sort(), [rentals]);
  const maxGuestsAvailable = useMemo(() => Math.max(0, ...rentals.map((r) => r.maxGuests ?? 0)), [rentals]);
  const maxBedroomsAvailable = useMemo(() => Math.max(0, ...rentals.map((r) => r.bedrooms ?? 0)), [rentals]);

  const filtered = useMemo(() => {
    const list = rentals.filter(
      (r) =>
        (location === "all" || r.city === location) &&
        (guests === 0 || (r.maxGuests ?? 0) >= guests) &&
        (bedrooms === 0 || (r.bedrooms ?? 0) >= bedrooms) &&
        amenities.every((a) => r.amenities.includes(a)),
    );
    const sorted = [...list];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "guests":
        sorted.sort((a, b) => (b.maxGuests ?? -1) - (a.maxGuests ?? -1));
        break;
      case "bedrooms":
        sorted.sort((a, b) => (b.bedrooms ?? -1) - (a.bedrooms ?? -1));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [rentals, location, guests, bedrooms, amenities, sort]);

  const filtersActive = location !== "all" || guests > 0 || bedrooms > 0 || amenities.length > 0;
  const reset = () => {
    setLocation("all");
    setGuests(0);
    setBedrooms(0);
    setAmenities([]);
    setVisible(PAGE_SIZE);
  };
  const resetPaging = () => setVisible(PAGE_SIZE);

  if (rentals.length === 0) {
    return (
      <div className="border border-line px-6 py-16 text-center sm:px-12">
        <p className="font-display text-display-sm text-ink">{t("comingSoonTitle")}</p>
        <p className="mx-auto mt-4 max-w-xl text-mist">{t("comingSoonText")}</p>
      </div>
    );
  }

  const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

  return (
    <div>
      <form
        role="search"
        aria-label={t("filtersLabel")}
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label htmlFor={ids.location} className="eyebrow text-mist">{t("location")}</label>
          <select id={ids.location} className="field-input" value={location} onChange={(e) => { setLocation(e.target.value); resetPaging(); }}>
            <option value="all">{t("allLocations")}</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.guests} className="eyebrow text-mist">{t("guests")}</label>
          <select id={ids.guests} className="field-input" value={guests} onChange={(e) => { setGuests(Number(e.target.value)); resetPaging(); }} disabled={maxGuestsAvailable === 0}>
            <option value={0}>{t("any")}</option>
            {range(maxGuestsAvailable).map((n) => <option key={n} value={n}>{t("atLeast", { count: n })}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.bedrooms} className="eyebrow text-mist">{t("bedrooms")}</label>
          <select id={ids.bedrooms} className="field-input" value={bedrooms} onChange={(e) => { setBedrooms(Number(e.target.value)); resetPaging(); }} disabled={maxBedroomsAvailable === 0}>
            <option value={0}>{t("any")}</option>
            {range(maxBedroomsAvailable).map((n) => <option key={n} value={n}>{t("atLeast", { count: n })}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={ids.sort} className="eyebrow text-mist">{t("sortBy")}</label>
          <select id={ids.sort} className="field-input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">{t("sortFeatured")}</option>
            <option value="name">{t("sortName")}</option>
            <option value="guests">{t("sortGuests")}</option>
            <option value="bedrooms">{t("sortBedrooms")}</option>
          </select>
        </div>

        {allAmenities.length > 0 && (
          <fieldset className="sm:col-span-2 lg:col-span-4">
            <legend id={ids.amenities} className="eyebrow text-mist">{t("amenities")}</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {allAmenities.map((a) => {
                const checked = amenities.includes(a);
                return (
                  <label
                    key={a}
                    className={`cursor-pointer border px-4 py-2 text-[0.8125rem] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                      checked ? "border-ink bg-ink text-ivory" : "border-line text-ink hover:border-ink/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => {
                        setAmenities((prev) => (checked ? prev.filter((x) => x !== a) : [...prev, a]));
                        resetPaging();
                      }}
                    />
                    {amenityLabel(a)}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </form>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-[0.875rem] text-mist">
          {t("results", { count: filtered.length })}
        </p>
        {filtersActive && (
          <button type="button" onClick={reset} className="link-line text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink">
            {t("clearFilters")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 border border-line px-6 py-16 text-center">
          <p className="font-display text-display-sm text-ink">{t("emptyTitle")}</p>
          <p className="mx-auto mt-3 max-w-md text-mist">{t("emptyText")}</p>
          <button type="button" onClick={reset} className={buttonClasses("outline", "mt-8")}>{t("clearFilters")}</button>
        </div>
      ) : (
        <>
          <ul className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((r, i) => (
              <li key={r.slug} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                <RentalCard rental={r} headingLevel="h2" />
              </li>
            ))}
          </ul>
          {visible < filtered.length && (
            <div className="mt-16 text-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={buttonClasses("outline")}>
                {t("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
