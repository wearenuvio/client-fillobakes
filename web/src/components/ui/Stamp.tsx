import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Seal — DESIGN-v2 §2. The brand device, and the only circle in the system.
 *
 * The ring is now the drawn one: `stamp-ring.png`, a double hairline with four
 * wheat ears at the quarters, from the hand-drawn set. The two lines of caps
 * are set in HTML inside its empty centre — real text, so it is selectable,
 * translatable and crisp at any pixel ratio — and the whole thing is tilted −8°
 * so it reads as pressed on rather than placed.
 *
 * Sizing: the drawn ring eats roughly a quarter of the diameter, so the usable
 * chord across the middle is about 62% of the width. The type is therefore
 * scaled off `size` rather than fixed, which keeps a longer claim inside the
 * ring instead of spilling over it. That also means the seal wants a little
 * more room than the 88px the spec assumed for a plain CSS circle — 112px on
 * the hero, 96px inset into a product well.
 *
 * Used once on the home hero and once on a product page. Never twice in one
 * viewport, never over the busy part of a photograph.
 *
 * `RingSeal` keeps its name and its API for the routes that still import it,
 * but it is now the same object drawn with its text on a circular path.
 */

export function Stamp({
  lines = ["100% eggless", "baked daily"],
  size = 112,
  tone = "ink",
  className,
}: {
  /** Two short lines. The seal is not a sentence. */
  lines?: [string, string] | string[];
  /** 112px on a hero, 96px inset into a product well. */
  size?: number;
  tone?: "ink" | "on-choc";
  className?: string;
}) {
  const ink = tone === "on-choc" ? "text-on-choc" : "text-ink";
  const rule = tone === "on-choc" ? "bg-on-choc/45" : "bg-ink/30";
  const src =
    tone === "on-choc"
      ? "/images/lineart/stamp-ring-light.png"
      : "/images/lineart/stamp-ring.png";

  return (
    <span
      role="img"
      aria-label={lines.join(", ")}
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 -rotate-8 place-items-center",
        ink,
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={1187}
        height={1189}
        sizes={`${size}px`}
        draggable={false}
        className="pointer-events-none absolute inset-0 size-full select-none"
      />

      <span
        className="relative flex flex-col items-center gap-[0.35em] text-center uppercase"
        style={{
          width: size * 0.62,
          fontSize: size * 0.078,
          lineHeight: 1.15,
          letterSpacing: "0.05em",
        }}
      >
        <span>{lines[0]}</span>
        <span
          aria-hidden="true"
          className={cn("h-px w-[1.6em]", rule)}
          style={{ opacity: 0.9 }}
        />
        <span>{lines[1]}</span>
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
