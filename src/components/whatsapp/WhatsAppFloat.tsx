"use client";

import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/whatsapp";
import { useWhatsAppMessage } from "./WhatsAppContext";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Floating WhatsApp entry point. Sits bottom-right above the safe area so it
 * never covers the mobile menu (which renders above it) or page CTAs.
 * Hidden entirely until a WhatsApp number is configured.
 */
export function WhatsAppFloat() {
  const t = useTranslations("whatsapp");
  const contextual = useWhatsAppMessage();
  const href = whatsappUrl(contextual ?? t("defaultMessage"));
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 z-40 flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-3 text-ivory shadow-[0_10px_30px_-10px_rgba(26,46,53,0.55)] transition-[padding,background-color] duration-500 ease-[var(--ease-editorial)] hover:bg-ink-soft sm:right-6 sm:pr-5"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="sr-only sm:not-sr-only sm:text-[0.8125rem] sm:font-medium sm:tracking-wide">{t("floatLabel")}</span>
      <span className="sr-only">{t("opensInNewTab")}</span>
    </a>
  );
}
