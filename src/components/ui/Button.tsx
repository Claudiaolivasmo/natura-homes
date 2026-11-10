import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Variant = "solid" | "outline" | "light" | "outline-light" | "text" | "text-light";

const base =
  "group/btn inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-[background-color,color,border-color] duration-500 ease-[var(--ease-editorial)] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-ivory hover:bg-ink-soft",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  light: "bg-ivory text-ink hover:bg-sand",
  "outline-light": "border border-ivory/45 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
  text: "min-h-0 px-0 py-1 text-ink",
  "text-light": "min-h-0 px-0 py-1 text-ivory",
};

export function buttonClasses(variant: Variant = "solid", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/btn:translate-x-1"
      strokeWidth={1.5}
    />
  );
}

type LinkHref = ComponentProps<typeof Link>["href"];

interface ButtonLinkProps {
  href: LinkHref | string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function ButtonLink({ href, children, variant = "solid", arrow = false, external = false, className, ariaLabel }: ButtonLinkProps) {
  const cls = buttonClasses(variant, className);
  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        <span>{children}</span>
        {arrow && <Arrow />}
      </a>
    );
  }
  if (external && typeof href === "string") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={ariaLabel}>
        <span>{children}</span>
        {arrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link href={href as LinkHref} className={cls} aria-label={ariaLabel}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}
