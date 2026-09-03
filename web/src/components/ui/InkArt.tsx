"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { retainInkPointer } from "@/components/ui/ink-pointer";

/**
 * InkArt — the hand-drawn line drawings in `/images/lineart`, placed behind a
 * section (DESIGN-v2 §6 "Line art"; placements in `public/images/lineart/INDEX.md`).
 *
 * Every drawing is decoration and nothing else: `alt=""` and `aria-hidden`, so
 * a screen reader never meets it, `pointer-events: none` so it never eats a
 * click, and a z-index of 0 so it sits under the section's own content rather
 * than over the words.
 *
 * The intrinsic size of each PNG is baked into the table below, so next/image
 * reserves the right box before the file arrives and the section never shifts.
 * Everything is lazy — the drawings are atmosphere, and none of them is ever
 * the LCP element.
 *
 * The `-light` colourway is drawn in `--color-on-choc` and belongs on the dark
 * band and nowhere else; `tone="light"` selects it.
 */

/** Intrinsic pixel dimensions, straight off the files. */
const ART = {
  "wheat-stalk": [276, 1200],
  "wheat-stalk-v2": [301, 1200],
  "wheat-pair": [587, 1200],
  "wheat-pair-v2": [1200, 813],
  "shokupan-loaf": [1200, 813],
  "shokupan-loaf-v2": [1065, 824],
  "anpan-bun": [1041, 905],
  karepan: [700, 466],
  "fruit-sando": [852, 1200],
  croissant: [1200, 757],
  "rolling-pin-and-flour-bag": [1200, 958],
  "bakery-van": [1200, 872],
  "oven-with-loaves": [1200, 942],
  "steam-swirls": [612, 1200],
  "crumbs-scatter": [1146, 778],
  "stamp-ring": [1187, 1189],
  // Added 3 Sep with the second delivery of drawings.
  "sakura-sprig": [951, 1122],
  "sparrow-branch": [1068, 940],
  "seigaiha-tile": [644, 426],
} as const satisfies Record<string, readonly [number, number]>;

export type InkArtName = keyof typeof ART;

export function InkArt({
  name,
  tone = "ink",
  width,
  opacity = 0.12,
  sizes,
  className,
  style,
  /** Hide below 480px, where a drawing beside a phone column only crowds it. */
  hideOnPhone = true,
  /**
   * `width` sizes the drawing off its own aspect ratio, which is what a
   * section background wants. `contain` instead fits the whole drawing inside
   * whatever box the className gives it — the right mode inside a fixed tile,
   * where a portrait drawing sized by width gets cropped top and bottom and
   * comes out as a set of vertical strokes.
   */
  fit = "width",
  parallax = true,
}: {
  name: InkArtName;
  tone?: "ink" | "light";
  /** Rendered width. The height follows from the file's own aspect ratio. */
  width: number;
  opacity?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  hideOnPhone?: boolean;
  fit?: "width" | "contain";
  /**
   * Drift with the pointer and with the scroll. On for background atmosphere,
   * which is what most of these are; off for a drawing that has to stay put
   * inside a box it would otherwise wander out of — a category tile's mark or
   * a Standing Order step, both of which are contained illustration rather
   * than ground.
   */
  parallax?: boolean;
}) {
  const [w, h] = ART[name];
  const src = `/images/lineart/${name}${tone === "light" ? "-light" : ""}.png`;
  const contain = fit === "contain";

  useInkPointer(parallax);

  const art = (
    <Image
      src={src}
      alt=""
      width={w}
      height={h}
      loading="lazy"
      sizes={sizes ?? `${width}px`}
      draggable={false}
    />
  );

  return (
    <span
      aria-hidden="true"
      className={cn(
        "ink-art",
        contain && "ink-art-contain",
        hideOnPhone && "ink-art-phone-hide",
        className,
      )}
      style={{ opacity, ...(contain ? null : { width }), ...style }}
    >
      {/* Two layers, because one element cannot carry two transforms. The
          outer one drifts on the scroll timeline, the inner one follows the
          pointer; putting both on a single element would have the scroll
          animation overwrite the pointer transform outright. Neither touches
          the wrapper, which is where the caller's own rotations live. */}
      {parallax ? (
        <span className="ink-art-scroll">
          <span className="ink-art-pointer">{art}</span>
        </span>
      ) : (
        art
      )}
    </span>
  );
}

/** Joins the shared pointer loop for as long as this drawing is mounted. */
function useInkPointer(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    return retainInkPointer();
  }, [enabled]);
}
