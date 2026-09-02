"use client";

import * as React from "react";
import { Check, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { getAreas, resolveAreaQuery, type Area } from "@/lib/mock";
import { useSessionStore } from "@/store/session";

/**
 * AreaCheck — DESIGN.md §12.28. Serviceability, asked once and remembered.
 *
 * Three result states, each naming the outcome and giving EXACTLY one next
 * action. The middle one is the important one: "catch-the-van only" is a
 * different, equally valid lane and is never styled with warning or danger.
 * Neither is "not yet" — it is a waitlist, not a dead end, with no "sorry" and
 * no support link.
 *
 * Persistence: once set, the header LocationChip carries the answer and the
 * question is never asked again mid-session. It never blocks browsing — only
 * checkout.
 */

export type AreaCheckStatus = "idle" | "checking" | "result" | "error";

/** Maps mock-data serviceability onto the three designed result blocks. */
export type AreaResultKind = "served" | "van-only" | "not-yet";

export function resultKindFor(area: Area): AreaResultKind {
  if (area.serviceability === "served") return "served";
  if (area.serviceability === "catch_van_only") return "van-only";
  return "not-yet";
}

export function AreaCheck({
  status = "idle",
  area,
  /** Free text the visitor typed, used when nothing in the data matches. */
  query: queryProp,
  error,
  onCheck,
  onPrimaryAction,
  onSecondaryAction,
  onCapture,
  captured = false,
  compact = false,
  className,
}: {
  status?: AreaCheckStatus;
  area?: Area | null;
  query?: string;
  error?: React.ReactNode;
  onCheck?: (query: string, resolved: Area | undefined) => void;
  onPrimaryAction?: (area: Area) => void;
  onSecondaryAction?: (area: Area) => void;
  onCapture?: (value: string) => void;
  captured?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();
  const setArea = useSessionStore((s) => s.setArea);

  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getAreas().filter(
      (a) => a.name.toLowerCase().includes(q) || a.pincode.startsWith(q),
    );
  }, [query]);

  function submit(value: string) {
    const next = value.trim();
    if (!next) return;
    setOpen(false);
    const resolved = resolveAreaQuery(next);
    if (resolved) {
      setArea(
        resolved.name,
        resolved.serviceability === "not_yet" ? "out_of_area" : "served",
      );
    }
    onCheck?.(next, resolved);
  }

  return (
    <div className={className}>
      <div className={cn("flex flex-col gap-3", !compact && "sm:flex-row sm:items-end")}>
        <Field
          label="Your area or pincode"
          htmlFor="areacheck-input"
          className={compact ? undefined : "sm:flex-1"}
          error={status === "error" ? error : undefined}
        >
          <div className="relative">
            <Input
              id="areacheck-input"
              role="combobox"
              aria-expanded={open && suggestions.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              autoComplete="off"
              value={query}
              disabled={status === "checking"}
              inputMode={/^\d+$/.test(query) ? "numeric" : "text"}
              placeholder="Indiranagar, or 560038"
              leadingIcon={<MapPin size={20} strokeWidth={1.5} aria-hidden="true" />}
              invalid={status === "error"}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(query);
                if (e.key === "Escape") setOpen(false);
              }}
            />
            {open && suggestions.length > 0 ? (
              <ul
                id={listId}
                role="listbox"
                className="absolute top-full right-0 left-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-sm border border-paper-300 bg-paper-0 shadow-overlay"
              >
                {suggestions.map((option) => (
                  <li key={option.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        setQuery(option.name);
                        submit(option.name);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-body-sm text-ink-800 hover:bg-paper-100"
                    >
                      <MapPin
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="text-ink-500"
                      />
                      {option.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Field>

        <Button
          size="md"
          loading={status === "checking"}
          onClick={() => submit(query)}
          className={compact ? "w-full" : undefined}
        >
          Check
        </Button>
      </div>

      {/* Optional, and never a prompt on load (§12.28). */}
      <Button variant="ghost" size="sm" className="mt-1 -ml-3">
        Use my location
      </Button>

      {status === "result" ? (
        <AreaResultBlock
          area={area ?? null}
          query={queryProp ?? query}
          contact={contact}
          onContactChange={setContact}
          onCapture={onCapture}
          captured={captured}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
        />
      ) : null}
    </div>
  );
}

/** The three result states: each a radius-md block with space-4 padding. */
export function AreaResultBlock({
  area,
  query = "",
  contact = "",
  onContactChange,
  onCapture,
  captured = false,
  onPrimaryAction,
  onSecondaryAction,
}: {
  area: Area | null;
  query?: string;
  contact?: string;
  onContactChange?: (value: string) => void;
  onCapture?: (value: string) => void;
  captured?: boolean;
  onPrimaryAction?: (area: Area) => void;
  onSecondaryAction?: (area: Area) => void;
}) {
  const name = area?.name ?? query;
  const kind: AreaResultKind = area ? resultKindFor(area) : "not-yet";

  if (captured) {
    return (
      <div className="mt-4 rounded-md bg-paper-100 p-4">
        <p className="flex items-start gap-2 text-body text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-success"
            aria-hidden="true"
          />
          <span>
            Noted. We&rsquo;ll message you when the van gets to {name}.
            {typeof area?.waitlist?.position === "number" ? (
              <span className="tabular"> You&rsquo;re #{area.waitlist.position}.</span>
            ) : null}
          </span>
        </p>
      </div>
    );
  }

  if (kind === "served" && area) {
    return (
      <div className="mt-4 rounded-md bg-success-tint p-4">
        <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-success"
            aria-hidden="true"
          />
          We deliver to {area.name}.
        </p>
        <p className="mt-1 pl-7 text-body-sm text-ink-600">
          {area.runDaysLabel}. {area.freeOver ? `Free over ₹${area.freeOver}, ` : ""}
          {area.deliveryFee ? `₹${area.deliveryFee} under.` : ""}
        </p>
        <div className="mt-4 pl-7">
          <Button size="md" onClick={() => onPrimaryAction?.(area)}>
            See this week&rsquo;s bake
          </Button>
        </div>
      </div>
    );
  }

  if (kind === "van-only" && area) {
    return (
      <div className="mt-4 rounded-md bg-paper-200 p-4">
        <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
          <Truck
            size={20}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-ink-800"
            aria-hidden="true"
          />
          We don&rsquo;t deliver to {area.name} yet — but the van stops nearby.
        </p>
        <p className="mt-1 pl-7 text-body-sm text-ink-600">
          {area.nearestStopLabel ?? area.answer}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 pl-7">
          <Button size="md" onClick={() => onPrimaryAction?.(area)}>
            Catch the van at {area.nearestStop ?? area.name}
          </Button>
          <Button variant="ghost" size="md" onClick={() => onSecondaryAction?.(area)}>
            See the full route →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md bg-paper-100 p-4">
      <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
        <MapPin
          size={20}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-ink-500"
          aria-hidden="true"
        />
        We&rsquo;re not in {name} yet.
      </p>
      <p className="mt-1 pl-7 text-body-sm text-ink-600">
        We add stops where enough people ask. Tell us you&rsquo;re there and
        you&rsquo;ll be the first to know when we are.
      </p>
      <div className="mt-4 flex flex-col gap-3 pl-7 sm:flex-row sm:items-end">
        <Field label="WhatsApp number" htmlFor="areacheck-capture" className="sm:flex-1">
          <Input
            id="areacheck-capture"
            prefix="+91"
            inputMode="tel"
            maxLength={10}
            value={contact}
            onChange={(e) => onContactChange?.(e.target.value.replace(/\D/g, ""))}
            className="font-mono tabular"
          />
        </Field>
        <Button size="md" onClick={() => onCapture?.(contact)} disabled={!contact.trim()}>
          Tell us you&rsquo;re there
        </Button>
      </div>
    </div>
  );
}
