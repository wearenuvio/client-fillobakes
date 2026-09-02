"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Field";

/**
 * MapPanel — the map's frame, and the thing that makes the load order true.
 *
 * DESIGN.md §12.16: "status, hero line, arrival band and route list are
 * server-rendered BEFORE the map loads … the map is a progressively-enhanced
 * child, never the container." So the diagram is passed in as a child and this
 * panel only mounts it after the first paint. Until then the frame holds its
 * exact aspect ratio, so nothing on the page moves when it arrives.
 *
 * `Lite mode` (module 12) is a real switch, not a label: it takes the map off
 * for a slow connection, and every number on the page stays where it was.
 */

/**
 * The bare version of the same rule, for slotting into `TrackerCard`'s `map`
 * prop: the child mounts after the first paint, and the panel above it has
 * already answered the question.
 */
export function DeferredMap({
  children,
  fallback = "Loading. The map comes last, on purpose.",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // A timeout, not requestAnimationFrame: rAF never fires in a background
    // tab, and this page is forwarded and opened in one constantly.
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (mounted) return <>{children}</>;
  return (
    <p className="flex h-full items-center justify-center p-6 text-center text-body-sm text-ink-500">
      {fallback}
    </p>
  );
}

export function MapPanel({
  children,
  /** `4 / 3` on the page, `16 / 10` in a widget (§10.5). */
  ratio = "page",
  caption,
  /** The feed-error state: the map is replaced, the schedule stays put. */
  failed = false,
  className,
}: {
  children: React.ReactNode;
  ratio?: "page" | "widget";
  caption?: React.ReactNode;
  failed?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [lite, setLite] = React.useState(false);
  const switchId = React.useId();

  React.useEffect(() => {
    // After paint, not during it. The text has already answered the question.
    // A timeout rather than rAF, which never fires in a background tab.
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={className}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-paper-300 bg-paper-100",
          ratio === "page" ? "aspect-4/3" : "aspect-16/10",
        )}
      >
        {failed ? (
          <div className="flex h-full flex-col items-start justify-center gap-3 p-6">
            <p className="flex items-start gap-2 text-body-sm text-ink-600">
              <AlertCircle
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              We can&rsquo;t reach the van right now — here&rsquo;s today&rsquo;s
              route anyway.
            </p>
            <Button variant="ghost" size="sm" className="-ml-3">
              Retry
            </Button>
          </div>
        ) : lite ? (
          <p className="flex h-full items-center justify-center p-6 text-center text-body-sm text-ink-500">
            Lite mode is on. The schedule is the whole answer.
          </p>
        ) : mounted ? (
          children
        ) : (
          <p className="flex h-full items-center justify-center p-6 text-center text-body-sm text-ink-500">
            Loading. The map comes last, on purpose.
          </p>
        )}
      </div>

      {caption ? <p className="mt-3 text-caption text-ink-500">{caption}</p> : null}

      <div className="border-b border-b-paper-300">
        <Switch
          id={switchId}
          checked={lite}
          onCheckedChange={setLite}
          label="Lite mode"
          helper="Turns the map off. Nothing else changes."
        />
      </div>
    </div>
  );
}
