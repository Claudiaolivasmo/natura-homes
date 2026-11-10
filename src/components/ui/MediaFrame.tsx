import Image from "next/image";
import type { ImageAsset } from "@/schemas/content";
import { localize } from "@/lib/i18n-content";

interface MediaFrameProps {
  image: ImageAsset | null | undefined;
  locale: string;
  /** CSS aspect ratio, e.g. "4 / 5". Ignored when `fill` is used by a parent-sized box. */
  ratio?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Tone for the placeholder shown while photography is pending */
  tone?: "sand" | "sage" | "ink";
  zoom?: boolean;
  /** Fill the nearest positioned parent instead of using an aspect ratio */
  fill?: boolean;
  /** Optional object-position override for full-bleed media */
  objectPosition?: string;
}

/**
 * Every editorial and listing image goes through here. When an image is not
 * yet supplied, a toned placeholder with the same proportions keeps the
 * composition intact. The placeholder is decorative and hidden from
 * assistive technology.
 */
export function MediaFrame({ image, locale, ratio = "4 / 5", sizes, priority, className = "", tone = "sand", zoom = true, fill = false, objectPosition }: MediaFrameProps) {
  const frameStyle = fill ? undefined : { aspectRatio: ratio };
  const frameClass = `${fill ? "absolute inset-0" : "relative w-full"} ${zoom ? "zoom-frame" : "overflow-hidden"} ${className}`;

  if (!image) {
    return (
      <div className={frameClass} style={frameStyle}>
        <Placeholder tone={tone} />
      </div>
    );
  }

  return (
    <div className={`${frameClass} bg-sand`} style={frameStyle}>
      <Image
        src={image.src}
        alt={localize(image.alt, locale)}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}

const tones = {
  sand: { bg: "#E9E3D9", line: "#1A2E35", opacity: 0.09 },
  sage: { bg: "#A5B3A4", line: "#1A2E35", opacity: 0.14 },
  ink: { bg: "#22393F", line: "#F7F5F0", opacity: 0.1 },
};

/** Contour-line placeholder, a quiet nod to the volcanic landscape. */
function Placeholder({ tone }: { tone: keyof typeof tones }) {
  const t = tones[tone];
  return (
    <div aria-hidden="true" className="zoom-target absolute inset-0" style={{ background: t.bg }}>
      <svg className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 500">
        <g fill="none" stroke={t.line} strokeOpacity={t.opacity} strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => {
            const r = 40 + i * 34;
            return (
              <path
                key={i}
                d={`M ${200 - r} ${330} C ${200 - r} ${330 - r * 0.9}, ${200 - r * 0.25} ${330 - r * 1.05}, 200 ${330 - r * 1.02} S ${200 + r} ${330 - r * 0.8}, ${200 + r} ${330} S ${200 + r * 0.4} ${330 + r * 0.6}, 200 ${330 + r * 0.55} S ${200 - r} ${330 + r * 0.45}, ${200 - r} ${330} Z`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
