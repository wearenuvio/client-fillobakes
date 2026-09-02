import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The account area's one surface: paper-0 at --radius-lg with a hairline and
 * --space-6 padding (--space-4 at mobile, DESIGN.md §4). No shadow, no tint —
 * a component gets a border OR a background, never both (§6).
 */
export function Panel({
  as: Tag = "section",
  tone = "default",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "li" | "form";
  /** `muted` is the paused / closed surface — never an error colour. */
  tone?: "default" | "muted";
}) {
  return (
    <Tag
      {...rest}
      className={cn(
        "rounded-lg border border-paper-300 p-4 sm:p-6",
        tone === "muted" ? "bg-paper-100" : "bg-paper-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The panel's own heading row: a micro-caps label and an optional right slot. */
export function PanelHead({
  label,
  trailing,
  className,
}: {
  label: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="micro text-ink-500">{label}</p>
      {trailing ? <div className="flex items-center gap-3">{trailing}</div> : null}
    </div>
  );
}

/**
 * A label/value row with the dot-leader rule between them (§12.7, §12.33).
 * A null value omits the row entirely rather than shipping a blank.
 */
export function MetaRow({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={cn("flex items-baseline gap-3 py-2", className)}>
      <span className="micro shrink-0 text-ink-500">{label}</span>
      <span className="dot-leader" aria-hidden="true" />
      <span className="shrink-0 text-body-sm text-ink-800 tabular">{value}</span>
    </div>
  );
}

/** A hairline-separated stack — the system's list, not a card per row. */
export function HairlineList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul className={cn("divide-y divide-paper-300 border-y border-paper-300", className)}>
      {children}
    </ul>
  );
}
