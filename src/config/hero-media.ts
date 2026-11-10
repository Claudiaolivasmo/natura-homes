export type HeroMediaConfig = {
  mode: "image" | "video";
  desktopVideo: string;
  mobileVideo: string;
  desktopImage: string;
  mobileImage: string;
  poster: string;
};
export const defaultHeroMedia: HeroMediaConfig = {
  mode: "image", desktopVideo: "", mobileVideo: "",
  desktopImage: "", mobileImage: "", poster: "",
};
export function validHeroMedia(value: unknown): value is HeroMediaConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.mode !== "image" && v.mode !== "video") return false;
  return (["desktopVideo", "mobileVideo", "desktopImage", "mobileImage", "poster"] as const).every(k =>
    typeof v[k] === "string" && (v[k] === "" || (v[k] as string).startsWith("/videos/") || (v[k] as string).startsWith("/images/") || /^https:\/\//.test(v[k] as string))
  );
}
