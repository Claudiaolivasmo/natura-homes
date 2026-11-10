import "server-only";
import { createHmac } from "node:crypto";
import type { InquiryInput } from "@/schemas/forms";

export interface DeliveryPayload {
  inquiry: Omit<InquiryInput, "company_website" | "startedAt">;
  meta: { locale: string; page: string; receivedAt: string };
}

const labels: Record<InquiryInput["kind"], string> = {
  consultation: "Property management consultation",
  contact: "Contact form",
  concierge: "Concierge request",
  "property-inquiry": "Property / experience inquiry",
};

function escapeHtml(v: string) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function toRows(inquiry: DeliveryPayload["inquiry"]) {
  return Object.entries(inquiry)
    .filter(([k]) => k !== "consent" && k !== "kind")
    .map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v ?? "")] as const)
    .filter(([, v]) => v !== "");
}

async function sendWebhook(url: string, payload: DeliveryPayload) {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.FORM_WEBHOOK_SECRET;
  if (secret) headers["X-Natura-Signature"] = createHmac("sha256", secret).update(body).digest("hex");
  const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function sendResend(apiKey: string, payload: DeliveryPayload) {
  const to = process.env.FORM_EMAIL_TO;
  const from = process.env.FORM_EMAIL_FROM;
  if (!to || !from) throw new Error("FORM_EMAIL_TO and FORM_EMAIL_FROM are required for email delivery");
  const rows = toRows(payload.inquiry);
  const subject = `${labels[payload.inquiry.kind]}: ${payload.inquiry.name}`;
  const html = `<h2 style="font-family:Georgia,serif;font-weight:400">${escapeHtml(subject)}</h2>
<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#5d6b6f;vertical-align:top">${escapeHtml(k)}</td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`).join("\n")}
<tr><td style="color:#5d6b6f">page</td><td>${escapeHtml(payload.meta.page)}</td></tr>
<tr><td style="color:#5d6b6f">language</td><td>${escapeHtml(payload.meta.locale)}</td></tr>
</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, html, text, reply_to: payload.inquiry.email }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

/**
 * Sends to every configured destination. Succeeds if at least one does.
 * Returns "unconfigured" when no destination is set up.
 */
export async function deliverInquiry(payload: DeliveryPayload): Promise<"sent" | "unconfigured" | "failed"> {
  const tasks: Promise<void>[] = [];
  if (process.env.FORM_WEBHOOK_URL) tasks.push(sendWebhook(process.env.FORM_WEBHOOK_URL, payload));
  if (process.env.RESEND_API_KEY) tasks.push(sendResend(process.env.RESEND_API_KEY, payload));
  if (tasks.length === 0) return "unconfigured";

  const results = await Promise.allSettled(tasks);
  results.forEach((r) => r.status === "rejected" && console.error("[inquiry] delivery failed:", r.reason));
  return results.some((r) => r.status === "fulfilled") ? "sent" : "failed";
}
