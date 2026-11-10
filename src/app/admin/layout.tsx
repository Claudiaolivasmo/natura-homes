import type { ReactNode } from "react";

// Admin pages live outside [locale], so they need their own document shell.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
