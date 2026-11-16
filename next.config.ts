import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { basePath } from "./src/config/paths";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  experimental: { agentUpgrade: "security" },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 2048, 2560],
    // Add remote hosts here when media moves to a CMS or CDN, e.g. cdn.sanity.io
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
