function normalizeBasePath(value: string | undefined) {
  const path = value?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  return path ? `/${path}` : "";
}

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function withBasePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || !basePath) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
