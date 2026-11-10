"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Links to the same page in the other language. Slugs are shared across
 * languages, so property and experience pages map one to one.
 */
export function LanguageSwitcher({ tone = "dark", onNavigate, className = "" }: { tone?: "dark" | "light"; onNavigate?: () => void; className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav aria-label={t("language")} className={`flex items-center gap-1 text-[0.75rem] font-semibold tracking-[0.16em] ${className}`}>
      {routing.locales.map((l, i) => {
        const active = l === locale;
        return (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className={tone === "light" ? "text-ivory/40" : "text-ink/30"}>/</span>}
            <Link
              href={pathname}
              locale={l}
              hrefLang={l}
              lang={l}
              onClick={onNavigate}
              aria-current={active ? "true" : undefined}
              aria-label={l === "en" ? "English" : "Español"}
              className={`inline-flex min-h-11 min-w-9 items-center justify-center uppercase transition-opacity duration-300 ${
                active ? "opacity-100" : "opacity-55 hover:opacity-100"
              } ${tone === "light" ? "text-ivory" : "text-ink"}`}
            >
              {l}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
