import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("errors.notFound");
  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow text-mist">404</p>
      <h1 className="mt-5 max-w-3xl text-display-lg">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lede text-mist">{t("text")}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/" arrow>{t("home")}</ButtonLink>
        <ButtonLink href="/vacation-rentals" variant="outline">{t("stays")}</ButtonLink>
      </div>
    </section>
  );
}
