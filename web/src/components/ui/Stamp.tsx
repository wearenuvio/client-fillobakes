import { cn } from "@/lib/cn";

/**
 * Hanko — the brand seal. DESIGN-v2 §2, in its woodblock revision.
 *
 * The seal used to be a drawn ring with two lines of caps set inside it. It is
 * now a *hanko*: the square red stamp a Japanese maker presses onto their own
 * work. Square, 8px corners, terracotta, the name in the display serif with a
 * wheat mark beneath it, tilted −6° so it reads as pressed rather than placed.
 *
 * The edge is deliberately imperfect. A `feTurbulence` displacement at a very
 * low scale roughens the outline by a pixel or so, which is the difference
 * between a shape and a stamp: real ink does not meet the paper evenly. The
 * inner hairline is the carved border every hanko has.
 *
 * The API is unchanged, so every existing call site still works. `lines` no
 * longer prints — a 72px square cannot hold "100% eggless / baked daily" and
 * stay a seal — but it is still the accessible name, so what a screen reader
 * hears is exactly what it heard before.
 *
 * Sizing: 72px is the intended size and 56px is the phone size, applied in
 * `globals.css` below 480 so a caller never has to think about it. `size` is
 * honoured above that as a maximum.
 */

export function Stamp({
  lines = ["100% eggless", "baked daily"],
  size = 72,
  tone = "ink",
  className,
}: {
  /** Two short lines. Not printed on the seal; this is its accessible name. */
  lines?: [string, string] | string[];
  /** 72px is the design size; the phone step down to 56 is automatic. */
  size?: number;
  /** `on-choc` swaps the terracotta for cream, for the dark band. */
  tone?: "ink" | "on-choc";
  className?: string;
}) {
  const onChoc = tone === "on-choc";
  const ink = onChoc ? "var(--color-on-choc)" : "var(--color-accent)";
  const paper = onChoc ? "var(--color-choc)" : "var(--color-on-accent)";
  // One filter id per tone is enough: two seals of the same tone can share a
  // filter, and the seal is never on screen twice in the same tone anyway.
  const id = `hanko-${tone}`;

  return (
    <span
      role="img"
      aria-label={lines.join(", ")}
      className={cn("hanko block shrink-0 -rotate-6", className)}
      style={{ ["--hanko-size" as string]: `${size}px` }}
    >
      <svg
        viewBox="0 0 72 72"
        width="100%"
        height="100%"
        aria-hidden="true"
        className="block"
      >
        <defs>
          <filter id={id} x="-8%" y="-8%" width="116%" height="116%">
            {/* A pixel of wobble on the outline. Any more and it stops
                reading as ink and starts reading as a rendering bug. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter={`url(#${id})`}>
          <rect x="1" y="1" width="70" height="70" rx="8" fill={ink} />
          {/* The carved inner border. */}
          <rect
            x="6.5"
            y="6.5"
            width="59"
            height="59"
            rx="4.5"
            fill="none"
            stroke={paper}
            strokeWidth="2"
          />
        </g>

        {/* The type sits outside the displacement filter: a wobbling outline
            is a stamp, wobbling letterforms are a mistake. */}
        <text
          x="36"
          y="35"
          textAnchor="middle"
          fill={paper}
          fontFamily="var(--font-display)"
          fontSize="20"
          letterSpacing="0.5"
        >
          fillo
        </text>

        {/* The wheat mark, the one piece of line art the seal carries. */}
        <g
          transform="translate(36 46)"
          fill="none"
          stroke={paper}
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M0 13V2" />
          <path d="M0 2.6c0-1.5.9-2.8 2.1-3.2.3 1.6-.4 3.1-2.1 3.6" />
          <path d="M0 2.6c0-1.5-.9-2.8-2.1-3.2-.3 1.6.4 3.1 2.1 3.6" />
          <path d="M0 7.4c0-1.5.9-2.8 2.1-3.2.3 1.6-.4 3.1-2.1 3.6" />
          <path d="M0 7.4c0-1.5-.9-2.8-2.1-3.2-.3 1.6.4 3.1 2.1 3.6" />
        </g>
      </svg>
    </span>
  );
}

/**
 * The postage-stamp badge — "Few left", "Sold out today", "This week".
 *
 * Paper fill, a hairline carried inside the edge, and the edge itself
 * perforated: four repeating radial-gradient masks, one per side, composited
 * with `intersect` so the holes bite through the border as well as the fill.
 * Tilted −3°, which is less than the seal because a badge sits inside a
 * photograph's corner and a bigger angle starts to look like a mistake.
 *
 * Buttons never take this shape. A perforated edge says "this is a label
 * stuck on"; a control has to look pressable, which is the opposite job.
 */
export function StampBadge({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  /** `gold` for "Few left"; `accent` for a weekly special. */
  tone?: "ink" | "gold" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "stamp-badge pointer-events-none inline-flex h-[26px] min-w-[72px] items-center justify-center",
        "px-2.5 text-[11px] font-medium tracking-[0.08em] uppercase",
        "-rotate-3 select-none",
        tone === "gold"
          ? "text-gold"
          : tone === "accent"
            ? "text-accent"
            : "text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * `RingSeal` is the old drawn-ring seal's name. Three routes outside this
 * pass still import it (gift cards, the v1 hero block, the styleguide), so it
 * stays exported and now renders the hanko — one seal in the system, and those
 * pages pick up the new one without being touched.
 */
export function RingSeal({
  text = "100% eggless · baked daily",
  size = 72,
  tone = "paper",
  className,
}: {
  text?: string;
  size?: number;
  /** The old names: `paper` is the light ground, `dark` the choc band. */
  tone?: "paper" | "dark";
  className?: string;
}) {
  return (
    <Stamp
      lines={text.split("·").map((part) => part.trim())}
      size={size}
      tone={tone === "dark" ? "on-choc" : "ink"}
      className={className}
    />
  );
}
