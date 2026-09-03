import { cn } from "@/lib/cn";

/**
 * The stylised route map — PAGES-v2 "The Van".
 *
 * Cream ground, one chocolate line wandering down the page, hollow stop dots
 * that fill in as the van passes them, and a terracotta van marker sitting on
 * the line where the van actually is. Off air the road is drawn and there is
 * no marker at all, because a marker would be a claim we cannot support.
 *
 * It is a diagram, not a satellite view: we publish the order of the stops and
 * the band each one falls in, never a coordinate. The road meanders because a
 * street does, not because the wobble means anything.
 *
 * Rows are a FIXED height so the dots in the SVG rail and the names in the
 * HTML column share one set of y positions — no measuring, no drift, and the
 * names keep real typography instead of becoming `<text>`.
 */

export type MapStop = {
  id: string;
  name: string;
  descriptor?: string | null;
  band: string;
  /** "done" fills the dot, "current" parks the van on it. */
  state: "done" | "current" | "upcoming" | "sold_out";
  stateLabel?: string | null;
};

/* Rail geometry, in real pixels — nothing here is stretched. */
const RAIL_W = 88;
const DEFAULT_ROW_H = 104;
const TOP_PAD = 46;
const BOT_PAD = 56;
const CENTRE = 44;
/** Where the first line of a stop name sits inside its row. */
const NAME_Y = 26;
const AMPLITUDE = 19;

/** The wobble. Deterministic, so the same route always draws the same road. */
function xAt(index: number): number {
  return CENTRE + AMPLITUDE * Math.sin(index * 1.15 + 0.5);
}

function yAt(index: number, rowH: number): number {
  return TOP_PAD + index * rowH + NAME_Y;
}

/** Catmull-Rom through the stop points, so the road curves instead of kinking. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d +=
      ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}` +
      ` ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}` +
      ` ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function RouteMap({
  stops,
  /** Off air draws the road and parks nothing on it. */
  parked = false,
  routeName,
  /** Taller rows where each stop also carries an action. */
  rowHeight = DEFAULT_ROW_H,
  renderAction,
  className,
}: {
  stops: MapStop[];
  parked?: boolean;
  routeName?: string;
  rowHeight?: number;
  renderAction?: (stop: MapStop) => React.ReactNode;
  className?: string;
}) {
  if (stops.length === 0) return null;

  const rowH = rowHeight;
  const height = TOP_PAD + stops.length * rowH + BOT_PAD;

  // The kitchen sits above the first stop; the road runs on past the last one.
  const points = [
    { x: xAt(-0.6), y: 14 },
    ...stops.map((_, i) => ({ x: xAt(i), y: yAt(i, rowH) })),
    { x: xAt(stops.length - 0.4), y: height - 12 },
  ];
  const road = smoothPath(points);

  const currentIndex = parked ? -1 : stops.findIndex((s) => s.state === "current");
  const vanIndex =
    currentIndex >= 0
      ? currentIndex
      : parked
        ? -1
        : stops.findIndex((s) => s.state !== "done") - 1;

  const label = parked
    ? `A diagram of ${routeName ?? "the route"} with every stop still to come.`
    : `A diagram of ${routeName ?? "the route"}, showing where the van has reached.`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-well",
        className,
      )}
    >
      <MapTexture />

      <div className="relative flex px-4 pt-0 pb-2 sm:px-6">
        {/* -------- The road ------------------------------------------- */}
        <div
          className="relative shrink-0"
          style={{ width: RAIL_W, height }}
          aria-hidden="true"
        >
          <svg
            width={RAIL_W}
            height={height}
            viewBox={`0 0 ${RAIL_W} ${height}`}
            fill="none"
            className="absolute inset-0"
          >
            {/* A soft shoulder under the road, so it sits on the paper. */}
            <path
              d={road}
              stroke="var(--color-ink)"
              strokeOpacity="0.08"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d={road}
              stroke="var(--color-ink)"
              strokeOpacity="0.85"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* The kitchen: where every run starts. */}
            <circle
              cx={points[0].x}
              cy={points[0].y}
              r="4"
              fill="var(--color-well)"
              stroke="var(--color-ink)"
              strokeWidth="2"
            />

            {stops.map((stop, i) => {
              const x = xAt(i);
              const y = yAt(i, rowH);
              const done = stop.state === "done";
              return (
                <g key={stop.id}>
                  {/* A cream halo keeps the dot off the road stroke. */}
                  <circle cx={x} cy={y} r="8.5" fill="var(--color-well)" />
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={done ? "var(--color-ink)" : "var(--color-well)"}
                    stroke="var(--color-ink)"
                    strokeWidth="1.75"
                    strokeOpacity={done ? "1" : "0.55"}
                  />
                </g>
              );
            })}

            {vanIndex >= 0 ? (
              <VanMarker x={xAt(vanIndex)} y={yAt(vanIndex, rowH)} />
            ) : null}
          </svg>
        </div>

        {/* -------- The stops -------------------------------------------- */}
        <ol className="relative min-w-0 flex-1" style={{ paddingTop: TOP_PAD }}>
          <li
            className="absolute top-0 left-0 flex items-center"
            style={{ height: TOP_PAD }}
          >
            <span className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              The kitchen
            </span>
          </li>

          {stops.map((stop) => (
            <li
              key={stop.id}
              className="flex flex-col justify-start pl-1"
              style={{ height: rowH, paddingTop: NAME_Y - 13 }}
            >
              {/* Wide enough, and the band moves to the far edge of the row —
                  the same information, without a column of dead paper. */}
              <div className="lg:flex lg:items-baseline lg:justify-between lg:gap-8">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-display text-[19px] leading-[1.15]",
                      stop.state === "done" ? "text-ink-2" : "text-ink",
                    )}
                  >
                    {stop.name}
                  </p>
                  {stop.descriptor ? (
                    <p className="mt-0.5 text-body-sm text-muted">
                      {stop.descriptor}
                    </p>
                  ) : null}
                </div>

                <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-body-sm lg:mt-0 lg:shrink-0 lg:justify-end">
                  <span className="text-ink-2 tabular">{stop.band}</span>
                  {stop.stateLabel ? (
                    <span
                      className={cn(
                        "text-[12px] font-medium tracking-[0.12em] uppercase",
                        stop.state === "current" ? "text-accent" : "text-muted",
                      )}
                    >
                      {stop.stateLabel}
                    </span>
                  ) : null}
                </p>
              </div>
              {renderAction ? (
                <div className="mt-3">{renderAction(stop)}</div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <p className="sr-only">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The van, and the paper it drives on                                        */
/* -------------------------------------------------------------------------- */

/** A terracotta van, side elevation, parked on the line. */
function VanMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 15} ${y - 11})`}>
      <ellipse cx="15" cy="21" rx="12" ry="3" fill="var(--color-ink)" opacity="0.14" />
      <path
        d="M2 6.5A2.5 2.5 0 0 1 4.5 4h11.2v13H4.5A2.5 2.5 0 0 1 2 14.5Z"
        fill="var(--color-accent)"
      />
      <path
        d="M15.7 7.4h5.1L26 12.1v4.9h-10.3Z"
        fill="var(--color-accent)"
      />
      <rect x="17.4" y="8.9" width="4.6" height="3.4" rx="1" fill="var(--color-on-accent)" opacity="0.72" />
      <circle cx="9" cy="17.4" r="2.9" fill="var(--color-ink)" />
      <circle cx="9" cy="17.4" r="1.1" fill="var(--color-well)" />
      <circle cx="21" cy="17.4" r="2.9" fill="var(--color-ink)" />
      <circle cx="21" cy="17.4" r="1.1" fill="var(--color-well)" />
    </g>
  );
}

/**
 * The paper the route is drawn on: a whisper of a street grid, two blocks, and
 * one wheat ear in the corner — the line-art layer, well away from the text.
 */
function MapTexture() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="absolute inset-0 size-full" fill="none">
        <defs>
          <pattern
            id="fillo-map-grid"
            width="34"
            height="34"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M34 0H0v34"
              stroke="var(--color-ink)"
              strokeOpacity="0.035"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fillo-map-grid)" />
      </svg>

      <svg
        viewBox="0 0 96 96"
        className="absolute -right-7 -bottom-6 h-28 w-28 text-ink opacity-[0.10] sm:h-36 sm:w-36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M48 90V32" />
        <path d="M48 32c0-8 5-14 12-16-1 9-5 15-12 16Z" />
        <path d="M48 32c0-8-5-14-12-16 1 9 5 15 12 16Z" />
        <path d="M48 48c0-8 5-14 12-16-1 9-5 15-12 16Z" />
        <path d="M48 48c0-8-5-14-12-16 1 9 5 15 12 16Z" />
        <path d="M48 64c0-8 5-14 12-16-1 9-5 15-12 16Z" />
        <path d="M48 64c0-8-5-14-12-16 1 9 5 15 12 16Z" />
      </svg>
    </div>
  );
}
