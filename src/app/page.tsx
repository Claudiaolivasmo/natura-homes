"use client";

import Link from "next/link";
import { useEffect } from "react";
import { withBasePath } from "@/config/paths";

export default function Home() {
  useEffect(() => {
    window.location.replace(withBasePath("/en/"));
  }, []);

  return (
    <main>
      <p>Redirecting to Natura Homes...</p>
      <Link href="/en/">Continue to Natura Homes</Link>
    </main>
  );
}
