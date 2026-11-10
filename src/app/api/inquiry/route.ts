import { NextResponse, type NextRequest } from "next/server";
import { inquirySchema } from "@/schemas/forms";
import { rateLimit } from "@/lib/rate-limit";
import { deliverInquiry } from "@/lib/form-delivery";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2_500; // faster than any person can fill the form
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // some privacy tools strip it; other checks still apply
  try {
    const o = new URL(origin);
    return o.host === req.nextUrl.host || o.host === new URL(siteConfig.url).host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ ok: false, error: "unsupported" }, 415);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`inquiry:${ip}`).ok) return json({ ok: false, error: "rate_limited" }, 429);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const meta = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const locale = meta.locale === "es" ? "es" : "en";
  const page = typeof meta.page === "string" ? meta.page.slice(0, 300) : "";

  // Honeypot filled: pretend success so bots learn nothing.
  if (typeof meta.company_website === "string" && meta.company_website.length > 0) return json({ ok: true });

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), code: i.message })) }, 422);
  }

  const elapsed = Date.now() - parsed.data.startedAt;
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) return json({ ok: true });

  const { company_website: _hp, startedAt: _ts, ...inquiry } = parsed.data;
  void _hp;
  void _ts;

  const result = await deliverInquiry({ inquiry, meta: { locale, page, receivedAt: new Date().toISOString() } });

  if (result === "unconfigured") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] No delivery configured. Received:", JSON.stringify(inquiry, null, 2));
      return json({ ok: true, dev: true });
    }
    console.error("[inquiry] No delivery destination configured (FORM_WEBHOOK_URL or RESEND_API_KEY).");
    return json({ ok: false, error: "unavailable" }, 503);
  }
  if (result === "failed") return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
}

export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
