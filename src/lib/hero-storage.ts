import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultHeroMedia, validHeroMedia, type HeroMediaConfig } from "@/config/hero-media";

// Local development adapter. For production, use a persistent DB for this config
// and object storage (Cloudinary, S3, Vercel Blob) for uploaded media.
const file = path.join(process.cwd(), "data", "hero-media.json");
export async function readHeroMedia(): Promise<HeroMediaConfig> {
  try { const data: unknown = JSON.parse(await fs.readFile(file, "utf8")); return validHeroMedia(data) ? data : defaultHeroMedia; }
  catch { return defaultHeroMedia; }
}
export async function writeHeroMedia(config: HeroMediaConfig) {
  if (process.env.NODE_ENV === "production") throw new Error("Configure persistent production storage before publishing");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(config, null, 2), "utf8");
}
