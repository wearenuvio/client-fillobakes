"use client";

import * as React from "react";
import { TrackerCard } from "@/components/blocks/TrackerCard";
import { DeferredMap } from "@/components/pages/van/MapPanel";
import { RouteDiagram, type DiagramStop } from "@/components/pages/van/RouteDiagram";
import { NotifyMeSheet } from "@/components/pages/van/NotifyMeSheet";
import type { VanState } from "@/lib/mock";

/**
 * The tracker widget on an area page.
 *
 * This is the literal shape of the load-bearing rule: `TrackerCard` renders
 * the status, the hero line, the arrival band and the route list, and the map
 * is handed to it as a child that only mounts after the first paint. Remove
 * the child entirely and the panel still answers the question (§12.16).
 */
export function AreaVanPanel({
  van,
  stops,
  parked,
  label,
  stopId,
  className,
}: {
  van: VanState;
  stops: DiagramStop[];
  parked: boolean;
  label: string;
  stopId?: string | null;
  className?: string;
}) {
  const [notifyOpen, setNotifyOpen] = React.useState(false);

  return (
    <>
      <TrackerCard
        className={className}
        van={van}
        compact
        onNotify={() => setNotifyOpen(true)}
        map={
          <DeferredMap>
            <RouteDiagram stops={stops} parked={parked} label={label} />
          </DeferredMap>
        }
      />
      <NotifyMeSheet
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        stopId={stopId ?? undefined}
      />
    </>
  );
}
