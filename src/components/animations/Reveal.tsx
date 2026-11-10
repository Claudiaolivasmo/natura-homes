import type { CSSProperties, ElementType, ReactNode } from "react";

type Variant = "up" | "fade" | "mask";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  /** Delay in ms, used for staggering siblings */
  delay?: number;
  className?: string;
  id?: string;
}

/**
 * Server-rendered wrapper. It only adds a data attribute; the shared
 * RevealObserver and CSS in globals.css do the rest, so no JS ships per use.
 */
export function Reveal({ children, as: Tag = "div", variant = "up", delay = 0, className, id }: RevealProps) {
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag id={id} data-reveal={variant === "up" ? "" : variant} className={className} style={style}>
      {children}
    </Tag>
  );
}
