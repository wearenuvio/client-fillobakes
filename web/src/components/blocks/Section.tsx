import * as React from "react";
import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Rule";

/**
 * Layout scaffolding — DESIGN.md §4 and §8.
 *
 *  - Section rhythm is `--section-y`; a dark band gets `--section-y-lg`
 *    because it has to feel like an event.
 *  - A section may step at most ONE paper level from its neighbour, and
 *    adjacent sections on the same paper level collapse to a single
 *    `--section-y`.
 *  - Full-bleed bands escape the container; their inner content re-enters
 *    `--max-content`.
 *  - Never centre a whole page (§13). `SectionHeader` is left-aligned by
 *    default and `centred` is the exception you have to ask for.
 */

export type Surface = "paper-50" | "paper-100" | "paper-0" | "dark";

const SURFACES: Record<Surface, string> = {
  "paper-0": "bg-paper-0",
  "paper-50": "bg-paper-50",
  "paper-100": "bg-paper-100",
  dark: "bg-ink-900",
};

export function Container({
  width = "content",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { width?: "content" | "narrow" }) {
  return (
    <div
      {...rest}
      className={cn(
        width === "narrow" ? "container-narrow" : "container-content",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  surface = "paper-50",
  width = "content",
  /** Dark bands and hero closes use the taller rhythm. */
  size = "default",
  bleed = false,
  className,
  innerClassName,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  surface?: Surface;
  width?: "content" | "narrow" | "full";
  size?: "default" | "lg" | "half" | "none";
  bleed?: boolean;
  innerClassName?: string;
}) {
  const pad =
    size === "lg"
      ? "py-[var(--section-y-lg)]"
      : size === "half"
        ? "py-[calc(var(--section-y)/2)]"
        : size === "none"
          ? ""
          : "py-[var(--section-y)]";

  const inner =
    width === "full" ? innerClassName : cn(
      width === "narrow" ? "container-narrow" : "container-content",
      innerClassName,
    );

  return (
    <section
      {...rest}
      data-surface={surface === "dark" ? "dark" : undefined}
      className={cn("relative", SURFACES[surface], pad, bleed && "w-full", className)}
    >
      <div className={inner}>{children}</div>
    </section>
  );
}

/**
 * The section header the whole system repeats: a micro-caps kicker in kiln, a
 * display heading, and an optional right-hand meta block on the same baseline
 * (§14.2's "serif/mono collision").
 */
export function SectionHeader({
  kicker,
  heading,
  /** e.g. "( 23 )" — mono, set immediately after the heading. */
  count,
  lead,
  meta,
  as: Heading = "h2",
  tone = "paper",
  centred = false,
  className,
}: {
  kicker?: React.ReactNode;
  heading: React.ReactNode;
  count?: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: "paper" | "dark";
  centred?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
        centred && "items-center text-center lg:flex-col lg:items-center",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker ? <Kicker tone={dark ? "crumb" : "kiln"}>{kicker}</Kicker> : null}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <Heading
            className={cn("text-display-lg", dark ? "text-paper-0" : "text-ink-800")}
          >
            {heading}
          </Heading>
          {count ? (
            <span className={cn("micro", dark ? "text-ink-400" : "text-ink-500")}>
              ( {count} )
            </span>
          ) : null}
        </div>
        {lead ? (
          <p
            className={cn(
              "mt-3 max-w-[46ch] text-body-lg",
              dark ? "text-ink-400" : "text-ink-600",
            )}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {meta ? (
        <div
          className={cn(
            "micro shrink-0 space-y-1 lg:text-right",
            dark ? "text-ink-400" : "text-ink-500",
          )}
        >
          {meta}
        </div>
      ) : null}
    </div>
  );
}
