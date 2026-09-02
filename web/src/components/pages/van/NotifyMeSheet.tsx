"use client";

import * as React from "react";
import { Bell, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { getAllStops, getNotifyMeCopy } from "@/lib/mock";

/**
 * Notify-me sheet — site-content "Notify-me sheet", journey §6.4, DESIGN.md
 * §12.31.
 *
 * Three rules it exists to keep:
 *  1. **It never fires an OS permission prompt on tap.** `Or get a browser
 *     alert` records the preference; the browser is asked on the next run, by
 *     the server-side geofence, not by this button.
 *  2. **It is never a cold prompt on load.** Nothing here mounts itself — a
 *     page opens it, and only after a value moment.
 *  3. **`Not now` is a real, full-size ghost button** beside the primary.
 *
 * Everything is mocked locally: a short delay, then the confirmation replaces
 * the form in place. No network.
 */

export type NotifyState = "idle" | "submitting" | "success" | "already" | "error";

const TRIGGER_LABELS: Record<string, string> = {
  leaves_the_kitchen: "It leaves the kitchen",
  two_stops_away: "It's two stops away",
  arrives: "It arrives",
};

export function NotifyMeSheet({
  open,
  onClose,
  /** Pre-selects the stop the visitor arrived from. */
  stopId,
  /** "already subscribed" is a real state, not an error. */
  initialState = "idle",
}: {
  open: boolean;
  onClose: () => void;
  stopId?: string;
  initialState?: NotifyState;
}) {
  const copy = getNotifyMeCopy();
  const stops = getAllStops();
  const [state, setState] = React.useState<NotifyState>(initialState);
  const [stop, setStop] = React.useState(stopId ?? stops[0]?.id ?? "");
  const [phone, setPhone] = React.useState("");
  const [trigger, setTrigger] = React.useState(copy.default);
  const [browserAlerts, setBrowserAlerts] = React.useState(false);
  const fieldId = React.useId();
  const timer = React.useRef<number | undefined>(undefined);

  // iOS Safari cannot receive push from a tab, so the alternative is hidden
  // there rather than offered and then broken. Read after mount only.
  const [showBrowserAlert, setShowBrowserAlert] = React.useState(false);
  React.useEffect(() => {
    const ua = window.navigator.userAgent;
    const iOS = /iP(hone|ad|od)/.test(ua) || (/Mac/.test(ua) && "ontouchend" in document);
    setShowBrowserAlert(!iOS);
  }, []);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  React.useEffect(() => {
    if (open) setState(initialState);
  }, [open, initialState]);

  const stopName = stops.find((s) => s.id === stop)?.name ?? "your stop";

  function submit(alsoBrowser: boolean) {
    setBrowserAlerts(alsoBrowser);
    setState("submitting");
    // Mocked: no network, no OS permission prompt, just a plausible delay.
    timer.current = window.setTimeout(() => setState("success"), 900);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      variant="sheet"
      title={state === "success" ? "You're on the list." : copy.copy.heading}
    >
      {state === "success" ? (
        <div>
          <p className="flex items-start gap-2 text-body text-ink-800">
            <Check
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
            {copy.copy.success}
          </p>
          <p className="mt-2 pl-7 text-body-sm text-ink-600">
            {stopName} · {TRIGGER_LABELS[trigger] ?? trigger}
            {browserAlerts ? " · WhatsApp and a browser alert" : " · WhatsApp"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" size="md" onClick={() => setState("idle")}>
              Change it
            </Button>
            <Button variant="ghost" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : state === "already" ? (
        <div>
          <p className="flex items-start gap-2 text-body text-ink-800">
            <Check
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
            You&rsquo;re set for {stopName}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" size="md" onClick={() => setState("idle")}>
              Change it
            </Button>
            <Button variant="ghost" size="md" onClick={onClose}>
              Not now
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="max-w-[62ch] text-body text-ink-600">
            One WhatsApp message when the van is close. At most one a day.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Pick a stop" htmlFor={`${fieldId}-stop`}>
              <Select
                id={`${fieldId}-stop`}
                value={stop}
                onChange={(e) => setStop(e.target.value)}
              >
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Mobile number"
              htmlFor={`${fieldId}-phone`}
              error={state === "error" ? copy.copy.error : undefined}
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
              onClick={() => submit(false)}
            >
              {copy.copy.cta}
            </Button>
            {showBrowserAlert ? (
              <Button
                variant="secondary"
                size="md"
                icon={<Bell size={20} strokeWidth={1.5} />}
                iconPosition="leading"
                disabled={state === "submitting" || phone.length !== 10}
                onClick={() => submit(true)}
              >
                {copy.copy.altCta}
              </Button>
            ) : null}
            {/* Always present, always full size (§12.31). */}
            <Button variant="ghost" size="md" onClick={onClose}>
              Not now
            </Button>
          </div>

          <p className="micro mt-4 text-ink-500">{copy.copy.footnote}</p>
        </div>
      )}
    </Dialog>
  );
}

/**
 * A button plus its sheet. The sheet only ever opens from a press — never on
 * load, never on a timer the visitor did not earn.
 */
export function NotifyMeButton({
  label,
  stopId,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className,
}: {
  label: string;
  stopId?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        icon={icon}
        iconPosition={icon ? "leading" : undefined}
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        {label}
      </Button>
      <NotifyMeSheet open={open} onClose={() => setOpen(false)} stopId={stopId} />
    </>
  );
}
