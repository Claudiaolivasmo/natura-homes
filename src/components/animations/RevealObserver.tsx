"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __nhReveal?: boolean;
  }
}

/**
 * One IntersectionObserver for the whole site. It watches every element with
 * `data-reveal` (including ones added after client navigation) and marks it
 * `data-revealed` once it enters the viewport. Animations themselves are CSS.
 */
export function RevealObserver() {
  useEffect(() => {
    window.__nhReveal = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      const mo = new MutationObserver(() => document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(reveal));
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observeAll = () =>
      document.querySelectorAll("[data-reveal]:not([data-revealed]):not([data-observed])").forEach((el) => {
        el.setAttribute("data-observed", "");
        io.observe(el);
      });

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
