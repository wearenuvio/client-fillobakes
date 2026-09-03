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
 * It animates through the Web Animations API rather than by adding a class.
 * The targets are server-rendered nodes that React owns, and this component
 * lives in the layout, which hydrates before the page segment underneath it:
 * adding a class here would land on the DOM *between* the two, and React would
 * find markup it did not write and log a hydration mismatch on every load. A
 * WAAPI effect changes no attribute, so there is nothing for React to compare
 * — and the animation is the same 400ms ease-out either way.
 *
 * Anything already on screen at mount is revealed immediately, so the first
 * viewport never animates in under the reader.
 */

const DURATION_MS = 400;
/** `--ease-out` in globals.css. Kept in step by hand; it is one curve. */
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Revealed once, and once means once: a node that has already played is not
 * re-hidden when the effect re-runs on a client navigation. A WeakSet rather
 * than a data attribute, for the same reason the animation is not a class.
 */
const revealed = new WeakSet<Element>();

export function RevealOnScroll() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof Element.prototype.animate !== "function") return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((el) => !revealed.has(el));
    if (targets.length === 0) return;

    // Paused at frame zero with `fill: both`, so the element holds the hidden
    // state until it is played and the final state forever after.
    const held = new Map<Element, Animation>();
    for (const el of targets) {
      const animation = el.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: DURATION_MS, easing: EASING, fill: "both" },
      );
      animation.pause();
      animation.currentTime = 0;
      held.set(el, animation);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          revealed.add(el);
          held.get(el)?.play();
          held.delete(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    for (const el of targets) observer.observe(el);

    return () => {
      observer.disconnect();
      // Anything still waiting when the route changes is left visible rather
      // than stuck at opacity 0.
      for (const animation of held.values()) animation.finish();
    };
  }, [pathname]);

  return null;
}
