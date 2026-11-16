import staticHeroMedia from "../../data/hero-media.json";

export type HeroMediaConfig = {
  mode: "image" | "video";
  desktopVideo: string;
  mobileVideo: string;
  desktopImage: string;
  mobileImage: string;
  poster: string;
};

export const defaultHeroMedia: HeroMediaConfig = {
  mode: "image",
  desktopVideo: "",
  mobileVideo: "",
  desktopImage: "",
  mobileImage: "",
  poster: "",
};

export function validHeroMedia(value: unknown): value is HeroMediaConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.mode !== "image" && v.mode !== "video") return false;
  return (["desktopVideo", "mobileVideo", "desktopImage", "mobileImage", "poster"] as const).every((key) => {
    const item = v[key];
    return typeof item === "string" && (item === "" || item.startsWith("/videos/") || item.startsWith("/images/") || /^https:\/\//.test(item));
  });
}

export const heroMediaConfig: HeroMediaConfig = validHeroMedia(staticHeroMedia) ? staticHeroMedia : defaultHeroMedia;
