"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Checkbox } from "@/components/ui/Field";
import { getAreas, getNotifyMeCopy } from "@/lib/mock";

/**
 * WhatsApp opt-in row — DESIGN.md §12.31, journey §6.4.
 *
 * WhatsApp, not web push: Safari cannot receive push from a tab, and these
 * pages arrive by QR and forward.
 *
 * The three rules that make it work:
 *  1. **Never a cold prompt on load.** It appears after a value moment —
 *     ~20s dwell, a second visit, or a sold-out view. Pressured users deny
 *     permanently. This component never mounts itself; the page decides.
 *  2. **`Not now` is always present and is a real ghost button** — the same
 *     size as the primary. Never an `x` in a corner, never smaller, never
 *     lower-contrast than the reassurance line.
 *  3. **Always show what the message will say and how often, before the
 *     button.** The expectation IS the pitch.
 */

export type OptInState = "idle" | "submitting" | "success" | "already" | "error";

export function WhatsAppOptIn({
  state = "idle",
  /** Pre-filled from the session's area. */
  area,
  onSubmit,
  onNotNow,
  onTurnOff,
  onChange,
  error,
  className,
}: {
  state?: OptInState;
  area?: string | null;
  onSubmit?: (input: { area: string; phone: string; trigger: string }) => void;
  onNotNow?: () => void;
  onTurnOff?: () => void;
  onChange?: () => void;
  error?: React.ReactNode;
  className?: string;
}) {
  const copy = getNotifyMeCopy();
  const areas = getAreas().filter((a) => a.serviceability !== "not_yet");
  const [selectedArea, setSelectedArea] = React.useState(area ?? areas[0]?.name ?? "");
  const [phone, setPhone] = React.useState("");
  const [trigger, setTrigger] = React.useState(copy.default);
  const fieldId = React.useId();

  /* -------- Success replaces the row in place. No toast, no redirect. */
  if (state === "success") {
    return (
      <div className={cn("rounded-md bg-paper-100 p-6", className)}>
        <p className="flex items-start gap-2 text-body text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-success"
          />
          You&rsquo;re on the list. You&rsquo;ll hear from us before anyone else
          does.
        </p>
      </div>
    );
  }

  /* -------- Already opted in: a single hairline line. */
  if (state === "already") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 border-y border-y-paper-300 py-4",
          className,
        )}
      >
        <Check
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 text-success"
        />
        <p className="min-w-0 flex-1 text-body-sm text-ink-800">
          WhatsApp nudges on for {area ?? selectedArea}
        </p>
        <Button variant="ghost" size="sm" onClick={onChange}>
          Change
        </Button>
        <Button variant="ghost" size="sm" onClick={onTurnOff}>
          Turn off
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md bg-paper-100 p-6", className)}>
      <h3 className="font-display text-display-sm text-ink-800">
        {copy.copy.heading}
      </h3>
      {/* The expectation, set precisely, before the button. */}
      <p className="mt-3 max-w-[62ch] text-body text-ink-600">
        One WhatsApp message when we&rsquo;re about two stops from your gate. At
        most one a day.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Stop or area" htmlFor={`${fieldId}-area`}>
          <Select
            id={`${fieldId}-area`}
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            {areas.map((a) => (
              <option key={a.slug} value={a.name}>
                {a.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Mobile number"
          htmlFor={`${fieldId}-phone`}
          error={state === "error" ? (error ?? copy.copy.error) : undefined}
        >
          <Input
            id={`${fieldId}-phone`}
            prefix="+91"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={10}
            value={phone}
            invalid={state === "error"}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="font-mono tabular"
          />
        </Field>
      </div>

      <fieldset className="mt-4 border-0 p-0">
        <legend className="micro mb-1 text-ink-600">Tell me when</legend>
        {copy.triggers.map((option) => (
          <Checkbox
            key={option}
            type="radio"
            name={`${fieldId}-trigger`}
            checked={trigger === option}
            onChange={() => setTrigger(option)}
            label={TRIGGER_LABELS[option] ?? option}
          />
        ))}
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          size="md"
          loading={state === "submitting"}
          icon={<MessageCircle size={20} strokeWidth={1.5} />}
          iconPosition="leading"
          disabled={phone.length !== 10}
          onClick={() => onSubmit?.({ area: selectedArea, phone, trigger })}
        >
          {copy.copy.cta}
        </Button>
        {/* Always present, always full size. */}
        <Button variant="ghost" size="md" onClick={onNotNow}>
          Not now
        </Button>
      </div>

      <p className="micro mt-4 text-ink-500">{copy.copy.footnote}</p>
    </div>
  );
}

const TRIGGER_LABELS: Record<string, string> = {
  leaves_the_kitchen: "It leaves the kitchen",
  two_stops_away: "It's two stops away",
  arrives: "It arrives",
};
