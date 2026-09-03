"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { useSessionStore, type AreaStatus } from "@/store/session";
import type { LaneId } from "@/lib/config";

/**
 * "Catch it here" / "Order for Saturday" — PAGES-v2 Routes and Areas.
 *
 * The one button on a route or an area page. It answers the question the page
 * raised by *doing* the thing: the area and the lane are remembered, the chosen
 * stop is remembered with them, and the order drawer opens already knowing
 * where the bread is going.
 *
 * Serviceability is asked once and kept (DECISIONS §2), so a visitor who lands
 * on `/areas/indiranagar` from a search never gets asked again in the cart.
 */
export function SetAreaButton({
  area,
  status,
  lane,
  stopId,
  children,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
}: {
  area: string;
  status: AreaStatus;
  lane: LaneId;
  /** Catch-the-van only: the stop the visitor pressed. */
  stopId?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  const setArea = useSessionStore((s) => s.setArea);
  const setLane = useSessionStore((s) => s.setLane);
  const setStop = useSessionStore((s) => s.setStop);
  const openCart = useCartStore((s) => s.open);

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={cn(className)}
      onClick={() => {
        // Order matters: setting the area clears a stop that belonged to the
        // previous one, so the new stop has to land after it.
        setArea(area, status);
        setLane(lane);
        if (stopId) setStop(stopId);
        openCart();
      }}
    >
      {children}
    </Button>
  );
}
