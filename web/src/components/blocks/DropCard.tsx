import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * DropCard — DESIGN.md §12.27. The single most important commercial object on
 * the site.
 *
 * **Say how many you baked. Never how long is left.** Supply-based scarcity,
 * never a countdown. There is no clock, no ticking digit, no red and no
 * "hurry" anywhere in this component: the cut-off carries all the time
 * pressure and it is stated once, in body colour, as a fact.
 *
 * The count is wired to real data or the component does not ship — a
 * manufactured number triggers reactance strong enough to outweigh any lift.
 * `baked` and `left` are therefore required, and the sold-out form removes
 * them entirely rather than greying them.
 *
 * Sold out is three separately written strings in three separate slots:
 * status, cause, promise.
 */

export type DropCardProps = {
  /** "SATURDAY · INDIRANAGAR" */
  kicker: React.ReactNode;
  name: React.ReactNode;
  image?: { src: string; alt?: string } | null;
  /** Real numbers, server-supplied. */
  baked: number;
  left: number;
  reserved: number;
  /** "Orders close Thursday 8pm. No restocks, it is a van." */
  cutoffLine: React.ReactNode;
  status?: "open" | "closed" | "sold-out";
  /** Sold out only: the named cause. Scarcity read as demand, not accident. */
  soldOutCause?: React.ReactNode;
  onReserve?: () => void;
  onNotify?: () => void;
  className?: string;
};

export function DropCard({
  kicker,
  name,
  image,
  baked,
  left,
  reserved,
  cutoffLine,
  status = "open",
  soldOutCause,
  onReserve,
  onNotify,
  className,
}: DropCardProps) {
  const soldOut = status === "sold-out";
  const nearlyGone = !soldOut && left < 6;
  const fillPercent = baked > 0 ? Math.min(100, (reserved / baked) * 100) : 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-paper-300 bg-paper-0 p-8",
        className,
      )}
    >
      {/* 1. Status chip */}
      {soldOut ? (
        <Badge variant="muted">Sold out</Badge>
      ) : status === "closed" ? (
        <Badge variant="muted">Closed</Badge>
      ) : (
        <Badge variant="solid">Orders open</Badge>
      )}

      {/* 2. Kicker */}
      <p className="micro mt-4 text-ink-500">{kicker}</p>

      {/* 3. Photo */}
      {image ? (
        <div className="mt-4 aspect-3/2 overflow-hidden rounded-md bg-paper-200">
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            width={900}
            height={600}
            sizes="(min-width: 768px) 520px, 90vw"
            className={cn(
              "size-full object-cover",
              soldOut && "opacity-70 grayscale-70",
            )}
          />
        </div>
      ) : null}

      {/* 4. Name */}
      <h3 className="mt-6 text-display-md text-ink-800">{name}</h3>

      {soldOut ? (
        <>
          {/* Sold out: status, cause, promise — three slots, three strings. */}
          <p className="mt-4 font-display text-display-md text-ink-800">
            Gone for this week.
          </p>
          {soldOutCause ? (
            <p className="mt-3 text-body text-ink-600">{soldOutCause}</p>
          ) : null}
          <Button size="lg" fullWidth className="mt-8" onClick={onNotify}>
            Tell me when the van&rsquo;s back out
          </Button>
          <p className="mt-3 text-caption text-ink-500">
            One message, Sunday morning. Nothing else.
          </p>
        </>
      ) : (
        <>
          {/* 5. The count — the component's whole point. */}
          <p className="mt-4 flex items-center gap-2 font-display text-display-sm text-ink-800">
            {nearlyGone ? (
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-pill bg-warning"
              />
            ) : null}
            <span>
              We bake <span className="tabular">{baked}</span>.{" "}
              <span className="tabular">{left}</span> left.
            </span>
          </p>

          {/* 6. Reserve bar — kiln, never danger, at any level. */}
          <div className="mt-4">
            <div className="h-1 w-full bg-paper-200" aria-hidden="true">
              <div className="h-full bg-kiln" style={{ width: `${fillPercent}%` }} />
            </div>
            <div className="nano mt-2 flex items-center justify-between gap-4 text-ink-500">
              <span className="tabular">{reserved} RESERVED</span>
              {/* Permanent copy, not a tooltip. It is the honesty claim. */}
              <span className="tabular">{baked} IS THE OVEN, NOT A TACTIC</span>
            </div>
          </div>

          {/* 7. Primary action */}
          <Button
            size="lg"
            fullWidth
            className="mt-8"
            disabled={status === "closed"}
            onClick={onReserve}
          >
            Reserve yours
          </Button>

          {/* 8. Cut-off line — stated once, as a fact. */}
          <p className="mt-3 text-caption text-ink-500">{cutoffLine}</p>
        </>
      )}
    </div>
  );
}
