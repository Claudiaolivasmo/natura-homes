import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";

interface SectionIntroProps {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  tone?: "dark" | "light";
  align?: "left" | "center";
  size?: "lg" | "md";
  className?: string;
}

export function SectionIntro({ eyebrow, index, title, lede, as: H = "h2", tone = "dark", align = "left", size = "md", className = "" }: SectionIntroProps) {
  const onLight = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {(eyebrow || index) && (
        <Reveal variant="fade">
          <p className={`eyebrow flex items-center gap-4 ${align === "center" ? "justify-center" : ""} ${onLight ? "text-mist" : "text-sage"}`}>
            {index && <span className={onLight ? "text-ink" : "text-ivory"}>{index}</span>}
            {index && <span aria-hidden="true" className={`h-px w-10 ${onLight ? "bg-ink/30" : "bg-ivory/40"}`} />}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <H className={`mt-5 ${size === "lg" ? "text-display-lg" : "text-display-md"} ${onLight ? "text-ink" : "text-ivory"}`}>{title}</H>
      </Reveal>
      {lede && (
        <Reveal delay={160}>
          <p className={`mt-6 text-lede ${onLight ? "text-mist" : "text-ivory/80"} ${align === "center" ? "mx-auto" : ""} max-w-2xl`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
