import type { ReactNode } from "react";
import "./globals.css";

// The <html> and <body> tags live in app/[locale]/layout.tsx so the `lang`
// attribute always matches the active language.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
