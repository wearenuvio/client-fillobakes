"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Fade-up on scroll — DESIGN-v2 §1 Motion. 400ms, once, never re-animating.
 *
 * Mounted once in the chrome. It finds every `[data-reveal]` element, hides it
 * *from script* and then reveals it as it enters the viewport. Doing it this
 * way round — rather than shipping `opacity: 0` in the CSS — means a visitor
 * whose JavaScript is slow, blocked or broken sees the page in full rather
 * than a column of empty bands, and so does anything that renders the HTML
 * without running it.
 *
 * Anything already on screen at mount is revealed immediately, so the first
 * viewport never animates in under the reader.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((el) => el.dataset.revealed !== "true");
    if (targets.length === 0) return;

    for (const el of targets) el.classList.add("reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.revealed = "true";
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
