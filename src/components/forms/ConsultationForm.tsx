"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { clientSchemas, type ConsultationValues } from "@/schemas/forms";
import { useInquirySubmit } from "./useInquirySubmit";
import { PhoneField } from "./PhoneField";
import { ConsentCheckbox, Field, fieldA11y, Honeypot, SubmitRow, SuccessPanel, useErrorText } from "./FormParts";

export function ConsultationForm() {
  const t = useTranslations("forms");
  const tc = useTranslations("forms.consultation");
  const err = useErrorText();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { status, setStatus, submit, honeypotRef } = useInquirySubmit("consultation");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationValues>({
    resolver: zodResolver(clientSchemas.consultation),
    defaultValues: { kind: "consultation", name: "", email: "", whatsapp: "", propertyLocation: "", bedrooms: "", message: "", consent: false },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values)) reset();
  });

  if (status === "success") {
    return <SuccessPanel title={tc("successTitle")} text={tc("successText")} onReset={() => setStatus("idle")} />;
  }

  const e = {
    name: err(errors.name?.message),
    email: err(errors.email?.message),
    whatsapp: err(errors.whatsapp?.message),
    propertyLocation: err(errors.propertyLocation?.message),
    propertyType: err(errors.propertyType?.message),
    bedrooms: err(errors.bedrooms?.message),
    rentalStatus: err(errors.rentalStatus?.message),
    message: err(errors.message?.message),
    consent: err(errors.consent?.message),
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-10 gap-y-8 sm:grid-cols-2" aria-describedby={id("required-note")}>
      <Honeypot inputRef={honeypotRef} />
      <p id={id("required-note")} className="text-[0.8125rem] text-mist sm:col-span-2">{t("requiredNote")}</p>

      <Field id={id("name")} label={t("name")} required error={e.name}>
        <input type="text" autoComplete="name" className="field-input" {...register("name")} {...fieldA11y(id("name"), e.name)} />
      </Field>
      <Field id={id("email")} label={t("email")} required error={e.email}>
        <input type="email" autoComplete="email" inputMode="email" className="field-input" {...register("email")} {...fieldA11y(id("email"), e.email)} />
      </Field>
      <Field id={id("whatsapp")} label={t("whatsapp")} required error={e.whatsapp} hint={t("whatsappHint")}>
        <Controller
          name="whatsapp"
          control={control}
          render={({ field }) => (
            <PhoneField
              id={id("whatsapp")}
              name={field.name}
              inputRef={field.ref}
              error={e.whatsapp}
              hint={t("whatsappHint")}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>
      <Field id={id("location")} label={tc("propertyLocation")} required error={e.propertyLocation}>
        <input type="text" className="field-input" placeholder={tc("propertyLocationPlaceholder")} {...register("propertyLocation")} {...fieldA11y(id("location"), e.propertyLocation)} />
      </Field>
      <Field id={id("type")} label={tc("propertyType")} required error={e.propertyType}>
        <select className="field-input" defaultValue="" {...register("propertyType")} {...fieldA11y(id("type"), e.propertyType)}>
          <option value="" disabled>{t("select")}</option>
          {(["house", "villa", "condo", "cabin", "other"] as const).map((v) => (
            <option key={v} value={v}>{tc(`types.${v}`)}</option>
          ))}
        </select>
      </Field>
      <Field id={id("bedrooms")} label={tc("bedrooms")} error={e.bedrooms}>
        <input type="text" inputMode="numeric" className="field-input" {...register("bedrooms")} {...fieldA11y(id("bedrooms"), e.bedrooms)} />
      </Field>
      <Field id={id("status")} label={tc("rentalStatus")} required error={e.rentalStatus} className="sm:col-span-2">
        <select className="field-input" defaultValue="" {...register("rentalStatus")} {...fieldA11y(id("status"), e.rentalStatus)}>
          <option value="" disabled>{t("select")}</option>
          {(["not-rented", "self-managed", "other-manager", "new-build"] as const).map((v) => (
            <option key={v} value={v}>{tc(`statuses.${v}`)}</option>
          ))}
        </select>
      </Field>
      <Field id={id("message")} label={tc("comments")} error={e.message} className="sm:col-span-2">
        <textarea rows={4} className="field-input" {...register("message")} {...fieldA11y(id("message"), e.message)} />
      </Field>
      <div className="sm:col-span-2">
        <ConsentCheckbox id={id("consent")} error={e.consent} registerProps={register("consent")} />
      </div>
      <div className="sm:col-span-2">
        <SubmitRow status={status} label={tc("submit")} />
      </div>
    </form>
  );
}
