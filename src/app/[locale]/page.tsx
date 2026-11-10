import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { editorial } from "@/config/media";
import { HomeHero } from "@/components/home/HomeHero";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ButtonLink } from "@/components/ui/Button";
import { RentalCard } from "@/components/properties/RentalCard";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { Testimonials } from "@/components/home/Testimonials";
import { getFeaturedExperiences, getFeaturedVacationRentals, getTestimonials } from "@/lib/content";
import { toExperienceCard, toRentalCard } from "@/lib/view-models";
import { asLocale } from "@/lib/i18n-content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...buildMetadata({ locale, path: "/", title: t("homeTitle"), description: t("defaultDescription"), image: editorial.hero?.src }),
    title: { absolute: t("homeTitle") },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const [rentals, experiences, testimonials] = await Promise.all([
    getFeaturedVacationRentals(4),
    getFeaturedExperiences(7),
    getTestimonials(),
  ]);

  const expertise = [
    { key: "management", href: "/property-management", image: editorial.expertiseManagement, tone: "sand" as const, offset: "" },
    { key: "rentals", href: "/vacation-rentals", image: editorial.expertiseRentals, tone: "sage" as const, offset: "md:mt-24" },
    { key: "concierge", href: "/concierge", image: editorial.expertiseConcierge, tone: "sand" as const, offset: "md:mt-10" },
  ];

  const principles = ["personal", "local", "professional", "detail", "care", "transparency"] as const;
  const benefits = ["b1", "b2", "b3", "b4"] as const;

  return (
    <>
      <HomeHero locale={locale} />

      {/* 2. Brand introduction */}
      <section id="intro" className="section-y overflow-hidden">
        <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:pt-16">
            <SectionIntro index="01" eyebrow={t("intro.eyebrow")} title={t("intro.title")} />
            <Reveal delay={200}>
              <div className="mt-10 max-w-xl space-y-5 text-lede text-mist">
                <p>{t("intro.p1")}</p>
                <p>{t("intro.p2")}</p>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <ButtonLink href="/about-contact" variant="text" arrow className="mt-10">{t("intro.cta")}</ButtonLink>
            </Reveal>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <Reveal variant="mask" className="ml-auto w-[82%]">
              <MediaFrame image={editorial.introPrimary} locale={locale} ratio="3 / 4" sizes="(min-width: 1024px) 35vw, 80vw" />
            </Reveal>
            <Reveal variant="mask" delay={250} className="-mt-28 w-[52%] border-[10px] border-ivory sm:-mt-40">
              <MediaFrame image={editorial.introSecondary} locale={locale} ratio="4 / 5" tone="sage" sizes="(min-width: 1024px) 22vw, 50vw" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Our expertise */}
      <section className="section-y bg-sand/60">
        <div className="container-site">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionIntro index="02" eyebrow={t("expertise.eyebrow")} title={t("expertise.title")} />
          </div>
          <ul className="mt-16 grid gap-16 md:grid-cols-3 md:gap-8 lg:gap-12">
            {expertise.map((item, i) => (
              <li key={item.key} className={item.offset}>
                <Reveal delay={i * 120}>
                  <article className="group relative">
                    <MediaFrame image={item.image} locale={locale} ratio={i === 1 ? "3 / 4" : "4 / 5"} tone={item.tone} sizes="(min-width: 768px) 33vw, 100vw" />
                    <div className="mt-6 flex items-baseline gap-4">
                      <span className="eyebrow text-mist">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-display-sm">
                        <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
                          {t(`expertise.${item.key}.title`)}
                        </Link>
                      </h3>
                    </div>
                    <p className="mt-3 max-w-sm pl-10 text-mist">{t(`expertise.${item.key}.text`)}</p>
                    <ArrowUpRight aria-hidden="true" strokeWidth={1.25} className="ml-10 mt-5 size-6 text-ink transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Featured properties */}
      {rentals.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <div className="mx-auto max-w-[1150px]">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <SectionIntro index="03" eyebrow={t("featured.eyebrow")} title={t("featured.title")} lede={t("featured.lede")} />
                <Reveal variant="fade">
                  <ButtonLink href="/vacation-rentals" variant="outline" arrow>{t("featured.cta")}</ButtonLink>
                </Reveal>
              </div>
              <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-20">
                {rentals.map((r, i) => {
                  const single = rentals.length === 1;
                  return (
                    <li key={r.slug} className={single ? "mx-auto w-full max-w-[525px] md:col-span-2" : ""}>
                      <Reveal delay={(i % 2) * 120}>
                        <div className="mx-auto w-full max-w-[525px]">
                          <RentalCard
                            rental={toRentalCard(r, locale)}
                            ratio="3 / 2"
                            sizes="(min-width: 1280px) 525px, (min-width: 768px) calc((100vw - 128px) / 2), 100vw"
                          />
                        </div>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 5. Property management split */}
      <section className="on-dark bg-ink text-ivory">
        <div className="grid lg:grid-cols-2">
          <Reveal variant="mask" className="relative min-h-[22rem] lg:min-h-[44rem]">
            <MediaFrame image={editorial.managementSplit} locale={locale} fill tone="ink" sizes="(min-width: 1024px) 50vw, 100vw" />
          </Reveal>
          <div className="flex items-center px-[clamp(1.25rem,6vw,6rem)] py-20 lg:py-28">
            <div className="max-w-xl">
              <SectionIntro tone="light" index="04" eyebrow={t("management.eyebrow")} title={t("management.title")} lede={t("management.lede")} />
              <ul className="mt-12 divide-y divide-ivory/15 border-y border-ivory/15">
                {benefits.map((b, i) => (
                  <Reveal as="li" key={b} delay={i * 80} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                    <span className="eyebrow pt-1 text-sage">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-[1.375rem] leading-snug text-ivory">{t(`management.${b}.title`)}</p>
                      <p className="mt-1 text-[0.9375rem] text-ivory/70">{t(`management.${b}.text`)}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={200}>
                <ButtonLink href="/property-management" variant="light" arrow className="mt-12">{t("management.cta")}</ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Concierge & experiences */}
      {experiences.length > 0 && (
        <section className="section-y overflow-hidden">
          <div className="container-site">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <SectionIntro index="05" eyebrow={t("concierge.eyebrow")} title={t("concierge.title")} lede={t("concierge.lede")} />
              <Reveal variant="fade">
                <ButtonLink href="/concierge" variant="outline" arrow>{t("concierge.cta")}</ButtonLink>
              </Reveal>
            </div>
          </div>
          <div className="container-site mt-14">
            <ul
              className="-mx-[clamp(1.25rem,4vw,3rem)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-6 [scrollbar-width:thin]"
              aria-label={t("concierge.listLabel")}
            >
              {experiences.map((e, i) => (
                <li key={e.slug} className={`w-[78%] shrink-0 snap-start sm:w-[42%] lg:w-[calc(25%-1.125rem)] ${i % 2 === 1 ? "lg:mt-12" : ""}`}>
                  <ExperienceCard experience={toExperienceCard(e, locale)} tone={i % 3 === 1 ? "sage" : "sand"} ratio={i % 2 ? "4 / 5" : "3 / 4"} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Philosophy */}
      <section className="section-y bg-sand/60">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionIntro index="06" eyebrow={t("philosophy.eyebrow")} title={t("philosophy.title")} lede={t("philosophy.lede")} />
            </div>
          </div>
          <ol className="grid border-t border-line sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {principles.map((p, i) => (
              <Reveal as="li" key={p} delay={(i % 2) * 100} className="border-b border-line py-10 sm:odd:pr-10 sm:even:border-l sm:even:pl-10">
                <span className="eyebrow text-mist">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-display-sm">{t(`philosophy.${p}.title`)}</h3>
                <p className="mt-3 text-mist">{t(`philosophy.${p}.text`)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Guest stories (only real, published reviews) */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} locale={locale} />}

      {/* 9. Owner acquisition CTA */}
      <section className="on-dark relative overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 opacity-50">
          <MediaFrame image={editorial.ownerCta} locale={locale} fill zoom={false} tone="ink" sizes="100vw" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-ink/60" />
        <div className="container-site relative py-28 text-center sm:py-40">
          <Reveal variant="fade">
            <p className="eyebrow text-sage">{t("ownerCta.eyebrow")}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mx-auto mt-6 max-w-4xl text-display-lg text-ivory">{t("ownerCta.title")}</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-xl text-lede text-ivory/80">{t("ownerCta.text")}</p>
          </Reveal>
          <Reveal delay={280}>
            <ButtonLink href="/property-management#consultation" variant="light" arrow className="mt-12">{t("ownerCta.cta")}</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
