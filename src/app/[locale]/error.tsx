"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors.generic");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow text-mist">{t("eyebrow")}</p>
      <h1 className="mt-5 max-w-3xl text-display-lg">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lede text-mist">{t("text")}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button type="button" onClick={reset} className={buttonClasses("solid")}>{t("retry")}</button>
        <Link href="/" className={buttonClasses("outline")}>{t("home")}</Link>
      </div>
    </section>
  );
}
