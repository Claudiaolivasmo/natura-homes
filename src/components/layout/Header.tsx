"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/config/site";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { buttonClasses } from "@/components/ui/Button";

export function isActive(pathname: string, href: string) {
  if (href === "/concierge" && pathname.startsWith("/experiences/harmony")) return true;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Pages that open with a full-bleed dark hero get a transparent header.
  const internalOverlay = pathname === "/concierge" || pathname === "/experiences/harmony" || pathname === "/vacation-rentals" || pathname === "/property-management" || pathname === "/real-estate" || pathname === "/about-contact";
  const overlay = pathname === "/" || internalOverlay;
  const transparent = overlay && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerLight = transparent || (internalOverlay && scrolled);
  const tone = headerLight ? "light" : "dark";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ease-[var(--ease-editorial)] ${
          transparent
            ? "bg-gradient-to-b from-ink/45 to-transparent text-ivory"
            : scrolled && internalOverlay
              ? "bg-ink text-ivory shadow-none"
              : "bg-ivory/95 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md supports-[backdrop-filter]:bg-ivory/85"
        } ${transparent ? "on-dark" : ""}`}
      >
        <div
          className={`container-site flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-editorial)] ${
            scrolled ? "h-[4.25rem]" : "h-[5.5rem]"
          }`}
        >
          <Link href="/" aria-label={t("homeAria")} className="shrink-0">
            <Logo variant={headerLight ? "light" : "dark"} />
          </Link>

          <nav aria-label={t("primary")} className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`link-line py-1 text-[0.8125rem] font-medium tracking-[0.04em] ${active ? "" : "opacity-80 hover:opacity-100"}`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block"><LanguageSwitcher tone={tone} /></span>
            <span className="hidden md:block">
              <Link
                href="/property-management#consultation"
                className={buttonClasses(headerLight ? "outline-light" : "solid", "min-h-11 px-5 text-[0.6875rem]")}
              >
                {t("listProperty")}
              </Link>
            </span>
            <MobileMenu tone={tone} />
          </div>
        </div>
      </header>
      {/* Spacer for pages without an overlay hero */}
      {!overlay && <div aria-hidden="true" className="h-[5.5rem]" />}
    </>
  );
}
