"use client";

import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { clientSchemas, type ConciergeValues } from "@/schemas/forms";
import { useInquirySubmit } from "./useInquirySubmit";
import { PhoneField } from "./PhoneField";
import { ConsentCheckbox, Field, fieldA11y, Honeypot, SubmitRow, SuccessPanel, useErrorText } from "./FormParts";

interface Option {
  slug: string;
  title: string;
}

/** Lets guests pick several experiences in a single request. */
export function ConciergeRequestForm({ options, preselected = [], pricingSelection = "" }: { options: Option[]; preselected?: string[]; pricingSelection?: string }) {
  const t = useTranslations("forms");
  const tc = useTranslations("forms.concierge");
  const err = useErrorText();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { status, setStatus, submit, honeypotRef } = useInquirySubmit("concierge");

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ConciergeValues>({
    resolver: zodResolver(clientSchemas.concierge),
    defaultValues: {
      kind: "concierge",
      name: "",
      email: "",
      whatsapp: "",
      experiences: preselected,
      arrival: "",
      departure: "",
      guests: "",
      pricingSelection: "",
      message: "",
      consent: false,
    },
    mode: "onTouched",
  });

  const selected = watch("experiences") ?? [];

  useEffect(() => {
    setValue("pricingSelection", pricingSelection, { shouldDirty: pricingSelection.length > 0 });
  }, [pricingSelection, setValue]);

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
    experiences: err(errors.experiences?.message ?? errors.experiences?.root?.message),
    message: err(errors.message?.message),
    consent: err(errors.consent?.message),
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-10 gap-y-8 sm:grid-cols-2">
      <Honeypot inputRef={honeypotRef} />

      <fieldset className="sm:col-span-2" aria-describedby={e.experiences ? id("exp-error") : undefined}>
        <legend className="eyebrow text-mist">
          {tc("experiences")} <span aria-hidden="true" className="text-ink">*</span>
        </legend>
        <p className="mt-2 text-[0.8125rem] text-mist">{tc("experiencesHint")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {options.map((o) => {
            const checked = selected.includes(o.slug);
            return (
              <label
                key={o.slug}
                className={`cursor-pointer border px-4 py-2.5 text-[0.875rem] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                  checked ? "border-ink bg-ink text-ivory" : "border-line text-ink hover:border-ink/50"
                }`}
              >
                <input type="checkbox" value={o.slug} className="sr-only" {...register("experiences")} />
                {o.title}
              </label>
            );
          })}
        </div>
        {e.experiences && <p id={id("exp-error")} className="mt-3 text-[0.8125rem] text-[#9b3b2f]">{e.experiences}</p>}
      </fieldset>

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
      <Field id={id("guests")} label={tc("guests")}>
        <input type="text" inputMode="numeric" className="field-input" {...register("guests")} id={id("guests")} />
      </Field>
      <Field id={id("arrival")} label={tc("arrival")}>
        <input type="date" className="field-input" {...register("arrival")} id={id("arrival")} />
      </Field>
      <Field id={id("departure")} label={tc("departure")}>
        <input type="date" className="field-input" {...register("departure")} id={id("departure")} />
      </Field>
      <Field id={id("message")} label={tc("message")} error={e.message} className="sm:col-span-2">
        <textarea rows={4} className="field-input" placeholder={tc("messagePlaceholder")} {...register("message")} {...fieldA11y(id("message"), e.message)} />
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
