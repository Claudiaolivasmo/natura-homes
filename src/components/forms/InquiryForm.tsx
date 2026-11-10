"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { clientSchemas, type PropertyInquiryValues } from "@/schemas/forms";
import { useInquirySubmit } from "./useInquirySubmit";
import { PhoneField } from "./PhoneField";
import { ConsentCheckbox, Field, fieldA11y, Honeypot, SubmitRow, SuccessPanel, useErrorText } from "./FormParts";

/** Short inquiry tied to a specific rental, listing or experience. */
export function InquiryForm({ subject, slug, itemName }: { subject: "rental" | "listing" | "experience"; slug: string; itemName: string }) {
  const t = useTranslations("forms");
  const ti = useTranslations("forms.inquiry");
  const err = useErrorText();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { status, setStatus, submit, honeypotRef } = useInquirySubmit("propertyInquiry");

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PropertyInquiryValues>({
    resolver: zodResolver(clientSchemas["property-inquiry"]),
    defaultValues: {
      kind: "property-inquiry",
      subject,
      slug,
      name: "",
      email: "",
      whatsapp: "",
      message: ti(`defaultMessage.${subject}`, { name: itemName }),
      consent: false,
    },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values)) reset();
  });

  if (status === "success") {
    return <SuccessPanel title={ti("successTitle")} text={ti("successText")} onReset={() => setStatus("idle")} />;
  }

  const e = {
    name: err(errors.name?.message),
    email: err(errors.email?.message),
    whatsapp: err(errors.whatsapp?.message),
    message: err(errors.message?.message),
    consent: err(errors.consent?.message),
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-y-7">
      <Honeypot inputRef={honeypotRef} />
      <Field id={id("name")} label={t("name")} required error={e.name}>
        <input type="text" autoComplete="name" className="field-input" {...register("name")} {...fieldA11y(id("name"), e.name)} />
      </Field>
      <Field id={id("email")} label={t("email")} required error={e.email}>
        <input type="email" autoComplete="email" inputMode="email" className="field-input" {...register("email")} {...fieldA11y(id("email"), e.email)} />
      </Field>
      <Field id={id("whatsapp")} label={t("whatsapp")} error={e.whatsapp} hint={t("whatsappHint")}>
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
      <Field id={id("message")} label={ti("message")} required error={e.message}>
        <textarea rows={4} className="field-input" {...register("message")} {...fieldA11y(id("message"), e.message)} />
      </Field>
      <ConsentCheckbox id={id("consent")} error={e.consent} registerProps={register("consent")} />
      <SubmitRow status={status} label={ti("submit")} />
    </form>
  );
}
