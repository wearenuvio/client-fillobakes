import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Badge / Tag — DESIGN.md §12.11.
 *
 * v2: a 24px pill in 11px Hanken caps. Never wraps to two lines, never
 * carries an icon larger than 12px, never fills with the accent except for the
 * one weekly chip.
 *
 *  - tint    — a `-tint` surface with its matching ink: SOLD OUT, LAST 3, NEW.
 *  - outline — a neutral fact: EGGLESS, 400G, VEG.
 *  - solid   — the cart count and the Fillo+ tier chip only.
 *
 * A sold-out badge inside a kiln-accented card must use `outline`, because the
 * system has one red family and danger and kiln are never adjacent (§2.6).
 */

export type BadgeVariant =
  | "tint"
  | "outline"
  | "solid"
  | "success"
  | "warning"
  | "danger"
  | "info"
  /** The Fillo+ tier chip: crumb fill with ink-900 text (5.15:1). */
  | "crumb"
  /** "THIS WEEK" — the weekly-specials category hint as a chip fill. */
  | "weekly"
  /** "GONE THIS WEEK" — running out is good news, not a fault (§12.5). */
  | "muted";

const VARIANTS: Record<BadgeVariant, string> = {
  tint: "bg-peach text-ink-2",
  outline: "border border-line text-ink-2 bg-card",
  solid: "bg-ink text-on-choc",
  success: "bg-success-tint text-success",
  warning: "bg-card border border-gold text-crumb-ink",
  danger: "bg-card border border-accent text-accent",
  info: "bg-paper-2 text-ink-2",
  crumb: "bg-gold text-ink",
  weekly: "bg-accent text-on-accent",
  muted: "bg-well text-muted",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  /** Set for counts and quantities so the digits do not jitter. */
  tabular?: boolean;
};

export function Badge({
  variant = "tint",
  tabular = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-pill px-2.5",
        "text-[11px] font-medium tracking-[0.08em] uppercase",
        tabular && "tabular",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
