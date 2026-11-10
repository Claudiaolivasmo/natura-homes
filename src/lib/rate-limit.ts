import "server-only";

/**
 * Simple fixed-window limiter kept in memory. Good enough for a single
 * server or as a first line of defense. On serverless hosts with many
 * instances, replace with a shared store (Upstash Redis, Vercel KV).
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  entry.count += 1;
  return { ok: entry.count <= limit };
}
