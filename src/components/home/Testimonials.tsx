import { getTranslations } from "next-intl/server";
import type { Testimonial } from "@/schemas/content";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";

/**
 * Shows guest reviews exactly as written, in their original language,
 * with their source when available. Never rendered when there are none.
 */
export async function Testimonials({ testimonials, locale }: { testimonials: Testimonial[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.stories" });
  const [lead, ...rest] = testimonials;
  if (!lead) return null;

  return (
    <section className="section-y">
      <div className="container-site">
        <SectionIntro index="07" eyebrow={t("eyebrow")} title={t("title")} />
        <Reveal>
          <figure className="mt-16 max-w-5xl">
            <blockquote lang={lead.language} className="font-display text-display-md font-light italic text-ink">
              <p>“{lead.text}”</p>
            </blockquote>
            <Attribution t={lead} />
          </figure>
        </Reveal>
        {rest.length > 0 && (
          <ul className="mt-20 grid gap-12 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((item, i) => (
              <Reveal as="li" key={item.id} delay={(i % 3) * 100}>
                <figure>
                  <blockquote lang={item.language} className="text-[1.0625rem] leading-relaxed text-charcoal">
                    <p>“{item.text}”</p>
                  </blockquote>
                  <Attribution t={item} />
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Attribution({ t }: { t: Testimonial }) {
  const meta = [t.origin, t.source, t.date].filter(Boolean).join("  ·  ");
  return (
    <figcaption className="mt-6 text-[0.875rem]">
      <span className="font-semibold text-ink">{t.author}</span>
      {meta && (
        <span className="text-mist">
          {"  ·  "}
          {t.sourceUrl ? (
            <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{meta}</a>
          ) : (
            meta
          )}
        </span>
      )}
    </figcaption>
  );
}
