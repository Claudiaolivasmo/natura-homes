"use client";

import { useMemo, useState } from "react";
import type { Ref } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";

interface PhoneFieldProps {
  id: string;
  name: string;
  inputRef: Ref<HTMLInputElement>;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function toInternationalNumber(localNumber: string, country: CountryCode | "") {
  const value = localNumber.trim();
  if (!value) return "";
  if (value.startsWith("+")) return parsePhoneNumberFromString(value)?.number ?? value;
  if (!country) return value;
  return parsePhoneNumberFromString(value, country)?.number ?? value;
}

export function PhoneField({ id, name, inputRef, error, hint, onChange, onBlur }: PhoneFieldProps) {
  const locale = useLocale();
  const t = useTranslations("forms");
  const [country, setCountry] = useState<CountryCode | "">("");
  const [localNumber, setLocalNumber] = useState("");
  const countryNames = useMemo(() => new Intl.DisplayNames([locale], { type: "region" }), [locale]);

  function handlePhoneChange(next: string) {
    const entered = next.trim();
    if (entered.startsWith("+")) {
      const parsed = parsePhoneNumberFromString(entered);
      if (parsed?.country) {
        setCountry(parsed.country);
        setLocalNumber(parsed.formatNational());
        onChange(parsed.number);
        return;
      }
    }

    setLocalNumber(next);
    onChange(toInternationalNumber(next, country));
  }

  function handleCountryChange(next: string) {
    const selected = next as CountryCode | "";
    setCountry(selected);
    onChange(toInternationalNumber(localNumber, selected));
  }

  return (
    <div className={`natura-phone${error ? " natura-phone-invalid" : ""}`}>
      <select
        id={`${id}-country`}
        name={`${name}Country`}
        value={country}
        onChange={(event) => handleCountryChange(event.target.value)}
        aria-label={t("phoneCountry")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="natura-phone-country"
      >
        <option value="">{t("selectPhoneCountry")}</option>
        {getCountries().map((code) => (
          <option key={code} value={code}>
            {countryNames.of(code) ?? code} (+{getCountryCallingCode(code)})
          </option>
        ))}
      </select>
      <input
        id={id}
        name={name}
        ref={inputRef}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={localNumber}
        onChange={(event) => handlePhoneChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="natura-phone-input"
      />
    </div>
  );
}
