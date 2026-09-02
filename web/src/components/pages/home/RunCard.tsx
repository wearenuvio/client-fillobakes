import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { Tbc } from "@/components/pages/home/Tbc";
import {
  AS_OF,
  getCutoffCopy,
  getOnBoard,
  getRoute,
  getVanState,
} from "@/lib/mock";
import { formatClock, formatLongDate, formatTimeOfDay, pluralise } from "@/lib/format";

/**
 * "This week's bake" — the run card. site-content Home §6, DESIGN.md §12.27.
 *
 * Say how many you baked. Never how long is left. There is no clock, no
 * ticking digit, no red and no "hurry" here: the cut-off carries all the time
 * pressure and it is stated once, in body colour, as a fact.
 *
 * The per-bake capacity is a founder placeholder (`meta.tbc.ovenCapacityPerBake`
 * — "do not publish a cap the kitchen cannot honour"), so the count line prints
 * the placeholder and the reserve bar is omitted entirely rather than being
 * drawn from a number nobody has set. What IS real is the on-board count for
 * each bake, and that is what the card leans on.
 */

const RUN_PHOTO = "/images/stock/hero/shokupan-loaf-sliced-warm-light.jpg";

export function RunCard() {
  const van = getVanState();
  const route = van.routeId ? getRoute(van.routeId) : undefined;
  const onBoard = getOnBoard();
  const left = onBoard.reduce((sum, item) => sum + item.left, 0);
  const runDate = formatLongDate(AS_OF);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
      {/* -------- Columns 1–5: the facts, in text ------------------------- */}
      <div className="lg:col-span-5">
        <Kicker>This week</Kicker>
        <h2 className="mt-4 text-display-lg text-ink-800">The Saturday bake</h2>

        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <Badge variant="outline">{runDate}</Badge>
          </li>
          {route ? (
            <li>
              <Badge variant="outline">{route.name}</Badge>
            </li>
          ) : null}
          {route ? (
            <li>
              <Badge variant="outline" tabular>
                {pluralise(route.stops.length, "stop")}
              </Badge>
            </li>
          ) : null}
        </ul>

        <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
          One route, one afternoon. Everything on board was baked that morning
          and sold from the van until the racks are empty.
        </p>

        {/* The honest part: what is actually left, bake by bake. */}
        <dl className="mt-8 divide-y divide-paper-300 border-y border-y-paper-300">
          {onBoard.map((item) => (
            <div key={item.slug} className="flex items-baseline gap-3 py-3">
              <dt className="min-w-0 shrink truncate text-body text-ink-800">
                {item.name}
              </dt>
              <span className="dot-leader" aria-hidden="true" />
              <dd
                className={
                  item.state === "sold_out"
                    ? "shrink-0 font-mono text-body-sm text-ink-500 tabular"
                    : item.state === "low_stock"
                      ? "shrink-0 font-mono text-body-sm text-warning tabular"
                      : "shrink-0 font-mono text-body-sm text-ink-800 tabular"
                }
              >
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="micro mt-3 text-ink-500">
          Counted on the van at {formatTimeOfDay(van.asOf)}
        </p>
      </div>

      {/* -------- Columns 7–12: the buy card ----------------------------- */}
      <div className="lg:col-span-7 lg:col-start-6">
        <div className="rounded-lg border border-paper-300 bg-paper-0 p-6 md:p-8">
          <Badge variant="solid">Orders open</Badge>

          <p className="micro mt-4 text-ink-500">
            {runDate} · first stop {route?.stops[0]?.name ?? ""}{" "}
            {route ? formatClock(route.firstStopAt) : ""}
          </p>

          <div className="mt-4 aspect-3/2 overflow-hidden rounded-md bg-paper-200">
            <Image
              src={RUN_PHOTO}
              alt="A shokupan loaf, sliced, in morning light"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 620px, 92vw"
              className="size-full object-cover"
            />
          </div>

          {/* The count. Two numbers, two spans, tabular, so the line holds. */}
          <p className="mt-6 font-display text-display-sm text-ink-800">
            We bake <Tbc what="The per-bake capacity" />.{" "}
            <span className="tabular">{left}</span> left on the van.
          </p>
          <p className="nano mt-3 text-ink-500">
            The oven sets the number, not a tactic
          </p>

          <ButtonLink href="/shop" size="lg" fullWidth className="mt-8">
            Reserve yours
          </ButtonLink>

          <p className="mt-3 text-caption text-ink-500">
            {getCutoffCopy("open")}. No restocks, it is a van.
          </p>
        </div>
      </div>
    </div>
  );
}
