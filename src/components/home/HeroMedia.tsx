"use client";
import { useEffect, useState } from "react";
import type { HeroMediaConfig } from "@/config/hero-media";
import { withBasePath } from "@/config/paths";

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
  const desktopImage = withBasePath(config.desktopImage || config.poster || fallback);
  const mobileImage = withBasePath(config.mobileImage || config.desktopImage || config.poster || fallback);
  const desktopVideo = withBasePath(config.desktopVideo);
  const mobileVideo = withBasePath(config.mobileVideo);
  const poster = withBasePath(config.poster || desktopImage);
  const video = config.mode === "video" && allowVideo && !failed && !!desktopVideo;
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-ink">
      {desktopImage && <picture>
        {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={desktopImage} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>}
      {video && <video key={desktopVideo + mobileVideo} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="none" poster={poster || undefined} controls={false} onError={() => setFailed(true)}>
        {mobileVideo && <>
          <source src={mobileVideo} media="(max-width: 767px)" type={videoType(mobileVideo)} />
        </>}
        <source src={desktopVideo} type={videoType(desktopVideo)} />
      </video>}
    </div>
  );
}
