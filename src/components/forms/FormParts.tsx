"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useTranslations } from "next-intl";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import type { SubmitStatus } from "./useInquirySubmit";

/** Resolves a schema error key (e.g. "emailInvalid") to a translated message. */
export function useErrorText() {
  const t = useTranslations("forms.errors");
  return (key?: string) => (key ? (t.has(key) ? t(key) : t("generic")) : undefined);
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ id, label, required, error, hint, className = "", children }: FieldProps) {
  const t = useTranslations("forms");
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow text-mist">
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-ink">*</span> : <span className="ml-2 normal-case tracking-normal text-mist/80">({t("optional")})</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-mist">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-[#9b3b2f]">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria wiring for an input inside <Field> */
export function fieldA11y(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

/** Hidden from people and assistive tech; bots tend to fill it in. */
export function Honeypot({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input ref={inputRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function ConsentCheckbox({ id, error, registerProps }: { id: string; error?: string; registerProps: UseFormRegisterReturn }) {
  const t = useTranslations("forms");
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          {...registerProps}
          {...fieldA11y(id, error)}
          className="mt-1 size-4 shrink-0 accent-[#1A2E35]"
        />
        <label htmlFor={id} className="text-[0.875rem] leading-relaxed text-mist">
          {t.rich("consent", {
            link: (chunks) => (
              <Link href="/privacy" className="text-ink underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        </label>
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-[#9b3b2f]">{error}</p>}
    </div>
  );
}

export function SubmitRow({ status, label }: { status: SubmitStatus; label: string }) {
  const t = useTranslations("forms");
  const busy = status === "submitting";
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <button type="submit" disabled={busy} aria-disabled={busy} className={buttonClasses("solid", "sm:min-w-64")}>
        {busy ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
            <span>{t("sending")}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </button>
      <StatusMessage status={status} />
    </div>
  );
}

function StatusMessage({ status }: { status: SubmitStatus }) {
  const t = useTranslations("forms");
  return (
    <p role="status" aria-live="polite" className="text-[0.875rem]">
      {status === "error" && <span className="text-[#9b3b2f]">{t("error")}</span>}
      {status === "rate-limited" && <span className="text-[#9b3b2f]">{t("rateLimited")}</span>}
    </p>
  );
}

export function SuccessPanel({ title, text, onReset }: { title: string; text: string; onReset: () => void }) {
  const t = useTranslations("forms");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="border border-line bg-ivory px-6 py-12 outline-none sm:px-10">
      <span className="flex size-12 items-center justify-center rounded-full bg-ink text-ivory">
        <Check aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </span>
      <p className="mt-6 font-display text-display-sm text-ink">{title}</p>
      <p className="mt-3 max-w-lg text-mist">{text}</p>
      <button type="button" onClick={onReset} className="link-line mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink">
        {t("sendAnother")}
      </button>
    </div>
  );
}
