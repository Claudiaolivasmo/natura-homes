"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import type { ImageAsset, VideoAsset } from "@/schemas/content";
import { localize } from "@/lib/i18n-content";
import { withBasePath } from "@/config/paths";

type MediaItem =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string; title: string };

interface MediaGalleryProps {
  images: ImageAsset[];
  videos: VideoAsset[];
  /** Used for accessible labels, e.g. the property name */
  title: string;
}

/**
 * Editorial gallery grid + full-screen lightbox.
 * Keyboard: ←/→ to move, Esc to close, Tab stays inside the dialog.
 * Touch: horizontal swipe. Focus returns to the element that opened it.
 */
export function MediaGallery({ images, videos, title }: MediaGalleryProps) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const items: MediaItem[] = [
    ...images.map((img) => ({ kind: "image" as const, src: img.src, alt: localize(img.alt, locale) || title })),
    ...videos.map((v) => ({ kind: "video" as const, src: v.src, poster: v.poster, title: localize(v.title, locale) || title })),
  ];

  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = (i: number, e: MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    setIndex(i);
  };

  if (items.length === 0) return null;

  const preview = items.slice(0, 5);
  const layout = [
    "col-span-6 row-span-2 md:col-span-4", // large lead image
    "col-span-3 md:col-span-2",
    "col-span-3 md:col-span-2",
    "col-span-3 md:col-span-3",
    "col-span-3 md:col-span-3",
  ];

  return (
    <>
      <ul className="grid auto-rows-[minmax(9rem,22vw)] grid-cols-6 gap-2 sm:gap-3 md:auto-rows-[minmax(10rem,16vw)]">
        {preview.map((item, i) => {
          const isLastPreview = i === preview.length - 1 && items.length > preview.length;
          return (
            <li key={`${item.src}-${i}`} className={`${layout[i] ?? "col-span-3"} ${preview.length === 1 ? "!col-span-6" : ""}`}>
              <button
                type="button"
                onClick={(e) => open(i, e)}
                className="group relative block size-full overflow-hidden bg-sand text-left"
                aria-label={t("openItem", { current: i + 1, total: items.length, title })}
              >
                {item.kind === "image" ? (
                  <Image
                    src={withBasePath(item.src)}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink">
                    {item.poster && <Image src={withBasePath(item.poster)} alt="" fill sizes="33vw" className="object-cover opacity-70" />}
                    <span className="relative flex size-14 items-center justify-center rounded-full border border-ivory/60 text-ivory">
                      <Play aria-hidden="true" className="ml-0.5 size-5" strokeWidth={1.5} />
                    </span>
                  </span>
                )}
                {isLastPreview && (
                  <span className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/55 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ivory">
                    <Expand aria-hidden="true" className="size-4" strokeWidth={1.5} />
                    {t("viewAll", { count: items.length })}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {index !== null && (
        <Lightbox
          items={items}
          index={index}
          setIndex={setIndex}
          title={title}
          onClose={() => {
            setIndex(null);
            requestAnimationFrame(() => openerRef.current?.focus());
          }}
        />
      )}
    </>
  );
}

function Lightbox({
  items,
  index,
  setIndex,
  title,
  onClose,
}: {
  items: MediaItem[];
  index: number;
  setIndex: (i: number) => void;
  title: string;
  onClose: () => void;
}) {
  const t = useTranslations("gallery");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const labelId = useId();
  const total = items.length;
  const item = items[index]!;

  const go = useCallback((delta: number) => setIndex((index + delta + total) % total), [index, total, setIndex]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-scroll-locked", "");
    closeRef.current?.focus();
    return () => root.removeAttribute("data-scroll-locked");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "Tab") {
        const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button, video, [href]") ?? []);
        if (!nodes.length) return;
        const first = nodes[0]!;
        const last = nodes[nodes.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Keep the active thumbnail in view
  useEffect(() => {
    thumbsRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  const onTouchStart = (e: TouchEvent) => {
    const p = e.touches[0];
    if (p) touchStart.current = { x: p.clientX, y: p.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    const p = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !p) return;
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  const neighbour = items[(index + 1) % total];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      className="on-dark fixed inset-0 z-[70] flex flex-col bg-[#0f1b1f] text-ivory"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <p id={labelId} className="text-[0.8125rem] tracking-wide text-ivory/80">
          <span className="sr-only">{title}. </span>
          <span aria-live="polite">{t("counter", { current: index + 1, total })}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t("close")} className="flex size-11 items-center justify-center text-ivory hover:text-sage">
          <X aria-hidden="true" className="size-6" strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="relative size-full">
          {item.kind === "image" ? (
            <Image key={item.src} src={withBasePath(item.src)} alt={item.alt} fill sizes="100vw" className="object-contain" priority />
          ) : (
            <video key={item.src} src={withBasePath(item.src)} poster={item.poster ? withBasePath(item.poster) : undefined} controls playsInline preload="metadata" className="absolute inset-0 m-auto max-h-full max-w-full" aria-label={item.title} />
          )}
        </div>
        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t("previous")} className="absolute left-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center text-ivory/80 hover:text-ivory sm:left-4">
              <ChevronLeft aria-hidden="true" className="size-8" strokeWidth={1} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t("next")} className="absolute right-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center text-ivory/80 hover:text-ivory sm:right-4">
              <ChevronRight aria-hidden="true" className="size-8" strokeWidth={1} />
            </button>
          </>
        )}
        {/* Preload the next image for snappy navigation */}
        {neighbour?.kind === "image" && (
          <Image src={withBasePath(neighbour.src)} alt="" width={16} height={16} sizes="100vw" className="pointer-events-none absolute size-px opacity-0" aria-hidden="true" />
        )}
      </div>

      {total > 1 && (
        <ul ref={thumbsRef} className="flex h-24 shrink-0 gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6" aria-label={t("thumbnails")}>
          {items.map((m, i) => (
            <li key={`${m.src}-${i}`} data-i={i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("goTo", { current: i + 1, total })}
                aria-current={i === index ? "true" : undefined}
                className={`relative block h-[4.5rem] w-24 overflow-hidden transition-opacity duration-300 ${i === index ? "opacity-100 ring-1 ring-ivory" : "opacity-45 hover:opacity-80"}`}
              >
                {m.kind === "image" ? (
                  <Image src={withBasePath(m.src)} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center bg-ink-soft">
                    <Play aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body,
  );
}
