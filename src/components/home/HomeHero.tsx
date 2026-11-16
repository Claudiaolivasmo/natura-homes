import { getTranslations } from "next-intl/server";
import { ArrowDown } from "lucide-react";
import { editorial } from "@/config/media";
import { heroMediaConfig } from "@/config/hero-media";
import { HeroMedia } from "@/components/home/HeroMedia";
import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const heroConfig = heroMediaConfig;

  return (
    <section className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0 motion-safe:animate-[heroImage_2.4s_cubic-bezier(0.22,1,0.36,1)_both]">
        <HeroMedia config={heroConfig} fallback={editorial.hero?.src} />
        {/* Gradient keeps headline contrast on any photograph */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20" />
      </div>

      <div className="container-site relative flex flex-1 flex-col justify-end pb-14 pt-40 sm:pb-20">
        <div className="max-w-5xl">
          <p className="eyebrow flex items-center gap-4 text-sage motion-safe:animate-[heroText_1.2s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]">
            <span aria-hidden="true" className="h-px w-10 bg-ivory/50" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-7 text-display-xl text-ivory motion-safe:animate-[heroText_1.4s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
            {t.rich("title", { em: (c) => <em className="font-light italic">{c}</em> })}
          </h1>
          <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
            <p className="max-w-lg text-lede text-ivory/85 md:col-span-6 motion-safe:animate-[heroText_1.4s_0.55s_cubic-bezier(0.22,1,0.36,1)_both]">
              {t("subtitle")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end motion-safe:animate-[heroText_1.4s_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
              <ButtonLink href="/vacation-rentals" variant="light" arrow>{t("primaryCta")}</ButtonLink>
              <ButtonLink href="/property-management" variant="outline-light">{t("secondaryCta")}</ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-16 hidden items-center justify-between border-t border-ivory/20 pt-6 text-[0.8125rem] text-ivory/70 md:flex">
          <p>{t("location")}</p>
          <a href="#intro" className="inline-flex items-center gap-3 hover:text-ivory">
            <span>{t("scroll")}</span>
            <ArrowDown aria-hidden="true" className="size-4" strokeWidth={1.25} />
          </a>
        </div>
      </div>
    </section>
  );
}
