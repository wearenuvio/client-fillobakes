import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The account area's one surface — DESIGN-v2 §1 and §2.
 *
 * A card ground with a hairline and a 10px radius: the same object the
 * bestsellers grid and the journal row are built from, so an account screen
 * reads as the same site rather than as an admin panel bolted on. Flat at
 * rest; the lift is reserved for things you can click.
 *
 * `tone="muted"` is the paused / closed surface. It is a step down the paper
 * ramp, never an error colour — a paused standing order is a choice someone
 * made, not a fault.
 */
export function Panel({
  as: Tag = "section",
  tone = "default",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "li" | "form";
  tone?: "default" | "muted" | "peach";
}) {
  return (
    <Tag
      {...rest}
      className={cn(
        "rounded-lg border border-line p-5 sm:p-6 lg:p-7",
        tone === "muted"
          ? "bg-paper-2"
          : tone === "peach"
            ? "border-transparent bg-peach"
            : "bg-card",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The panel's heading row: the label layer the whole site uses for an eyebrow
 * — 12px Hanken caps at .12em, muted — and an optional right slot for a
 * status chip.
 */
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
      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      {trailing ? <div className="flex items-center gap-3">{trailing}</div> : null}
    </div>
  );
}

/**
 * A label/value row with a dot leader between them. A null value omits the
 * row entirely rather than shipping a blank — a spec list with a gap in it is
 * worse than a shorter one.
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
      <span className="shrink-0 text-body-sm text-muted">{label}</span>
      <span className="dot-leader" aria-hidden="true" />
      <span className="shrink-0 text-body-sm text-ink tabular">{value}</span>
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
    <ul className={cn("divide-y divide-line border-y border-line", className)}>
      {children}
    </ul>
  );
}

/**
 * A notice above a screen: paused, payment failed, route changed. Peach for
 * something to know, a gold hairline for something to act on. Never a red box
 * — errors here are a sentence and an icon (DESIGN-v2 §1).
 */
export function Notice({
  tone = "info",
  icon,
  children,
  actions,
  className,
}: {
  tone?: "info" | "attention";
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-5 sm:p-6",
        tone === "attention"
          ? "border border-gold bg-card"
          : "bg-peach",
        className,
      )}
    >
      <p className="flex items-start gap-3 text-body text-ink">
        {icon ? (
          <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
      </p>
      {actions ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
