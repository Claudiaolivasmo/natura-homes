import type { ReactNode } from "react";
import type { ImageAsset } from "@/schemas/content";
import { Reveal } from "@/components/animations/Reveal";
import { MediaFrame } from "@/components/ui/MediaFrame";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  image: ImageAsset | null;
  locale: string;
  actions?: ReactNode;
  tone?: "sand" | "sage" | "ink";
  variant?: "split" | "fullBleed";
}

/**
 * Interior page opener. The default remains the editorial split layout;
 * fullBleed is opt-in for cinematic internal-page openers.
 */
export function PageHero({ eyebrow, title, lede, image, locale, actions, tone = "sand", variant = "split" }: PageHeroProps) {
  if (variant === "fullBleed") {
    return (
      <section className="relative isolate h-[94svh] min-h-[40rem] w-full overflow-hidden bg-ink text-ivory lg:h-[94vh] lg:min-h-[38rem]">
        <MediaFrame
          image={image}
          locale={locale}
          fill
          priority
          tone={tone}
          sizes="100vw"
          className="-z-10"
          objectPosition="center 55%"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-ink/5" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/15" />

        <div className="container-site relative flex h-full items-end pb-[clamp(3.25rem,9vh,8rem)] pt-32 sm:pt-36">
          <div className="max-w-[46rem]">
            <Reveal variant="fade">
              <p className="eyebrow flex items-center gap-4 text-ivory/90">
                <span aria-hidden="true" className="h-px w-10 bg-ivory/60" />
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-5 text-display-xl text-ivory lg:max-w-[42rem]">{title}</h1>
            </Reveal>
            {lede && (
              <Reveal delay={200}>
                <p className="mt-6 max-w-[38rem] text-lede text-ivory/85">{lede}</p>
              </Reveal>
            )}
            {actions && (
              <Reveal delay={280}>
                <div className="mt-8 flex flex-wrap gap-4 sm:mt-10">{actions}</div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pt-20 lg:pb-28">
      <div className="container-site grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pb-12">
          <Reveal variant="fade">
            <p className="eyebrow flex items-center gap-4 text-mist">
              <span aria-hidden="true" className="h-px w-10 bg-ink/30" />
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-display-xl text-ink">{title}</h1>
          </Reveal>
          {lede && (
            <Reveal delay={200}>
              <p className="mt-8 max-w-xl text-lede text-mist">{lede}</p>
            </Reveal>
          )}
          {actions && (
            <Reveal delay={280}>
              <div className="mt-10 flex flex-wrap gap-4">{actions}</div>
            </Reveal>
          )}
        </div>
        <Reveal variant="mask" className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <MediaFrame image={image} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 45vw, 100vw" priority tone={tone} />
        </Reveal>
      </div>
    </section>
  );
}
