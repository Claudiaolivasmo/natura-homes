import { NextResponse } from "next/server";
import { isHeroAdmin, loginHeroAdmin, logoutHeroAdmin } from "@/lib/hero-auth";
import { readHeroMedia, writeHeroMedia } from "@/lib/hero-storage";
import { validHeroMedia } from "@/config/hero-media";
export const runtime = "nodejs";
export async function GET() {
  if (!(await isHeroAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readHeroMedia(), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || typeof (body as { password?: unknown }).password !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const ok = await loginHeroAdmin((body as { password: string }).password);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
export async function PUT(request: Request) {
  if (!(await isHeroAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const body: unknown = await request.json().catch(() => null);
  if (!validHeroMedia(body)) return NextResponse.json({ error: "Invalid media configuration" }, { status: 400 });
  try { await writeHeroMedia(body); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Persistent production storage must be configured" }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  await logoutHeroAdmin(); return NextResponse.json({ ok: true });
}
