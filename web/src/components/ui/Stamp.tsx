import { cn } from "@/lib/cn";

/**
 * Seal — DESIGN-v2 §2. The brand device, and the only circle in the system.
 *
 * 88px round, a 1.5px ink hairline, two lines of 10px caps inside, a wheat
 * line mark between them, tilted −8° so it reads as pressed on rather than
 * placed. Used once on the home hero and once on a product page. Never twice
 * in one viewport, never over the busy part of a photograph.
 *
 * `RingSeal` keeps its name and its API for the routes that still import it,
 * but it is now the same object drawn with its text on a circular path.
 */

export function Stamp({
  lines = ["100% eggless", "baked daily"],
  size = 88,
  tone = "ink",
  className,
}: {
  /** Two short lines. The seal is not a sentence. */
  lines?: [string, string] | string[];
  /** 88px on a hero, 64px inset into a product well. */
  size?: number;
  tone?: "ink" | "on-choc";
  className?: string;
}) {
  const small = size <= 68;
  const ink = tone === "on-choc" ? "text-on-choc" : "text-ink";
  const rule = tone === "on-choc" ? "bg-on-choc/40" : "bg-ink/25";

  return (
    <span
      role="img"
      aria-label={lines.join(", ")}
      style={{ width: size, height: size }}
      className={cn(
        "inline-grid shrink-0 -rotate-8 place-items-center rounded-pill",
        "border-[1.5px] border-current",
        ink,
        className,
      )}
    >
      <span className="flex flex-col items-center gap-1 px-2 text-center">
        <span
          className={cn(
            "uppercase",
            small
              ? "text-[8px] leading-[1.25] tracking-[0.1em]"
              : "text-[10px] leading-[1.25] tracking-[0.11em]",
          )}
        >
          {lines[0]}
        </span>
        <span aria-hidden="true" className="flex items-center gap-1">
          <span className={cn("h-px w-3", rule)} />
          <WheatMark size={small ? 9 : 11} />
          <span className={cn("h-px w-3", rule)} />
        </span>
        <span
          className={cn(
            "uppercase",
            small
              ? "text-[8px] leading-[1.25] tracking-[0.1em]"
              : "text-[10px] leading-[1.25] tracking-[0.11em]",
          )}
        >
          {lines[1]}
        </span>
      </span>
    </span>
  );
}

/** The one piece of line art the seal carries. Stroked in currentColor. */
function WheatMark({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 14.5V4" />
      <path d="M8 4.5c0-1.4.9-2.6 2-3 .3 1.5-.4 2.9-2 3.4" />
      <path d="M8 4.5c0-1.4-.9-2.6-2-3-.3 1.5.4 2.9 2 3.4" />
      <path d="M8 8.2c0-1.3.9-2.4 2-2.8.3 1.4-.4 2.7-2 3.2" />
      <path d="M8 8.2c0-1.3-.9-2.4-2-2.8-.3 1.4.4 2.7 2 3.2" />
      <path d="M8 11.8c0-1.3.9-2.4 2-2.8.3 1.4-.4 2.7-2 3.2" />
      <path d="M8 11.8c0-1.3-.9-2.4-2-2.8-.3 1.4.4 2.7 2 3.2" />
    </svg>
  );
}

/**
 * The circular-text variant. Same palette, same hairline, text set on a path
 * so a longer claim still fits. Static: v2 has no rotating chrome.
 */
export function RingSeal({
  text = "100% eggless · baked this morning · ",
  size = 112,
  tone = "paper",
  className,
}: {
  text?: string;
  size?: number;
  /** ink hairline on paper; on-choc hairline on the dark band. */
  tone?: "paper" | "dark";
  className?: string;
}) {
  const px = Math.max(88, size);
  const id = `seal-path-${px}-${tone}`;
  const ink = tone === "dark" ? "var(--color-on-choc)" : "var(--color-ink)";
  const ring =
    tone === "dark" ? "var(--hairline-dark-color)" : "var(--color-ink)";

  return (
    <span
      role="img"
      aria-label={text.replace(/·/g, ",").trim()}
      style={{ width: px, height: px }}
      className={cn("relative inline-block shrink-0 -rotate-8", className)}
    >
      <svg
        viewBox="0 0 132 132"
        width={px}
        height={px}
        aria-hidden="true"
        className="absolute inset-0"
      >
        <defs>
          <path
            id={id}
            d="M 66,66 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
            fill="none"
          />
        </defs>
        <circle
          cx="66"
          cy="66"
          r="64"
          fill="none"
          stroke={ring}
          strokeWidth="1.5"
          opacity={tone === "dark" ? 1 : 0.55}
        />
        <text
          fill={ink}
          fontFamily="var(--font-sans)"
          fontSize="9.5"
          fontWeight="500"
          letterSpacing="1.5"
        >
          <textPath href={`#${id}`}>
            {text.toUpperCase().repeat(3).slice(0, 74)}
          </textPath>
        </text>
      </svg>
      <span className={cn("absolute inset-0 grid place-items-center", tone === "dark" ? "text-on-choc" : "text-ink")}>
        <WheatMark size={26} />
      </span>
    </span>
  );
}
