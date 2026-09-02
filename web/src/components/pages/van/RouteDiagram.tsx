import { Truck } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * RouteDiagram — the map layer for /van and /van/[route].
 *
 * DESIGN.md §12.16: "the list owns the truth, the map owns the feeling". This
 * is deliberately a *stylised route diagram*, not a slippy map: no tiles, no
 * API key, no third-party script, nothing that can fail and take the page's
 * answer with it. Every fact it carries — which stop is served, which is next,
 * where the van is — is also written in text beside it.
 *
 * The geometry is derived from the stop count, so it is stable between renders
 * and identical on the server and the client. It is not a survey: the numbered
 * markers key into the stop list, and the list carries the names.
 *
 * Off air the whole diagram greys out and the van sits parked at the kitchen,
 * with no pulse — a schedule, never an error (§13).
 */

export type DiagramStop = {
  id: string;
  name: string;
  state: "done" | "current" | "upcoming" | "sold_out";
};

const W = 360;
const H = 270;
const KITCHEN = { x: 30, y: 236 };

type Point = { x: number; y: number };

/** Deterministic layout — no randomness, so SSR and the client agree. */
function layout(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return {
      x: 84 + t * 240 + Math.cos(i * 2.3) * 9,
      y: 214 - t * 140 + Math.sin(i * 1.9) * 22,
    };
  });
}

/** A smooth polyline: quadratic segments hinged on each waypoint. */
function smooth(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${r(points[0].x)} ${r(points[0].y)}`;
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const mid = {
      x: (points[i].x + points[i + 1].x) / 2,
      y: (points[i].y + points[i + 1].y) / 2,
    };
    d += ` Q ${r(points[i].x)} ${r(points[i].y)} ${r(mid.x)} ${r(mid.y)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${r(last.x)} ${r(last.y)}`;
  return d;
}

/** One decimal is plenty at this scale, and keeps the markup small. */
function r(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function RouteDiagram({
  stops,
  /** Off air: the van sits at the kitchen and nothing animates. */
  parked = false,
  /** The accessible summary. The visual is decorative on top of the list. */
  label,
  className,
}: {
  stops: DiagramStop[];
  parked?: boolean;
  label: string;
  className?: string;
}) {
  const points = layout(stops.length);
  const chain = [KITCHEN, ...points];

  const currentIndex = stops.findIndex((s) => s.state === "current");
  const lastDone = stops.reduce(
    (acc, s, i) => (s.state === "done" || s.state === "sold_out" ? i : acc),
    -1,
  );
  // Where the van is drawn: at the current stop, else just past the last
  // served one, else at the kitchen.
  const vanChainIndex = parked
    ? 0
    : currentIndex >= 0
      ? currentIndex + 1
      : Math.max(0, lastDone + 1);
  const van = chain[Math.min(vanChainIndex, chain.length - 1)];

  const travelled = smooth(chain.slice(0, vanChainIndex + 1));
  const remaining = smooth(chain.slice(vanChainIndex));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
      className={cn("block h-full w-full", className)}
    >
      <rect width={W} height={H} fill="var(--color-paper-100)" />

      {/* Ghosted street grid — §10.3's line-art texture, kept behind everything. */}
      <g stroke="var(--color-paper-300)" strokeWidth={1} fill="none" opacity={0.75}>
        <path d="M -10 196 L 370 158" />
        <path d="M -10 108 L 370 74" />
        <path d="M 116 -10 L 92 280" />
        <path d="M 268 -10 L 246 280" />
        <rect x={132} y={168} width={82} height={54} rx={2} />
        <rect x={196} y={64} width={64} height={58} rx={2} />
        <rect x={40} y={92} width={54} height={62} rx={2} />
      </g>

      {/* The route. Served portion dashed, the rest solid. */}
      {parked ? (
        <path
          d={smooth(chain)}
          fill="none"
          stroke="var(--color-paper-400)"
          strokeWidth={2}
          strokeDasharray="5 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          {vanChainIndex > 0 ? (
            <path
              d={travelled}
              fill="none"
              stroke="var(--color-kiln)"
              strokeWidth={2}
              strokeDasharray="5 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.45}
            />
          ) : null}
          <path
            d={remaining}
            fill="none"
            stroke="var(--color-kiln)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* The kitchen, where every run starts. */}
      <g>
        <rect
          x={KITCHEN.x - 7}
          y={KITCHEN.y - 7}
          width={14}
          height={14}
          rx={2}
          fill="var(--color-ink-800)"
        />
        <text
          x={KITCHEN.x - 8}
          y={KITCHEN.y + 22}
          fontSize={10}
          letterSpacing={1.4}
          fontFamily="var(--font-mono)"
          fill="var(--color-ink-500)"
        >
          KITCHEN
        </text>
      </g>

      {/* Stop markers, numbered to key into the list beside them. */}
      {points.map((point, i) => (
        <StopMarker
          key={stops[i].id}
          point={point}
          index={i + 1}
          state={parked ? "upcoming" : stops[i].state}
          animate={!parked}
        />
      ))}

      {/* The van. One of the four sanctioned blob uses (§5.1). */}
      <g transform={`translate(${r(van.x)} ${r(van.y - 24)})`}>
        {!parked ? (
          <circle
            r={13}
            fill="var(--color-crumb)"
            opacity={0.5}
            data-motion="pulse"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            className="animate-[var(--animate-van-pulse)]"
          />
        ) : null}
        <path
          d="M 0,-15 C 8.5,-15 15,-8.5 15,0 C 15,9.5 8.5,15 -1,15 C -9.5,15 -15,8.5 -15,-1 C -15,-9.5 -8.5,-15 0,-15 Z"
          transform="rotate(-8)"
          fill={parked ? "var(--color-ink-600)" : "var(--color-ink-800)"}
        />
        <g transform="translate(-9 -9)" className="text-paper-0">
          <Truck size={18} strokeWidth={1.5} aria-hidden="true" />
        </g>
      </g>
    </svg>
  );
}

function StopMarker({
  point,
  index,
  state,
  animate,
}: {
  point: Point;
  index: number;
  state: DiagramStop["state"];
  animate: boolean;
}) {
  const fill =
    state === "done"
      ? "var(--color-ink-800)"
      : state === "current"
        ? "var(--color-crumb)"
        : state === "sold_out"
          ? "var(--color-paper-200)"
          : "var(--color-paper-0)";
  const stroke =
    state === "upcoming"
      ? "var(--color-paper-400)"
      : state === "sold_out"
        ? "var(--color-ink-400)"
        : "none";
  const text =
    state === "done"
      ? "var(--color-paper-0)"
      : state === "current"
        ? "var(--color-ink-900)"
        : state === "sold_out"
          ? "var(--color-ink-400)"
          : "var(--color-ink-600)";

  return (
    <g transform={`translate(${r(point.x)} ${r(point.y)})`}>
      {state === "current" && animate ? (
        <circle
          r={9}
          fill="var(--color-crumb)"
          opacity={0.5}
          data-motion="pulse"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          className="animate-[var(--animate-van-pulse)]"
        />
      ) : null}
      <circle r={9} fill={fill} stroke={stroke} strokeWidth={stroke === "none" ? 0 : 1.5} />
      <text
        y={3.5}
        textAnchor="middle"
        fontSize={10}
        fontFamily="var(--font-mono)"
        fill={text}
      >
        {index}
      </text>
      {state === "sold_out" ? (
        <path
          d="M -11 6 L 11 -6"
          stroke="var(--color-ink-400)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
}
