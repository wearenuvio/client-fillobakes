import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The shell every content page is built from — DESIGN-v2 §1, §6.
 *
 * One head, one section rhythm, one heading pair. The home page's sections
 * are made of exactly these parts, so a story page, a policy and an article
 * sit on the same grid and read as one hand.
 */

export type ContentSurface = "paper" | "paper-2" | "peach" | "card";

const SURFACES: Record<ContentSurface, string> = {
  paper: "bg-paper",
  "paper-2": "bg-paper-2",
  peach: "bg-peach",
  card: "bg-card",
};

export function ContentSection({
  surface = "paper",
  width = "content",
  size = "default",
  className,
  innerClassName,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  surface?: ContentSurface;
  width?: "content" | "narrow";
  size?: "default" | "half" | "none";
  innerClassName?: string;
}) {
  return (
    <section
      {...rest}
      className={cn(
        "relative",
        SURFACES[surface],
        size === "default" && "py-[var(--section-y)]",
        size === "half" && "py-[calc(var(--section-y)/2)]",
        className,
      )}
    >
      <div
        className={cn(
          width === "narrow" ? "container-narrow" : "container-content",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * The page head: an optional script line in terracotta, the title in the
 * display serif, one or two sentences under it. The script appears at most
 * once per page and always directly above the display line.
 */
export function PageHead({
  script,
  eyebrow,
  title,
  lead,
  meta,
  italic = false,
  size = "lg",
  className,
  children,
}: {
  script?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** A small line under the lead: a date, a reading time, a licence number. */
  meta?: React.ReactNode;
  italic?: boolean;
  size?: "lg" | "md";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-[var(--max-narrow)]", className)}>
      {script ? <p className="script">{script}</p> : null}
      {eyebrow ? (
        <p
          className={cn(
            "text-[12px] font-medium tracking-[0.12em] text-muted uppercase",
            script && "mt-4",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-ink",
          size === "lg" ? "text-display-2" : "text-h2",
          italic && "font-display italic",
          (script || eyebrow) && "mt-3",
        )}
      >
        {title}
      </h1>
      {lead ? (
        <p className="mt-5 max-w-[52ch] text-body-lg text-ink-2">{lead}</p>
      ) : null}
      {meta ? <div className="mt-6">{meta}</div> : null}
      {children}
    </div>
  );
}

/** The section heading pair, with an optional link on the same baseline. */
export function SectionHead({
  eyebrow,
  heading,
  lead,
  link,
  className,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  lead?: React.ReactNode;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("max-w-[20ch] text-h2 text-ink", eyebrow && "mt-3")}>
          {heading}
        </h2>
        {lead ? (
          <p className="mt-4 max-w-[52ch] text-body-lg text-ink-2">{lead}</p>
        ) : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="link-underline inline-flex shrink-0 items-center gap-2 text-body-sm font-semibold text-accent"
        >
          {link.label}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

/** The one label the site uses above anything: 12px Hanken caps at .12em. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-[12px] font-medium tracking-[0.12em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
