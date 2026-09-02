"use client";

import * as React from "react";
import { Check, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Price, FreeLabel } from "@/components/ui/Price";
import { LANES, type LaneId } from "@/lib/config";

/**
 * FulfilmentLane — DESIGN.md §12.29.
 *
 * Two lanes, chosen BEFORE the cart, with the price ATTACHED to each and
 * always visible. Never disclosed later, never "calculated at checkout".
 *
 * Sits directly under the Add-to-box button on the PDP so route and window are
 * settled before checkout, and again as a confirmable step in checkout.
 * Changing lane after items are in the box never clears the box.
 */

export type LaneOption = {
  id: LaneId;
  /** "Saturday · Indiranagar · 4 to 6pm" */
  detail: React.ReactNode;
  available?: boolean;
  /** Shown under the lane name when unavailable: "NOT IN WHITEFIELD YET". */
  reason?: string;
};

export function FulfilmentLane({
  options,
  value,
  onChange,
  /** No area set: both lanes disabled, with the AreaCheck above them. */
  areaSet = true,
  onCheckArea,
  className,
}: {
  options: LaneOption[];
  value: LaneId | null;
  onChange: (lane: LaneId) => void;
  areaSet?: boolean;
  onCheckArea?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {!areaSet ? (
        <p className="mb-3 text-body-sm text-ink-600">
          Set your area to see your options.
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-label="Where the van meets you"
        className="grid gap-3 min-[560px]:grid-cols-2"
      >
        {options.map((option) => {
          const lane = LANES[option.id];
          const selected = value === option.id;
          const disabled = !areaSet || option.available === false;
          const Icon = option.id === "home_delivery" ? Truck : MapPin;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : selected || !value ? 0 : -1}
              onClick={() => !disabled && onChange(option.id)}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-md border-[1.5px] p-5 text-left",
                "transition-colors duration-[var(--dur-fast)]",
                disabled
                  ? "border-paper-400 bg-paper-100 text-ink-400"
                  : selected
                    ? "border-ink-800 bg-paper-100"
                    : "border-paper-400 bg-paper-0 hover:border-ink-600",
              )}
            >
              {selected && !disabled ? (
                <Check
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="absolute top-4 right-4 text-ink-800"
                />
              ) : null}

              <Icon
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
                className={disabled ? "text-ink-400" : "text-ink-800"}
              />
              <span
                className={cn(
                  "text-title font-sans font-semibold",
                  disabled ? "text-ink-400" : "text-ink-800",
                )}
              >
                {lane.label}
              </span>

              {disabled && option.reason ? (
                <span className="micro text-ink-500">{option.reason}</span>
              ) : null}

              {/* The price is attached and always visible. */}
              {lane.price === 0 ? (
                <FreeLabel />
              ) : (
                <Price amount={lane.price} muted={disabled} />
              )}

              <span
                className={cn(
                  "text-body-sm",
                  disabled ? "text-ink-400" : "text-ink-600",
                )}
              >
                {option.detail}
              </span>
              <span className="micro text-ink-500">{lane.qualifier}</span>

              {disabled && option.reason ? (
                <span className="link-underline mt-1 text-body-sm text-ink-700">
                  Check another area
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {!areaSet ? (
        <Button variant="secondary" size="md" className="mt-4" onClick={onCheckArea}>
          Set your area
        </Button>
      ) : null}
    </div>
  );
}

/**
 * The compact summary variant (§12.29): one hairline row carrying icon, lane,
 * day, area, window, price and a ghost `Change`. Used in the cart drawer, the
 * checkout summary and the order confirmation.
 */
export function FulfilmentSummary({
  lane,
  detail,
  onChange,
  tone = "paper",
  className,
}: {
  lane: LaneId;
  detail: React.ReactNode;
  onChange?: () => void;
  tone?: "paper" | "dark";
  className?: string;
}) {
  const config = LANES[lane];
  const Icon = lane === "home_delivery" ? Truck : MapPin;
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t py-3",
        dark ? "border-t-[var(--hairline-dark-color)]" : "border-t-paper-300",
        className,
      )}
    >
      <Icon
        size={20}
        strokeWidth={1.5}
        aria-hidden="true"
        className={cn("shrink-0", dark ? "text-paper-0" : "text-ink-800")}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-body-sm font-semibold",
            dark ? "text-paper-0" : "text-ink-800",
          )}
        >
          {config.label}
        </p>
        <p className={cn("truncate text-caption", dark ? "text-ink-400" : "text-ink-500")}>
          {detail}
        </p>
      </div>
      {config.price === 0 ? (
        <FreeLabel size="sm" tone={dark ? "onDark" : "ink"} />
      ) : (
        <Price amount={config.price} size="sm" tone={dark ? "onDark" : "ink"} />
      )}
      {onChange ? (
        <Button variant="ghost" size="sm" onClick={onChange}>
          Change
        </Button>
      ) : null}
    </div>
  );
}
