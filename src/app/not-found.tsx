// Catches requests that fall outside any locale (rare, since the proxy adds one).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#F7F5F0", color: "#1A2E35", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ letterSpacing: "0.2em", fontSize: 12, textTransform: "uppercase" }}>Natura Homes</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 40, margin: "1rem 0" }}>Page not found</h1>
          <a href="/en" style={{ color: "#1A2E35" }}>Return home</a>
        </main>
      </body>
    </html>
  );
}
