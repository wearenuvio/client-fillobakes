import { cn } from "@/lib/cn";

/**
 * Ghosted line art — DESIGN.md §10.3.
 *
 * 1px `--color-paper-400` illustrations, placed at 4–6% opacity, oversized,
 * bleeding off a section edge, behind text. One per section, maximum, and
 * never behind a product grid. Also the 96px glyph inside an empty state and
 * the placeholder in a product well with no photograph yet.
 *
 * These are deliberately schematic rather than decorative: at 5% opacity the
 * silhouette is all that survives, so detail would be wasted bytes.
 */

type GlyphProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function svgProps(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 96 96",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: cn("text-paper-400", className),
  };
}

/** A square-cut shokupan loaf, three-quarter view. */
export function LoafGlyph({ size = 96, className, strokeWidth = 1 }: GlyphProps) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={strokeWidth}>
      <path d="M14 40c0-9 7-16 16-16h30c11 0 20 8 20 18v26a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4Z" />
      <path d="M14 44h66" />
      <path d="M32 24v48M50 26v46M66 30v42" />
    </svg>
  );
}

/** An an pan: a round bun with the sesame dimple. */
export function AnPanGlyph({ size = 96, className, strokeWidth = 1 }: GlyphProps) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="48" cy="54" rx="34" ry="24" />
      <path d="M14 54c0-14 15-24 34-24s34 10 34 24" />
      <circle cx="48" cy="44" r="3" />
    </svg>
  );
}

/** A kare pan: the oval, scored savoury bun. */
export function KarePanGlyph({ size = 96, className, strokeWidth = 1 }: GlyphProps) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="48" cy="50" rx="36" ry="22" />
      <path d="M30 42c6 4 12 6 18 6s12-2 18-6" />
      <path d="M28 58h40" />
    </svg>
  );
}

/** A wheat ear — the section-edge texture device. */
export function WheatGlyph({ size = 96, className, strokeWidth = 1 }: GlyphProps) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={strokeWidth}>
      <path d="M48 88V30" />
      <path d="M48 30c0-8 5-14 12-16-1 9-5 15-12 16Z" />
      <path d="M48 30c0-8-5-14-12-16 1 9 5 15 12 16Z" />
      <path d="M48 46c0-8 5-14 12-16-1 9-5 15-12 16Z" />
      <path d="M48 46c0-8-5-14-12-16 1 9 5 15 12 16Z" />
      <path d="M48 62c0-8 5-14 12-16-1 9-5 15-12 16Z" />
      <path d="M48 62c0-8-5-14-12-16 1 9 5 15 12 16Z" />
    </svg>
  );
}

/** The van, side elevation. Used behind the tracker and in the footer. */
export function VanGlyph({ size = 96, className, strokeWidth = 1 }: GlyphProps) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={strokeWidth}>
      <path d="M8 62V34a4 4 0 0 1 4-4h38v32Z" />
      <path d="M50 38h16l14 14v10H50Z" />
      <path d="M8 62h80" />
      <circle cx="28" cy="66" r="7" />
      <circle cx="68" cy="66" r="7" />
    </svg>
  );
}

/**
 * A large decorative glyph bleeding off a section edge.
 * One per section, at 4–6% opacity, never behind a product grid.
 */
export function LineArtBleed({
  glyph = "wheat",
  side = "right",
  size = 640,
  className,
}: {
  glyph?: "loaf" | "anpan" | "karepan" | "wheat" | "van";
  side?: "left" | "right";
  size?: number;
  className?: string;
}) {
  const Glyph = {
    loaf: LoafGlyph,
    anpan: AnPanGlyph,
    karepan: KarePanGlyph,
    wheat: WheatGlyph,
    van: VanGlyph,
  }[glyph];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-5",
        side === "right" ? "-right-24" : "-left-24",
        className,
      )}
    >
      <Glyph size={size} strokeWidth={0.4} />
    </span>
  );
}
