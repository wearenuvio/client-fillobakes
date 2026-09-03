"use client";

import * as React from "react";
import Image from "next/image";
import { cutoutVariants } from "@/lib/images";

/**
 * Preloader — the first thing anyone sees, once per session.
 *
 * A flipbook. Eight product cutouts hard-cut through a 160px well at 110ms a
 * frame, which is fast enough to read as one loaf turning into another rather
 * than a slideshow. No cross-fade: the cut is the point, the way a bakery case
 * fills up while you watch. Under it the wordmark and a 120px hairline that
 * fills terracotta.
 *
 * Timing (DESIGN-v2 §1 motion): visible immediately — this renders on the
 * server so there is no flash of page before the overlay — then a floor of
 * 1200ms so the animation is never a blink, exit as soon as both
 * `document.fonts.ready` and window `load` have fired, and a hard ceiling of
 * 2600ms so a slow connection never holds the door shut. Exit slides the whole
 * sheet up over 520ms while the last cutout shrinks slightly, then the node
 * leaves the DOM entirely.
 *
 * Once per session. `sessionStorage.fillo_preloaded` is read by a tiny inline
 * script that runs while the HTML is still parsing, so a reload inside the
 * same session hides the overlay *before* first paint rather than after
 * hydration — the difference between "no preloader" and "a preloader that
 * blinks". React then unmounts it in a layout effect.
 *
 * The scroll lock is pure CSS (`html:has(.fillo-preloader…)` in globals.css)
 * rather than a class this component adds to `<html>`: no JS has to run for
 * the page to be held still, and nothing mutates an attribute React owns.
 *
 * Reduced motion gets one still cutout and the wordmark for 600ms and a fade.
 * Nothing cycles, nothing slides.
 *
 * The overlay is `position: fixed` and contributes nothing to flow, so the
 * page underneath lays out normally the whole time and there is no shift when
 * it goes.
 */

/** The eight bakes from the home bestsellers row, in that order. */
const FRAME_SLUGS = [
  "milk-shokupan",
  "custard-anpan",
  "seoul-spice",
  "fruit-sando",
  "strawberry-anpan",
  "japanese-marble-bread",
  "kyoto-curry",
  "blue-pea-bread",
] as const;

/**
 * Resolved through the manifest rather than hardcoded, so a slug that has not
 * landed on disk drops out of the flipbook instead of rendering a broken img.
 */
const FRAMES: string[] = FRAME_SLUGS.map(
  (slug) => cutoutVariants(slug).v1,
).filter((src): src is string => src !== null);

const SESSION_KEY = "fillo_preloaded";
/** Marks the overlay as "this session has already seen it" before hydration. */
const SKIP_CLASS = "fillo-skip";

const FRAME_MS = 110;
const MIN_MS = 1200;
const MAX_MS = 2600;
const EXIT_MS = 520;
const REDUCED_HOLD_MS = 600;
const REDUCED_FADE_MS = 320;

/**
 * Runs during HTML parse, before paint. One job: if this session has already
 * seen the preloader, flag the overlay so CSS hides it and releases the scroll
 * lock — before the first frame, not after hydration.
 *
 * It touches the overlay and nothing else. Mutating `<html>` here (the usual
 * theme-script trick) would make React's hydration compare a className it owns
 * against one it never rendered and log a mismatch on every load; the overlay
 * carries `suppressHydrationWarning` precisely because it is the one element
 * this script is allowed to edit.
 */
const BOOT_SCRIPT = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(
  SESSION_KEY,
)})==="1"){var n=document.currentScript&&document.currentScript.parentNode;if(n)n.className+=" "+${JSON.stringify(
  SKIP_CLASS,
)};}}catch(e){}})();`;

type Phase = "visible" | "exiting" | "gone";

export function Preloader() {
  const [phase, setPhase] = React.useState<Phase>("visible");
  const [frame, setFrame] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  const loadedRef = React.useRef(0);
  const exitedRef = React.useRef(false);

  /**
   * The skip decision has to happen before paint, not after: a state update
   * from a passive effect would let one frame of overlay through on every
   * reload. `useLayoutEffect` plus the boot script covers both the hydrated
   * and the not-yet-hydrated case.
   */
  React.useLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode, or storage disabled. Show it; it is only 2.6s.
    }
    if (seen) {
      exitedRef.current = true;
      setPhase("gone");
      return;
    }
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
  }, []);

  /** Exactly one exit, whichever clock gets there first. */
  const beginExit = React.useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setPhase("exiting");
  }, []);

  React.useEffect(() => {
    if (phase !== "visible") return;

    const start = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduced) {
      timers.push(setTimeout(beginExit, REDUCED_HOLD_MS));
      return () => timers.forEach(clearTimeout);
    }

    const fonts: Promise<unknown> =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

    let cancelled = false;
    void Promise.all([fonts, loaded]).then(() => {
      if (cancelled) return;
      // Honour the floor: the flipbook gets its 1200ms even on a warm cache.
      timers.push(
        setTimeout(beginExit, Math.max(0, MIN_MS - (Date.now() - start))),
      );
    });

    // The ceiling. A stalled font or a slow image never holds the page.
    timers.push(setTimeout(beginExit, MAX_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [phase, reduced, beginExit]);

  /** Hard cuts, no cross-fade, and only once every frame is decoded. */
  React.useEffect(() => {
    if (phase !== "visible" || reduced || !ready || FRAMES.length < 2) return;
    const id = setInterval(
      () => setFrame((f) => (f + 1) % FRAMES.length),
      FRAME_MS,
    );
    return () => clearInterval(id);
  }, [phase, reduced, ready]);

  /** Leave the DOM once the slide has finished. */
  React.useEffect(() => {
    if (phase !== "exiting") return;
    const id = setTimeout(
      () => setPhase("gone"),
      reduced ? REDUCED_FADE_MS : EXIT_MS,
    );
    return () => clearTimeout(id);
  }, [phase, reduced]);

  const onFrameLoad = React.useCallback(() => {
    loadedRef.current += 1;
    if (loadedRef.current >= FRAMES.length) setReady(true);
  }, []);

  if (phase === "gone") return null;

  const frames = reduced ? FRAMES.slice(0, 1) : FRAMES;

  return (
    <div
      className="fillo-preloader fixed inset-0 flex flex-col items-center justify-center gap-6 bg-paper px-6"
      style={{ zIndex: 100 }}
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading Fillo Bakes"
      aria-hidden={phase === "exiting" ? true : undefined}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />

      <div className="fillo-preloader-well relative h-[120px] w-[120px] sm:h-[160px] sm:w-[160px]">
        {frames.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={320}
            height={320}
            loading="eager"
            onLoad={onFrameLoad}
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: i === frame ? 1 : 0,
              filter: "drop-shadow(0 16px 20px rgba(43, 27, 18, 0.18))",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-display text-[28px] leading-none lowercase text-ink">
          fillo bakes
        </p>
        <p className="font-script text-[18px] leading-none text-accent">
          warming the oven
        </p>
      </div>

      <div
        className="h-px w-[120px] overflow-hidden bg-line"
        aria-hidden="true"
      >
        <span className="fillo-hairline-fill block h-full w-full bg-accent" />
      </div>
    </div>
  );
}
