import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { InkArt, type InkArtName } from "@/components/ui/InkArt";

/**
 * PageHeader — the top block every page shares (DESIGN-v2 §1, §6).
 *
 * The shape is the journal's header, which the client signed off: an optional
 * script line in terracotta, the title in the display serif, one or two
 * sentences under it, and one faint hand-drawn line drawing in the clear
 * right-hand third. Every page gets a different drawing, so the headers rhyme
 * without repeating.
 *
 * The drawing sits INSIDE the container rather than bleeding off the section
 * edge, and the section is not clipped, so nothing is ever cut in half. It is
 * hidden below the breakpoint where the header copy takes the full column,
 * because at that width a drawing beside the words only crowds them.
 *
 * `variant="compact"` is the transactional register — account, cart, checkout,
 * order, login. Same parts, less air, and the title steps down one size.
 */

export type PageHeaderSurface = "paper" | "paper-2" | "peach";

const SURFACES: Record<PageHeaderSurface, string> = {
  paper: "bg-paper",
  "paper-2": "bg-paper-2",
  peach: "bg-peach",
};

/**
 * The box the drawing is fitted into, not its width.
 *
 * Every size shares one height, so whichever drawing a page carries it
 * occupies the same band beside the title. Only the width allowance changes,
 * because a van needs more of it than a wheat stalk does.
 *
 * Sizing by width alone makes a portrait drawing enormous and a landscape one
 * small — a wheat stalk is 276×1200 and a croissant 1200×757, so the same
 * `width` gives wildly different heights. Every header drawing is fitted into
 * a box of the same height instead, so the headers read as one object however
 * different the drawings are.
 */
const ART_SIZE = {
  sm: { box: "h-[132px] w-[150px]", px: 150, from: "hidden sm:block" },
  md: { box: "h-[132px] w-[230px]", px: 230, from: "hidden md:block" },
  lg: { box: "h-[132px] w-[300px]", px: 300, from: "hidden lg:block" },
} as const;

export type PageHeaderProps = {
  /** The Caveat line, terracotta, directly above the title. At most one. */
  script?: React.ReactNode;
  /** The label layer, when a page wants a category rather than a script. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** A small line under the lede: a date, a reading time, a licence line. */
  meta?: React.ReactNode;
  /** One drawing from /images/lineart. One per header, never two. */
  art?: InkArtName;
  artSize?: keyof typeof ART_SIZE;
  artAlign?: "right" | "corner";
  variant?: "default" | "compact";
  surface?: PageHeaderSurface;
  /** The title in the display italic — the story and the standing order. */
  italic?: boolean;
  /** Actions on the right of the title row: a chip, a button. */
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  /**
   * Drops the section and the container, leaving just the header block, so
   * the same object can sit inside a column that already has its own gutters
   * — which is what the account screens need.
   */
  bare?: boolean;
  /** Anything that belongs under the lede: a tab rail, a join form. */
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  script,
  eyebrow,
  title,
  lede,
  meta,
  art,
  artSize = "md",
  artAlign = "right",
  variant = "default",
  surface = "paper",
  italic = false,
  actions,
  back,
  bare = false,
  children,
  className,
}: PageHeaderProps) {
  const compact = variant === "compact";
  const size = ART_SIZE[artSize];

  const Wrapper = bare ? "div" : "section";

  return (
    <Wrapper
      className={cn(
        "relative",
        bare ? "min-w-0" : SURFACES[surface],
        bare
          ? null
          : compact
            ? "pt-8 pb-6 lg:pt-10 lg:pb-8"
            : "pt-10 pb-8 lg:pt-14 lg:pb-10",
        className,
      )}
    >
      <div className={cn("relative", bare ? "min-w-0" : "container-content")}>
        {/* The drawing lives on the title row rather than on the whole block,
            so anything the page hangs underneath — a tab rail, a form, a
            button — is never underneath a drawing. */}
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          {art ? (
            <InkArt
              name={art}
              // `contain` ignores width for layout; it is here so next/image
              // still asks for a sensibly sized file.
              width={size.px}
              fit="contain"
              opacity={0.14}
              parallax
              className={cn(
                size.box,
                size.from,
                artAlign === "corner"
                  ? "-top-4 right-0"
                  : "top-1/2 right-0 -translate-y-1/2",
              )}
            />
          ) : null}

          <div className="min-w-0 max-w-[var(--max-narrow)]">
            {back ? (
              <Link
                href={back.href}
                className="link-underline mb-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent"
              >
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                {back.label}
              </Link>
            ) : null}

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
                compact ? "text-h2" : "text-display-2",
                italic && "font-display italic",
                (script || eyebrow) && "mt-3",
              )}
            >
              {title}
            </h1>

            {lede ? (
              <p
                className={cn(
                  "max-w-[52ch] text-body-lg text-ink-2",
                  compact ? "mt-3" : "mt-5",
                )}
              >
                {lede}
              </p>
            ) : null}

            {meta ? <div className="mt-5">{meta}</div> : null}
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>

        {children ? <div className="relative mt-8">{children}</div> : null}
      </div>
    </Wrapper>
  );
}
