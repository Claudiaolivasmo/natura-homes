"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Experience, ExperiencePricing } from "@/schemas/content";
import { localize } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format";

interface Props {
  experience: Experience;
  onSelectionChange?: (selection: string) => void;
}

function ageLabel(category: "adult" | "child" | "infant", minAge: number, maxAge: number | null, locale: string) {
  const labels = locale === "es"
    ? { adult: "Adultos", child: "Niños", infant: "Infantes" }
    : { adult: "Adults", child: "Children", infant: "Infants" };
  const range = maxAge === null ? `${minAge}+` : `${minAge}-${maxAge}`;
  return `${labels[category]} (${range} ${locale === "es" ? "años" : "years"})`;
}

export function ExperiencePricing({ experience, onSelectionChange }: Props) {
  const locale = useLocale();
  const t = useTranslations("concierge.pricing");
  const pricing = experience.pricing;
  const [optionId, setOptionId] = useState("");
  const [durationId, setDurationId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [groups, setGroups] = useState(0);

  const selectedOption = pricing?.type === "per_option" ? pricing.options.find((option) => option.id === optionId) : undefined;
  const selectedDuration = pricing?.type === "per_duration" ? pricing.durations.find((item) => item.id === durationId) : undefined;

  const estimatedTotal = useMemo(() => {
    if (!pricing) return 0;
    if (pricing.type === "per_person") return quantity * pricing.amount;
    if (pricing.type === "per_age") {
      const adultsRate = pricing.rates.find((rate) => rate.category === "adult")?.amount ?? 0;
      const childrenRate = pricing.rates.find((rate) => rate.category === "child")?.amount ?? 0;
      const infantsRate = pricing.rates.find((rate) => rate.category === "infant")?.amount ?? 0;
      return adults * adultsRate + children * childrenRate + infants * infantsRate;
    }
    if (pricing.type === "per_option") return selectedOption?.confirmed === false ? 0 : selectedOption?.amount ?? 0;
    if (pricing.type === "per_group") return groups * pricing.amount;
    if (pricing.type === "per_duration") return selectedDuration?.amount ?? 0;
    return 0;
  }, [pricing, quantity, adults, children, infants, groups, selectedOption, selectedDuration]);

  const currency = pricing?.currency ?? "USD";
  const selectionText = useMemo(() => {
    if (!pricing) return "";
    if (pricing.type === "per_person") return `${t("selectionPerPerson")}: ${quantity}`;
    if (pricing.type === "per_age") return `${t("adults")}: ${adults}, ${t("children")}: ${children}, ${t("infants")}: ${infants}`;
    if (pricing.type === "per_option") return selectedOption ? `${t("treatment")}: ${localize(selectedOption.name, locale)}${selectedOption.confirmed === false ? ` (${locale === "es" ? "precio por confirmar" : "price to be confirmed"})` : ""}` : "";
    if (pricing.type === "per_group") return `${t("groups")}: ${groups}`;
    if (pricing.type === "per_duration") return selectedDuration ? `${t("duration")}: ${localize(selectedDuration.duration, locale)}` : "";
    return "";
  }, [pricing, quantity, adults, children, infants, groups, selectedOption, selectedDuration, locale, t]);

  useEffect(() => {
    if (selectionText) onSelectionChange?.(`${localize(experience.title, locale)}. ${selectionText}. ${t("estimatedTotal")}: ${formatPrice(estimatedTotal, currency, locale)} USD`);
    else onSelectionChange?.("");
  }, [selectionText, estimatedTotal, experience.title, locale, t, currency, onSelectionChange]);

  if (!pricing || pricing.type === "on_request") return null;

  const quantityControl = (label: string, value: number, setter: (value: number) => void) => (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center border border-line bg-white">
        <button type="button" aria-label={`${t("decrease")} ${label}`} className="size-11 text-lg" onClick={() => setter(Math.max(0, value - 1))}>−</button>
        <output className="min-w-10 text-center text-sm font-semibold" aria-live="polite">{value}</output>
        <button type="button" aria-label={`${t("increase")} ${label}`} className="size-11 text-lg" onClick={() => setter(value + 1)}>+</button>
      </div>
    </div>
  );

  return (
    <section className="mt-10 border-y border-line py-6" aria-label={t("pricingCalculator")}>
      <h2 className="text-display-sm">{t("pricing")}</h2>

      {pricing.type === "per_option" && (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {pricing.options.map((option) => (
            <li key={option.id} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
              <div>
                <p className="font-medium text-ink">{localize(option.name, locale)}</p>
                {option.duration && <p className="mt-1 text-xs text-mist">{localize(option.duration, locale)}</p>}
                {option.confirmed === false && pricing.type === "per_option" && <p className="mt-1 text-xs text-mist">{locale === "es" ? "Precio unitario por confirmar con el proveedor" : "Unit price to be confirmed with provider"}</p>}
              </div>
              <span className="font-semibold text-ink">{option.confirmed === false ? (locale === "es" ? "Por confirmar" : "To be confirmed") : formatPrice(option.amount, pricing.currency, locale)}</span>
            </li>
          ))}
        </ul>
      )}

      {pricing.type === "per_age" && (
        <div className="mt-4">
          {pricing.rates.map((rate) => {
            const setter = rate.category === "adult" ? setAdults : rate.category === "child" ? setChildren : setInfants;
            const value = rate.category === "adult" ? adults : rate.category === "child" ? children : infants;
            return quantityControl(ageLabel(rate.category, rate.minAge, rate.maxAge, locale), value, setter);
          })}
        </div>
      )}

      {pricing.type === "per_person" && quantityControl(t("participants"), quantity, setQuantity)}
      {pricing.type === "per_group" && quantityControl(t("groups"), groups, setGroups)}

      {pricing.type === "per_option" && (
        <div className="mt-5">
          <label className="eyebrow text-mist" htmlFor="pricing-option">{t("selectTreatment")}</label>
          <select id="pricing-option" className="field-input mt-2" value={optionId} onChange={(event) => setOptionId(event.target.value)}>
            <option value="">{t("select")}</option>
            {pricing.options.map((option) => (
              <option key={option.id} value={option.id}>{localize(option.name, locale)} · {localize(option.duration, locale)} · {option.confirmed === false ? (locale === "es" ? "Por confirmar" : "To be confirmed") : formatPrice(option.amount, pricing.currency, locale)}</option>
            ))}
          </select>
          {selectedOption && (
            <div className="mt-4 flex justify-between gap-4 text-sm text-mist">
              <span>{localize(selectedOption.duration, locale)}</span>
              <span className="font-semibold text-ink">{selectedOption.confirmed === false ? (locale === "es" ? "Por confirmar" : "To be confirmed") : formatPrice(selectedOption.amount, pricing.currency, locale)}</span>
            </div>
          )}
        </div>
      )}

      {pricing.type === "per_duration" && (
        <div className="mt-5">
          <label className="eyebrow text-mist" htmlFor="pricing-duration">{t("selectDuration")}</label>
          <select id="pricing-duration" className="field-input mt-2" value={durationId} onChange={(event) => setDurationId(event.target.value)}>
            <option value="">{t("select")}</option>
            {pricing.durations.map((item) => <option key={item.id} value={item.id}>{localize(item.duration, locale)} · {formatPrice(item.amount, pricing.currency, locale)}</option>)}
          </select>
        </div>
      )}

      {pricing.type === "from" && (
        <p className="mt-4 text-sm text-mist">{t("from")} <strong className="text-ink">{formatPrice(pricing.amount, pricing.currency, locale)}</strong> USD</p>
      )}

      {(pricing.type === "per_person" || pricing.type === "per_age" || pricing.type === "per_group" || pricing.type === "per_option" || pricing.type === "per_duration") && (
        <div className="mt-6 flex items-end justify-between gap-5 border-t border-line pt-5">
          <div>
            <p className="eyebrow text-mist">{t("estimatedTotal")}</p>
            <p className="mt-1 text-xs text-mist">{t("notConfirmed")}</p>
          </div>
          <p className="font-display text-3xl text-ink">{selectedOption?.confirmed === false ? (locale === "es" ? "Por confirmar" : "To be confirmed") : <>{formatPrice(estimatedTotal, currency, locale)} <span className="text-sm">USD</span></>}</p>
        </div>
      )}
    </section>
  );
}
