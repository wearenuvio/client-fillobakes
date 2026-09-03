"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * LocationChip — the one place the site says where it is bringing your bread.
 *
 * Four states, and each one is a sentence a person could say out loud:
 *   unset          Set your area
 *   van lane       Indiranagar · catch the van
 *   delivery lane  Indiranagar · ₹49
 *   not yet        Whitefield · not yet
 *
 * DESIGN-v2 §2 keeps this out of the header — the question belongs in the
 * cart, where it first matters. The chip survives for the pages that ask it
 * inline, and it opens the same single Area & lane sheet.
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

  const state = !hydrated || !area ? "unset" : status;

  const parts: string[] = [];
  if (area) parts.push(area);
  if (state === "served" && lane) {
    parts.push(
      lane === "catch_the_van"
        ? "catch the van"
        : formatINR(COMMERCE.deliveryFee),
    );
  } else if (state === "no_run") {
    parts.push("no run this week");
  } else if (state === "out_of_area") {
    parts.push("not yet");
  }

  const tone =
    state === "unset" || state === "out_of_area"
      ? "border-accent text-accent"
      : state === "no_run"
        ? "border-line text-muted"
        : "border-line text-ink";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={cn(
        "inline-flex h-11 max-w-[min(60vw,320px)] items-center gap-1.5 rounded-pill border",
        "bg-card px-4 text-body-sm whitespace-nowrap",
        "transition-colors duration-[var(--dur-fast)] hover:border-ink",
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
