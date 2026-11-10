"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems, siteConfig } from "@/config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "@/components/layout/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/whatsapp";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Full-screen navigation dialog for phones and tablets.
 * - aria-modal dialog with focus trap, Escape to close, focus restored to the toggle
 * - body scroll locked while open
 * - closes on any navigation
 */
export function MobileMenu({ tone }: { tone: "dark" | "light" }) {
  const t = useTranslations("nav");
  const tw = useTranslations("whatsapp");
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock, Escape, focus trap
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.setAttribute("data-scroll-locked", "");
    const toggle = toggleRef.current;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );

    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      root.removeAttribute("data-scroll-locked");
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  // Close if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const wa = whatsappUrl(tw("defaultMessage"));
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("openMenu")}
        className={`relative -mr-2 flex size-11 items-center justify-center xl:hidden ${tone === "light" ? "text-ivory" : "text-ink"}`}
      >
        <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
          <span className="h-px w-full bg-current" />
          <span className="ml-auto h-px w-2/3 bg-current" />
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="menu"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-ivory"
                initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
                exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: reduce ? 0.2 : 0.7, ease }}
              >
                <h2 id={titleId} className="sr-only">{t("menu")}</h2>
                <div className="container-site flex h-[5.5rem] shrink-0 items-center justify-between">
                  <Link href="/" onClick={close} aria-label={t("homeAria")}>
                    <Logo variant="light" />
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    aria-label={t("closeMenu")}
                    className="relative -mr-2 flex size-11 items-center justify-center text-ivory"
                  >
                    <span aria-hidden="true" className="relative block size-6">
                      <motion.span
                        className="absolute left-0 top-1/2 h-px w-full bg-current"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 45 }}
                        transition={{ duration: 0.5, ease, delay: 0.15 }}
                      />
                      <motion.span
                        className="absolute left-0 top-1/2 h-px w-full bg-current"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: -45 }}
                        transition={{ duration: 0.5, ease, delay: 0.15 }}
                      />
                    </span>
                  </button>
                </div>

                <nav aria-label={t("primary")} className="container-site flex flex-1 flex-col justify-center py-10">
                  <ul className="space-y-1">
                    {navItems.map((item, i) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <motion.li
                          key={item.key}
                          initial={reduce ? false : { opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.2 + i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className="group flex items-baseline gap-5 py-2"
                          >
                            <span className="eyebrow w-6 text-sage">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`font-display text-[clamp(2rem,7vw,3.25rem)] leading-tight transition-opacity duration-300 ${active ? "italic" : "opacity-85 group-hover:opacity-100"}`}>
                              {t(item.key)}
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <motion.div
                  className="container-site flex flex-col gap-6 border-t border-ivory/15 py-8 sm:flex-row sm:items-center sm:justify-between"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : 0.55 }}
                >
                  <LanguageSwitcher tone="light" onNavigate={close} />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline-light")}>
                        {tw("floatLabel")}
                      </a>
                    )}
                    <Link href="/property-management#consultation" onClick={close} className={buttonClasses("light")}>
                      {t("listProperty")}
                    </Link>
                  </div>
                </motion.div>
                <p className="sr-only">{siteConfig.name}</p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
