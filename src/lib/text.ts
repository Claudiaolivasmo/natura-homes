/** "volcano-view" -> "Volcano view". Fallback label for unknown keys. */
export function humanize(key: string) {
  const s = key.replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
