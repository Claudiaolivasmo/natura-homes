"use client";

import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSubmit } from "@formspree/react";
import { formspreeFormIds, type FormspreeForm } from "@/config/formspree";
import { prepareFormspreePayload, type FormspreeValues } from "@/lib/formspree-payload";

export type SubmitStatus = "idle" | "submitting" | "success" | "error" | "rate-limited";

export function useInquirySubmit(form: FormspreeForm) {
  const locale = useLocale();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formId = formspreeFormIds[form];
  const submitToFormspree = useSubmit<FormspreeValues>(formId);

  async function submit(values: FormspreeValues) {
    if (submittingRef.current) return false;
    if (!formId) {
      console.error(`[forms] Missing Formspree ID for "${form}". Replace its placeholder in .env.local.`);
      setStatus("error");
      return false;
    }

    const formValues = prepareFormspreePayload(values);
    if (!formValues) {
      setStatus("error");
      return false;
    }

    submittingRef.current = true;
    setStatus("submitting");
    try {
      const result = await submitToFormspree({
        ...formValues,
        _gotcha: honeypotRef.current?.value ?? "",
        form_type: form,
        source_page: window.location.pathname,
        locale,
      });
      if (result.kind === "success") {
        setStatus("success");
        return true;
      }
      setStatus("error");
      return false;
    } catch (error) {
      console.error("[forms] Formspree submission failed:", error);
      setStatus("error");
      return false;
    } finally {
      submittingRef.current = false;
    }
  }

  return { status, setStatus, submit, honeypotRef };
}
