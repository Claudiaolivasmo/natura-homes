import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/**
 * Plain legal page rendered from translation messages. The copy shipped is
 * a starting draft and must be reviewed by counsel before launch.
 */
export async function LegalPage({ locale, namespace }: { locale: Locale; namespace: "legal.privacy" | "legal.terms" }) {
  const t = await getTranslations({ locale, namespace });
  const sections = t.raw("sections") as { title: string; body: string }[];
  return (
    <article className="container-site max-w-3xl py-20 sm:py-28">
      <p className="eyebrow text-mist">{t("eyebrow")}</p>
      <h1 className="mt-5 text-display-lg">{t("title")}</h1>
      <p className="mt-6 text-[0.875rem] text-mist">{t("updated")}</p>
      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-display-sm">{s.title}</h2>
            <p className="mt-4 text-charcoal/90">{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
