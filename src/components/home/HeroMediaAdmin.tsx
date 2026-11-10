"use client";
import { useEffect, useState } from "react";
import { defaultHeroMedia, type HeroMediaConfig } from "@/config/hero-media";
import { HeroMedia } from "./HeroMedia";
const fields: { key: keyof Omit<HeroMediaConfig, "mode">; label: string; help: string }[] = [
  { key: "desktopVideo", label: "Desktop video", help: "/videos/hero-desktop-v2.webm" },
  { key: "mobileVideo", label: "Mobile video", help: "/videos/hero-desktop-v2.webm" },
  { key: "desktopImage", label: "Desktop fallback image", help: "/images/hero-desktop.webp" },
  { key: "mobileImage", label: "Mobile fallback image", help: "/images/hero-mobile.avif" },
  { key: "poster", label: "Video poster", help: "/images/hero-poster.jpg" },
];
export function HeroMediaAdmin() {
  const [config, setConfig] = useState<HeroMediaConfig>(defaultHeroMedia);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const load = async () => { const r = await fetch("/api/admin/hero", { cache: "no-store" }); if (r.ok) { setConfig(await r.json() as HeroMediaConfig); setAuthorized(true); } };
  useEffect(() => { void load(); }, []);
  const login = async () => { const r = await fetch("/api/admin/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); setPassword(""); if (r.ok) { setMessage(""); await load(); } else setMessage("Incorrect credentials or missing server configuration."); };
  const save = async () => { const r = await fetch("/api/admin/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) }); setMessage(r.ok ? "Published successfully." : ((await r.json() as { error?: string }).error || "Unable to publish.")); };
  return <main className="min-h-screen bg-[#f7f5ef] px-6 py-16 text-[#1A2E35]"><div className="mx-auto max-w-5xl">
    <p className="text-xs uppercase tracking-[.25em]">Natura Homes / Homepage</p><h1 className="mt-4 font-serif text-5xl">Hero Media</h1>
    {!authorized ? <div className="mt-12 max-w-sm space-y-4"><label className="block text-sm">Administrator password<input className="mt-2 w-full border border-[#1A2E35]/30 bg-white p-3" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void login(); }} /></label><button onClick={() => void login()} className="bg-[#1A2E35] px-6 py-3 text-white">Sign in</button></div> : <div className="mt-10 space-y-8">
      <div className="flex items-center gap-6"><label className="text-sm">Media mode <select className="ml-3 border p-2" value={config.mode} onChange={e => setConfig({ ...config, mode: e.target.value as HeroMediaConfig["mode"] })}><option value="image">Image</option><option value="video">Video</option></select></label><button className="text-sm underline" onClick={async () => { await fetch("/api/admin/hero", { method: "DELETE" }); setAuthorized(false); }}>Sign out</button></div>
      <div className="grid gap-5 md:grid-cols-2">{fields.map(field => <label key={field.key} className="block text-sm">{field.label}<input className="mt-2 w-full border border-[#1A2E35]/30 bg-white p-3" value={config[field.key]} placeholder={field.help} onChange={e => setConfig({ ...config, [field.key]: e.target.value })} /><span className="mt-1 block text-xs opacity-70">Local public path or HTTPS URL</span></label>)}</div>
      <div><h2 className="mb-3 font-serif text-2xl">Preview (unpublished)</h2><div className="relative h-[400px] overflow-hidden bg-[#1A2E35]"><HeroMedia config={config} /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" /><div className="absolute bottom-10 left-8 text-white"><p className="text-xs uppercase tracking-widest">Natura Homes · La Fortuna</p><p className="mt-4 font-serif text-4xl">Discover a more considered stay.</p><p className="mt-3 text-sm">Preview text only — the live homepage keeps its translated headline and buttons.</p></div></div></div>
      <button onClick={() => void save()} className="bg-[#1A2E35] px-8 py-4 text-white">Save & publish</button>
      <p className="text-sm opacity-75">For local development, place media in public/videos or public/images and enter its URL above. Production uploads require a persistent storage adapter.</p>
    </div>}{message && <p role="status" className="mt-6 text-sm">{message}</p>}
  </div></main>;
}
