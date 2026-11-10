"use client";
import { useEffect, useState } from "react";
import type { HeroMediaConfig } from "@/config/hero-media";

function videoType(src: string) {
  return src.split(/[?#]/, 1)[0]?.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
}

export function HeroMedia({ config, fallback = "" }: { config: HeroMediaConfig; fallback?: string }) {
  const [allowVideo, setAllowVideo] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setAllowVideo(!motion.matches && !connection?.saveData);
    update(); motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  const desktopImage = config.desktopImage || config.poster || fallback;
  const mobileImage = config.mobileImage || desktopImage;
  const video = config.mode === "video" && allowVideo && !failed && !!config.desktopVideo;
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-ink">
      {desktopImage && <picture>
        {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={desktopImage} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>}
      {video && <video key={config.desktopVideo + config.mobileVideo} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="none" poster={config.poster || desktopImage || undefined} controls={false} onError={() => setFailed(true)}>
        {config.mobileVideo && <>
          <source src={config.mobileVideo} media="(max-width: 767px)" type={videoType(config.mobileVideo)} />
        </>}
        <source src={config.desktopVideo} type={videoType(config.desktopVideo)} />
      </video>}
    </div>
  );
}
