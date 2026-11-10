import { ImageResponse } from "next/og";

export const alt = "Natura Homes, La Fortuna, Costa Rica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card, used by any page that has no photograph of its own. */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const line = locale === "es" ? "Administración de propiedades y experiencias en La Fortuna" : "Property Management & Guest Experience in La Fortuna";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1A2E35",
          color: "#F7F5F0",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#A5B3A4" }}>Costa Rica</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1 }}>Natura Homes</div>
          <div style={{ fontSize: 34, marginTop: 28, color: "rgba(247,245,240,0.8)", maxWidth: 900 }}>{line}</div>
        </div>
        <div style={{ width: 120, height: 2, background: "#A5B3A4" }} />
      </div>
    ),
    size,
  );
}
