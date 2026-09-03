/**
 * The one pointer listener behind every piece of line art on the site.
 *
 * Twenty drawings must not mean twenty `pointermove` handlers and twenty
 * animation frames. This module owns exactly one of each, ref-counted by the
 * `InkArt` components that mount, and publishes the smoothed pointer position
 * as two custom properties on `<html>`:
 *
 *   --ink-px   -1 (left edge) … 1 (right edge)
 *   --ink-py   -1 (top edge)  … 1 (bottom edge)
 *
 * Each drawing then reads those in a CSS `transform`, so the per-element cost
 * of following the mouse is zero JavaScript — the style engine does it. That
 * is also why the smoothing lives here: one lerp, one write, one frame.
 *
 * The loop parks itself. Once the smoothed value has caught up with the
 * target to within a pixel's worth of travel it stops requesting frames, and
 * the next `pointermove` starts it again, so a still mouse costs nothing.
 *
 * Nothing here runs on a touch device (`pointer: fine` only) or under
 * `prefers-reduced-motion: reduce`. In both cases the properties stay unset,
 * the CSS falls back to 0, and the art simply does not move.
 */

/** How far behind the pointer the art lags. Lower is slower and softer. */
const LERP = 0.08;

/** Below this the smoothed value is close enough to stop animating. */
const EPSILON = 0.0005;

let listeners = 0;
let frame = 0;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function write() {
  const root = document.documentElement;
  root.style.setProperty("--ink-px", currentX.toFixed(4));
  root.style.setProperty("--ink-py", currentY.toFixed(4));
}

function tick() {
  currentX += (targetX - currentX) * LERP;
  currentY += (targetY - currentY) * LERP;
  write();

  if (
    Math.abs(targetX - currentX) < EPSILON &&
    Math.abs(targetY - currentY) < EPSILON
  ) {
    // Settle exactly, then stop asking for frames until the pointer moves.
    currentX = targetX;
    currentY = targetY;
    write();
    frame = 0;
    return;
  }
  frame = requestAnimationFrame(tick);
}

function onPointerMove(event: PointerEvent) {
  targetX = (event.clientX / window.innerWidth) * 2 - 1;
  targetY = (event.clientY / window.innerHeight) * 2 - 1;
  if (!frame) frame = requestAnimationFrame(tick);
}

/**
 * Register one more drawing. Returns the matching release function; the first
 * registration attaches the listener and the last one removes it.
 */
export function retainInkPointer(): () => void {
  if (typeof window === "undefined") return () => {};

  const fine = window.matchMedia("(pointer: fine)").matches;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return () => {};

  listeners += 1;
  if (listeners === 1) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  return () => {
    listeners -= 1;
    if (listeners > 0) return;
    window.removeEventListener("pointermove", onPointerMove);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    targetX = targetY = currentX = currentY = 0;
    document.documentElement.style.removeProperty("--ink-px");
    document.documentElement.style.removeProperty("--ink-py");
  };
}
