import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Uses the supplied `natura-homes-logo` file once configured in
 * src/config/site.ts. Until then it renders the company name in the display
 * typeface. This is a text fallback, not a replacement logo.
 */
export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  const logo = siteConfig.logo;
  if (logo) {
    const src = variant === "light" && logo.srcLight ? logo.srcLight : logo.src;
    return (
      <Image
        src={src}
        alt={siteConfig.name}
        width={logo.width}
        height={logo.height}
        priority
        className={`h-9 w-auto sm:h-10 ${className}`}
      />
    );
  }
  return (
    <span className={`font-display text-[1.65rem] leading-none tracking-[0.02em] ${variant === "light" ? "text-ivory" : "text-ink"} ${className}`}>
      {siteConfig.name}
    </span>
  );
}
