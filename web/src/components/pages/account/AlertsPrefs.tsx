"use client";

import * as React from "react";
import { AlertCircle, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { CONTACT, whatsappHref } from "@/lib/config";
import { getAlertPreferences, getAllStops } from "@/lib/mock";
import { getProductBySlug } from "@/lib/catalog";
import { Panel, PanelHead } from "@/components/pages/account/Panel";
import { formatPhone } from "@/components/pages/account/session";
import type { AlertsState } from "@/components/pages/account/states";

/**
 * Alerts — site-content "Screen: Alerts".
 *
 * The screen that stops people muting the brand. Order updates are on and
 * locked, and the page says why rather than hiding the toggle. The cap is
 * stated on the page, not in a policy.
 */

type Prefs = Record<string, boolean>;

const CHANNELS: { id: string; label: string; note?: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "browser_push", label: "Browser push", note: "Not available in a Safari tab" },
  { id: "email", label: "Email" },
];

const TRIGGERS: { id: string; label: string }[] = [
  { id: "leaves_the_kitchen", label: "When it leaves the kitchen" },
  { id: "two_stops_away", label: "When it's 2 stops away" },
  { id: "arrives", label: "When it arrives" },
];

export function AlertsPrefs({ state = "default" }: { state?: AlertsState }) {
  const prefs = getAlertPreferences();
  const raw = prefs as unknown as {
    cap: string;
    vanAlerts: { stopId: string; stopLabel: string; trigger: string };
    pauseAll: { available: boolean; durationWeeks: number; label: string };
  };
  const stops = getAllStops();
  const { toast } = useToast();

  const allPaused = state === "all_paused";
  const blocked = state === "blocked";

  const [values, setValues] = React.useState<Prefs>(() =>
    Object.fromEntries(
      prefs.toggles.map((t) => [t.key, allPaused ? t.locked : t.value]),
    ),
  );
  const [channel, setChannel] = React.useState(prefs.channel);
  const [stopId, setStopId] = React.useState(raw.vanAlerts.stopId);
  const [trigger, setTrigger] = React.useState(raw.vanAlerts.trigger);
  const [paused, setPaused] = React.useState(allPaused);

  function toggle(key: string, label: string, next: boolean) {
    setValues((current) => ({ ...current, [key]: next }));
    toast({ message: next ? `${label} is on.` : `${label} is off.` });
  }

  return (
    <div className="flex flex-col gap-6">
      {blocked ? (
        <div className="rounded-md bg-warning-tint p-4 sm:p-6">
          <p className="flex items-start gap-2 text-body text-warning">
            <AlertCircle size={20} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
            We can&rsquo;t reach you — it looks like our number is blocked. Unblock{" "}
            <span className="tabular">{CONTACT.phone}</span>, or switch to SMS.
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setChannel("email");
                toast({ message: "Switched to email for now." });
              }}
            >
              Switch to email
            </Button>
          </div>
        </div>
      ) : null}

      {paused ? (
        <div className="rounded-md bg-paper-200 p-4 sm:p-6">
          <p className="text-body text-ink-800">
            Everything but order updates is paused for {raw.pauseAll.durationWeeks} weeks.
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setPaused(false);
                toast({ message: "Alerts are back on." });
              }}
            >
              Turn them back on
            </Button>
          </div>
        </div>
      ) : null}

      <Panel>
        <PanelHead label="What we send" />
        <ul className="mt-2 divide-y divide-paper-300">
          {prefs.toggles.map((item) => (
            <li key={item.key}>
              <Switch
                id={`alert-${item.key}`}
                label={item.label}
                helper={item.helper}
                locked={item.locked}
                lockedCopy={item.lockedCopy}
                checked={item.locked ? true : paused ? false : (values[item.key] ?? false)}
                onCheckedChange={(next) => toggle(item.key, item.label, next)}
              />
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-paper-300 pt-4 text-body-sm text-ink-800">
          {raw.cap}
        </p>
      </Panel>

      {/* Van alerts: per stop, per trigger. */}
      <Panel>
        <PanelHead label="Van alerts" />
        <p className="mt-3 text-body-sm text-ink-600">
          One nudge, for one stop, on one trigger. Proximity is a stop count, never a
          countdown.
        </p>

        <p className="micro mt-6 text-ink-500">The stop</p>
        <ul className="mt-3 flex flex-col gap-2">
          {stops.slice(0, 4).map((stop) => (
            <li key={stop.id}>
              <button
                type="button"
                onClick={() => {
                  setStopId(stop.id);
                  toast({ message: `Van alerts set for ${stop.name}.` });
                }}
                className={cn(
                  "flex min-h-11 w-full items-start justify-between gap-3 rounded-md border p-3 text-left",
                  "transition-colors duration-[var(--dur-fast)]",
                  stop.id === stopId
                    ? "border-ink-800 bg-paper-100"
                    : "border-paper-400 bg-paper-0 hover:border-ink-600",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-body-sm text-ink-800">{stop.name}</span>
                  <span className="mt-0.5 block text-caption text-ink-500">
                    {stop.descriptor} · {stop.runDaysLabel}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="micro mt-6 text-ink-500">The trigger</p>
        <div role="radiogroup" aria-label="Van alert trigger" className="mt-3 flex flex-wrap gap-2">
          {TRIGGERS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={option.id === trigger}
              onClick={() => {
                setTrigger(option.id);
                toast({ message: `We'll ping you ${option.label.toLowerCase()}.` });
              }}
              className={cn(
                "h-11 rounded-sm border px-4 text-body-sm transition-colors",
                "duration-[var(--dur-fast)]",
                option.id === trigger
                  ? "border-ink-800 bg-ink-800 text-paper-0"
                  : "border-paper-400 bg-paper-0 text-ink-800 hover:border-ink-600",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* Channel */}
      <Panel>
        <PanelHead label="How we reach you" />
        <p className="mt-3 text-body-sm text-ink-600 tabular">
          On <span className="text-ink-800">{formatPhone(prefs.number)}</span>.
        </p>
        <div role="radiogroup" aria-label="Channel" className="mt-4 flex flex-wrap gap-2">
          {CHANNELS.map((option) => (
            <span key={option.id} className="flex flex-col">
              <button
                type="button"
                role="radio"
                aria-checked={option.id === channel}
                onClick={() => {
                  setChannel(option.id);
                  toast({ message: `We'll use ${option.label} from now on.` });
                }}
                className={cn(
                  "h-11 rounded-sm border px-4 text-body-sm transition-colors",
                  "duration-[var(--dur-fast)]",
                  option.id === channel
                    ? "border-ink-800 bg-ink-800 text-paper-0"
                    : "border-paper-400 bg-paper-0 text-ink-800 hover:border-ink-600",
                )}
              >
                {option.label}
              </button>
              {option.note ? (
                <span className="nano mt-1 text-ink-500">{option.note}</span>
              ) : null}
            </span>
          ))}
        </div>
      </Panel>

      {/* Watched items */}
      {prefs.watchedForRestock.length ? (
        <Panel>
          <PanelHead label="Waiting on" />
          <ul className="mt-3 flex flex-col gap-2">
            {prefs.watchedForRestock.map((slug) => {
              const product = getProductBySlug(slug);
              return (
                <li key={slug} className="flex items-center justify-between gap-4">
                  <span className="text-body-sm text-ink-800">
                    {product?.name ?? slug}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toast({ message: `We'll stop watching ${product?.name ?? slug}.` })
                    }
                    className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                  >
                    Stop watching
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-caption text-ink-500">
            One message when it&rsquo;s back. Nothing else.
          </p>
        </Panel>
      ) : null}

      {/* The two escapes */}
      <Panel>
        <PanelHead label="Too much?" />
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            disabled={paused}
            onClick={() => {
              setPaused(true);
              toast({ message: "Paused for two weeks. Order updates keep coming." });
            }}
            className="link-underline self-start text-body-sm text-ink-700 hover:text-ink-900 disabled:text-ink-400"
          >
            {raw.pauseAll.label}
          </button>
          <button
            type="button"
            onClick={() => {
              setValues((current) =>
                Object.fromEntries(Object.keys(current).map((k) => [k, false])),
              );
              toast({
                message: "Everything else is off. You'll still get order updates.",
              });
            }}
            className="link-underline self-start text-body-sm text-ink-700 hover:text-ink-900"
          >
            Turn everything off
          </button>
        </div>
        <p className="mt-4 text-caption text-ink-500">
          You&rsquo;ll still get order updates. We have to be able to tell you where your
          bread is.
        </p>
        <div className="mt-6">
          <ButtonLink
            href={whatsappHref("Hi Fillo — about the messages you send me.")}
            variant="ghost"
            size="sm"
            icon={<MessageCircle size={16} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            Talk to a person instead
          </ButtonLink>
        </div>
      </Panel>
    </div>
  );
}
