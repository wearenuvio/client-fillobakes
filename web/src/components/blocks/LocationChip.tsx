"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { LANES } from "@/lib/config";
import { formatTimeBandShort, weekdayName } from "@/lib/format";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * LocationChip — journey-recommendation.md §2.2, "the most important component
 * on the site". Reads the session store; tapping opens the Area & lane sheet.
 *
 * Five states, in the doc's order:
 *   unset          Set your area                        (kiln outline)
 *   van lane       Indiranagar · Sat 4–6pm · catch the van
 *   delivery lane  Banaswadi · Sat 4–6pm · ₹49
 *   no run         Banaswadi · no run this week          (muted)
 *   out of area    Whitefield · not yet                  (kiln)
 *
 * The doc draws a 📍 into the chip; DESIGN.md §11 forbids emoji outright, so
 * this uses the Lucide `map-pin` at 16px instead.
 *
 * It renders the unset state until the persisted store has hydrated, so the
 * server and the first client paint agree.
 */

export function LocationChip({
  onOpen,
  className,
}: {
  onOpen: () => void;
  className?: string;
}) {
  const hydrated = useSessionHydrated();
  const area = useSessionStore((s) => s.area);
  const status = useSessionStore((s) => s.areaStatus);
  const lane = useSessionStore((s) => s.lane);
  const date = useSessionStore((s) => s.date);
  const band = useSessionStore((s) => s.band);

  const state = !hydrated || !area ? "unset" : status;

  const parts: string[] = [];
  if (area) parts.push(area);
  if (state === "served") {
    if (date) parts.push(`${weekdayName(date).slice(0, 3)}${band ? ` ${formatTimeBandShort(band)}` : ""}`);
    if (lane) parts.push(lane === "catch_the_van" ? "catch the van" : LANES.home_delivery.priceLabel);
  } else if (state === "no_run") {
    parts.push("no run this week");
  } else if (state === "out_of_area") {
    parts.push("not yet");
  }

  const tone =
    state === "unset" || state === "out_of_area"
      ? "border-kiln text-kiln"
      : state === "no_run"
        ? "border-paper-300 text-ink-500"
        : "border-paper-300 text-ink-800";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={cn(
        "micro inline-flex h-9 max-w-[min(52vw,320px)] items-center gap-1.5 rounded-pill border",
        "bg-paper-0 px-3 whitespace-nowrap transition-colors duration-[var(--dur-fast)]",
        "hover:border-ink-600",
        tone,
        className,
      )}
    >
      <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      <span className="truncate">
        {state === "unset" ? "Set your area" : parts.join(" · ")}
      </span>
    </button>
  );
}
