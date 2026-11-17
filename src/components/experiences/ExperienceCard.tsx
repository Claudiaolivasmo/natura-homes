import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { ExperienceCardData } from "@/lib/view-models";
import { formatPrice } from "@/lib/format";
import { localize } from "@/lib/i18n-content";

interface Props {
  experience: ExperienceCardData;
  ratio?: string;
  tone?: "sand" | "sage" | "ink";
  headingLevel?: "h2" | "h3";
  onDark?: boolean;
  sizes?: string;
  showCategory?: boolean;
}

export function ExperienceCard({ experience, ratio = "3 / 4", tone = "sand", headingLevel: H = "h3", onDark = false, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw", showCategory = true }: Props) {
  const t = useTranslations("concierge");
  const locale = useLocale();
  const priceLabel = (() => {
    if (!experience.pricing && experience.legacyPrice) {
      return `${formatPrice(experience.legacyPrice.amount, experience.legacyPrice.currency, locale)}${localize(experience.legacyPrice.unit, locale) ? ` ${localize(experience.legacyPrice.unit, locale)}` : ""}`;
    }
    if (!experience.pricing) return null;
    if (experience.pricing.type === "from") return `${t("pricing.from")} ${formatPrice(experience.pricing.amount, experience.pricing.currency, locale)} USD`;
    if (experience.pricing.type === "per_person") return `${formatPrice(experience.pricing.amount, experience.pricing.currency, locale)} ${t("pricing.perPerson")}`;
    if (experience.pricing.type === "per_group") return `${formatPrice(experience.pricing.amount, experience.pricing.currency, locale)} ${t("pricing.perGroup")}`;
    if (experience.pricing.type === "per_option") {
      const confirmedAmounts = experience.pricing.options.filter((option) => option.confirmed !== false).map((option) => option.amount);
      if (confirmedAmounts.length === 0) return t("pricing.onRequest") ?? null;
      const minimum = confirmedAmounts.reduce((lowest, amount) => Math.min(lowest, amount), confirmedAmounts[0] ?? 0);
      return `${t("pricing.from")} ${formatPrice(minimum, experience.pricing.currency, locale)} USD`;
    }
    if (experience.pricing.type === "per_age") {
      const minimum = experience.pricing.rates.reduce((lowest, rate) => Math.min(lowest, rate.amount), experience.pricing.rates[0]?.amount ?? 0);
      return `${t("pricing.from")} ${formatPrice(minimum, experience.pricing.currency, locale)} USD`;
    }
    if (experience.pricing.type === "per_duration") {
      const minimum = experience.pricing.durations.reduce((lowest, item) => Math.min(lowest, item.amount), experience.pricing.durations[0]?.amount ?? 0);
      return `${t("pricing.from")} ${formatPrice(minimum, experience.pricing.currency, locale)} USD`;
    }
    return null;
  })();

  return (
    <article className="group relative">
      {experience.image && <MediaFrame image={experience.image} locale={locale} ratio={ratio} tone={tone} sizes={sizes} />}
      {showCategory && <p className={`eyebrow mt-5 ${onDark ? "text-sage" : "text-mist"}`}>{t(`categories.${experience.category}`)}</p>}
      <H className={`${showCategory ? "mt-2" : "mt-5"} text-display-sm ${onDark ? "text-ivory" : "text-ink"}`}>
        <Link
          href={experience.slug === "harmony" ? "/experiences/harmony" : `/concierge/${experience.slug}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {experience.title}
        </Link>
      </H>
      {experience.summary && <p className={`mt-3 text-[0.9375rem] leading-relaxed ${onDark ? "text-ivory/70" : "text-mist"}`}>{experience.summary}</p>}
      {priceLabel && <p className={`mt-4 text-sm font-semibold ${onDark ? "text-ivory" : "text-ink"}`}>{priceLabel}</p>}
      <span aria-hidden="true" className={`mt-4 inline-block border-b pb-1 text-xs font-semibold tracking-wide transition-opacity group-hover:opacity-60 ${onDark ? "border-ivory/60 text-ivory" : "border-ink/50 text-ink"}`}>{t("exploreExperience")} →</span>
    </article>
  );
}
