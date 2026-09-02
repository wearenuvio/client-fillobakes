import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Styleguide scaffolding only. Nothing here ships on a customer-facing page.
 */

export function SpecSection({
  id,
  title,
  section,
  note,
  children,
}: {
  id: string;
  title: string;
  /** The DESIGN.md clause this implements, e.g. "§12.5". */
  section?: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="text-display-sm text-ink-800">{title}</h2>
        {section ? <span className="micro text-ink-500">{section}</span> : null}
      </div>
      {note ? (
        <p className="mt-2 max-w-[62ch] text-body-sm text-ink-600">{note}</p>
      ) : null}
      <hr className="mt-4 h-px border-0 bg-paper-400" />
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function SpecRow({
  label,
  /** Dark specimens need an ink-900 stage to be legible. */
  surface = "paper",
  full = false,
  children,
}: {
  label: string;
  surface?: "paper" | "dark" | "well";
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <p className="micro mb-3 text-ink-500">{label}</p>
      <div
        data-surface={surface === "dark" ? "dark" : undefined}
        className={cn(
          "rounded-md p-6",
          surface === "dark" && "bg-ink-900",
          surface === "well" && "bg-paper-200",
          surface === "paper" && "bg-paper-0 outline outline-paper-300",
          full ? "" : "flex flex-wrap items-center gap-4",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SpecGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}

export function Swatch({
  token,
  value,
  contrast,
  onDark = false,
}: {
  token: string;
  value: string;
  contrast?: string;
  onDark?: boolean;
}) {
  return (
    <div>
      <span
        className="block h-16 w-full rounded-sm outline outline-paper-300"
        style={{ backgroundColor: `var(${value})` }}
      />
      <p className={cn("micro mt-2", onDark ? "text-ink-400" : "text-ink-600")}>
        {token}
      </p>
      {contrast ? (
        <p className="micro text-ink-500 tabular">{contrast}</p>
      ) : null}
    </div>
  );
}
