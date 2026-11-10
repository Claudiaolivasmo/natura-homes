"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { clientSchemas, type ContactValues } from "@/schemas/forms";
import { useInquirySubmit } from "./useInquirySubmit";
import { PhoneField } from "./PhoneField";
import { ConsentCheckbox, Field, fieldA11y, Honeypot, SubmitRow, SuccessPanel, useErrorText } from "./FormParts";

const topics = ["stay", "management", "concierge", "real-estate", "other"] as const;

export function ContactForm() {
  const t = useTranslations("forms");
  const tc = useTranslations("forms.contact");
  const err = useErrorText();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { status, setStatus, submit, honeypotRef } = useInquirySubmit("contact");

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(clientSchemas.contact),
    defaultValues: { kind: "contact", name: "", email: "", whatsapp: "", message: "", consent: false },
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
    topic: err(errors.topic?.message),
    message: err(errors.message?.message),
    consent: err(errors.consent?.message),
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-10 gap-y-8 sm:grid-cols-2">
      <Honeypot inputRef={honeypotRef} />
      <p className="text-[0.8125rem] text-mist sm:col-span-2">{t("requiredNote")}</p>
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
      <Field id={id("topic")} label={tc("topic")} required error={e.topic}>
        <select className="field-input" defaultValue="" {...register("topic")} {...fieldA11y(id("topic"), e.topic)}>
          <option value="" disabled>{t("select")}</option>
          {topics.map((v) => <option key={v} value={v}>{tc(`topics.${v}`)}</option>)}
        </select>
      </Field>
      <Field id={id("message")} label={tc("message")} required error={e.message} className="sm:col-span-2">
        <textarea rows={5} className="field-input" {...register("message")} {...fieldA11y(id("message"), e.message)} />
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
