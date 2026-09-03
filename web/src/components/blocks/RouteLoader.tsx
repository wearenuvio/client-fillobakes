"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cutoutVariants } from "@/lib/images";

/**
 * Route loading — the small sibling of the Preloader.
 *
 * Two pieces, deliberately separate:
 *
 * `RouteFlipbook` is what `app/loading.tsx` renders while a route segment is
 * still streaming. Same flipbook, 72px, four frames instead of eight, and the
 * cycle is a CSS animation rather than a React interval so it starts painting
 * the moment the fallback lands and costs no JS to run. Four images, no
 * preloading: a route change is not a first impression and it is not worth a
 * megabyte to decorate.
 *
 * `RouteLoader` is the 2px terracotta hairline across the top of the viewport.
 * It is mounted once in the root layout and keyed off `usePathname`, so every
 * client navigation draws one 400ms ease-out fill and then gets out of the
 * way. It is the acknowledgement, not the progress — no fake trickle that
 * hangs at 80%.
 *
 * Both sit under `--z-toast` behaviourally but above the sticky header, and
 * neither takes part in flow.
 */

/** Four bakes is enough to read as motion; more is just more bytes. */
const FLIP_SLUGS = [
  "milk-shokupan",
  "custard-anpan",
  "kyoto-curry",
  "fruit-sando",
] as const;

const FLIP_FRAMES: string[] = FLIP_SLUGS.map(
  (slug) => cutoutVariants(slug).v1,
).filter((src): src is string => src !== null);

/** One full turn of the flipbook. Four frames at 110ms. */
const FLIP_CYCLE_MS = FLIP_FRAMES.length * 110;

/** Fill, then a short fade. Kept in step with the keyframes in globals.css. */
const BAR_FILL_MS = 400;
const BAR_HIDE_MS = 140;

export function RouteFlipbook() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-paper px-6 py-24"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative h-[72px] w-[72px]">
        {FLIP_FRAMES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={160}
            height={160}
            loading="eager"
            data-first={i === 0 ? "true" : undefined}
            className="fillo-flip-frame absolute inset-0 h-full w-full object-contain"
            style={{
              animationDuration: `${FLIP_CYCLE_MS}ms`,
              animationDelay: `${i * 110}ms`,
              filter: "drop-shadow(0 10px 14px rgba(43, 27, 18, 0.16))",
            }}
          />
        ))}
      </div>
      <p className="font-display text-[18px] leading-none lowercase text-ink">
        fillo bakes
      </p>
    </div>
  );
}

export function RouteLoader() {
  const pathname = usePathname();
  const [run, setRun] = React.useState(0);
  const firstRef = React.useRef(true);

  React.useEffect(() => {
    // The first render is the page arriving, not a navigation.
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    setRun((n) => n + 1);
  }, [pathname]);

  React.useEffect(() => {
    if (run === 0) return;
    const id = setTimeout(() => setRun(0), BAR_FILL_MS + BAR_HIDE_MS);
    return () => clearTimeout(id);
  }, [run]);

  if (run === 0) return null;

  return (
    <div
      key={run}
      className="fillo-topbar pointer-events-none fixed inset-x-0 top-0 h-[2px]"
      style={{ zIndex: 95 }}
      aria-hidden="true"
    >
      <span className="fillo-topbar-fill block h-full w-full bg-accent" />
    </div>
  );
}
