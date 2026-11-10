import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const cookieName = "natura_hero_admin";
function signature() {
  const secret = process.env.HERO_ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update("natura-hero-admin-v1").digest("hex");
}
export async function isHeroAdmin() {
  const expected = signature();
  const actual = (await cookies()).get(cookieName)?.value;
  return !!expected && !!actual && actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export async function loginHeroAdmin(password: string) {
  const configured = process.env.HERO_ADMIN_PASSWORD;
  const token = signature();
  if (!configured || !token || password.length !== configured.length || !timingSafeEqual(Buffer.from(password), Buffer.from(configured))) return false;
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
  return true;
}
export async function logoutHeroAdmin() { (await cookies()).delete(cookieName); }
