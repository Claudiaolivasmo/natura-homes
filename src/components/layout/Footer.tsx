import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { Link } from "@/i18n/navigation";
import { navItems, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { withBasePath } from "@/config/paths";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const { email, whatsappDisplay, whatsappUrl } = siteConfig.contact;
  const { instagram, instagramHandle, facebook } = siteConfig.social;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-ivory">
      <div className="container-site pb-8 pt-16 sm:pb-10 sm:pt-24">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 border-b border-ivory/15 pb-12 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-[1.25fr_0.9fr_1.15fr_0.9fr] lg:gap-x-8 lg:gap-y-0 lg:pb-14 xl:gap-x-12">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Image
                src={withBasePath("/branding/natura-homes-symbol.png")}
                alt=""
                aria-hidden="true"
                width={520}
                height={680}
                className="h-[5.5rem] w-auto"
                priority
              />
              <Logo variant="light" className="mt-4" />
            </div>
            <p className="mx-auto mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-ivory/70">{t("tagline")}</p>
            <p className="mt-6 flex items-center justify-center gap-3 text-[0.875rem] text-ivory/70">
              <MapPin aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
              {t("serviceArea")}
            </p>
          </div>

          <nav aria-label={t("navLabel")}>
            <h2 className="eyebrow text-sage">{t("explore")}</h2>
            <ul className="mt-6 space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="link-line text-[0.9375rem] text-ivory/85 hover:text-ivory">
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-sage">{t("contact")}</h2>
            <ul className="mt-6 space-y-4 text-[0.9375rem]">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-ivory/85 transition-colors hover:text-ivory">
                  <WhatsAppIcon className="size-4 shrink-0" />
                  <span className="link-line">{whatsappDisplay}</span>
                </a>
              </li>
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-3 text-ivory/85 transition-colors hover:text-ivory">
                    <Mail aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="link-line">{email}</span>
                  </a>
                </li>
              )}
              <li className="pt-1">
                <Link href="/about-contact#contact" className="link-line text-ivory/85 hover:text-ivory">
                  {t("contactForm")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-sage">{t("social")}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label={t("instagramLabel")} className="group inline-flex items-center gap-3 text-ivory/85 transition-colors hover:text-ivory">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-ivory/20 transition-colors group-hover:border-ivory">
                      <InstagramIcon className="size-4" />
                    </span>
                    <span className="link-line text-[0.9375rem]">{instagramHandle}</span>
                  </a>
                </li>
              )}
              {facebook && (
                <li>
                  <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label={t("facebookLabel")} className="group inline-flex items-center gap-3 text-ivory/85 transition-colors hover:text-ivory">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-ivory/20 transition-colors group-hover:border-ivory">
                      <FacebookIcon className="size-4" />
                    </span>
                    <span className="link-line text-[0.9375rem]">{siteConfig.social.facebookHandle}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-[0.8125rem] text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              {t("location")}
            </p>
            <Link href="/privacy" className="link-line hover:text-ivory">{t("privacy")}</Link>
            <Link href="/terms" className="link-line hover:text-ivory">{t("terms")}</Link>
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      </div>
    </footer>
  );
}
