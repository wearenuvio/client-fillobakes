"use client";

import * as React from "react";
import { AlertCircle, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CONTACT, whatsappHref } from "@/lib/config";
import { getAlertPreferences, getAllStops } from "@/lib/mock";
import { Panel, PanelHead, Notice } from "@/components/pages/account/Panel";
import { formatPhone } from "@/components/pages/account/session";
import {
  SwitchRow,
  PillChoice,
  SelectField,
} from "@/components/pages/content/Form";
import type { AlertsState } from "@/components/pages/account/states";

/**
 * Alerts — PAGES-v2 Account, "Alerts".
 *
 * The screen that stops people muting the brand. Order updates stay on and
 * say why rather than hiding the switch; the cap is on the page, not in a
 * policy; and the way out is a link at the bottom rather than a maze.
 */

const TRIGGERS = [
  { id: "leaves_the_kitchen", label: "Leaves the kitchen" },
  { id: "two_stops_away", label: "Two stops away" },
  { id: "arrives", label: "Arrives" },
] as const;

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
] as const;

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

  const [values, setValues] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(prefs.toggles.map((t) => [t.key, allPaused ? t.locked : t.value])),
  );
  const [channel, setChannel] = React.useState<string>(prefs.channel);
  const [stopId, setStopId] = React.useState(raw.vanAlerts.stopId);
  const [trigger, setTrigger] = React.useState<string>(raw.vanAlerts.trigger);
  const [paused, setPaused] = React.useState(allPaused);

  const vanAlertsOn = !paused && (values.van_near_me ?? false);

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {blocked ? (
        <Notice
          tone="attention"
          icon={<AlertCircle size={20} strokeWidth={1.5} />}
          actions={
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
          }
        >
          We cannot reach you. It looks like our number is blocked. Unblock{" "}
          <span className="tabular">{CONTACT.phone}</span>, or switch to email.
        </Notice>
      ) : null}

      {paused ? (
        <Notice
          actions={
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
          }
        >
          Everything but order updates is paused for {raw.pauseAll.durationWeeks}{" "}
          weeks.
        </Notice>
      ) : null}

      {/* ---- What we send ---------------------------------------------- */}
      <Panel>
        <PanelHead label="What we send" />
        <div className="mt-2 divide-y divide-line">
          {prefs.toggles.map((item) => (
            <SwitchRow
              key={item.key}
              id={`alert-${item.key}`}
              label={item.label}
              helper={item.helper}
              locked={item.locked}
              lockedCopy={item.lockedCopy}
              checked={item.locked ? true : paused ? false : (values[item.key] ?? false)}
              onCheckedChange={(next) => {
                setValues((current) => ({ ...current, [item.key]: next }));
                toast({ message: next ? `${item.label} is on.` : `${item.label} is off.` });
              }}
            />
          ))}
        </div>
        <p className="mt-4 border-t border-line pt-4 text-body-sm text-ink-2">
          {raw.cap}
        </p>
      </Panel>

      {/* ---- Van alerts, only while they are on ------------------------- */}
      {vanAlertsOn ? (
        <Panel>
          <PanelHead label="Van alerts" />
          <p className="mt-3 max-w-[46ch] text-body-sm text-muted">
            One nudge, one stop, one trigger. Proximity is a stop count, never a
            countdown.
          </p>
          <SelectField
            id="alert-stop"
            label="The stop"
            className="mt-5 max-w-[420px]"
            value={stopId}
            onChange={(e) => {
              setStopId(e.target.value);
              const next = stops.find((s) => s.id === e.target.value);
              toast({ message: `Van alerts set for ${next?.name ?? "your stop"}.` });
            }}
          >
            {stops.slice(0, 6).map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name} · {stop.runDaysLabel}
              </option>
            ))}
          </SelectField>
          <PillChoice
            className="mt-6"
            label="The trigger"
            value={trigger}
            options={TRIGGERS.map((t) => ({ id: t.id as string, label: t.label }))}
            onChange={(next) => {
              setTrigger(next);
              const label = TRIGGERS.find((t) => t.id === next)?.label ?? "";
              toast({ message: `We will ping you when it ${label.toLowerCase()}.` });
            }}
          />
        </Panel>
      ) : null}

      {/* ---- How we reach you ------------------------------------------- */}
      <Panel>
        <PanelHead label="How we reach you" />
        <p className="mt-3 text-body-sm text-muted">
          On <span className="text-ink tabular">{formatPhone(prefs.number)}</span>.
        </p>
        <PillChoice
          className="mt-5"
          label="Channel"
          value={channel}
          options={CHANNELS.map((c) => ({ id: c.id as string, label: c.label }))}
          onChange={(next) => {
            setChannel(next);
            const label = CHANNELS.find((c) => c.id === next)?.label ?? "";
            toast({ message: `We will use ${label} from now on.` });
          }}
        />
      </Panel>

      {/* ---- The way out ------------------------------------------------ */}
      <Panel>
        <PanelHead label="Too much?" />
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            disabled={paused}
            onClick={() => {
              setPaused(true);
              toast({ message: "Paused for two weeks. Order updates keep coming." });
            }}
            className="link-underline text-body-sm font-semibold text-accent disabled:text-muted"
          >
            {raw.pauseAll.label}
          </button>
          <button
            type="button"
            onClick={() => {
              setValues((current) =>
                Object.fromEntries(Object.keys(current).map((k) => [k, false])),
              );
              toast({ message: "Everything else is off. Order updates keep coming." });
            }}
            className="link-underline text-body-sm text-ink-2 hover:text-ink"
          >
            Turn everything off
          </button>
        </div>
        <p className="mt-4 max-w-[46ch] text-body-sm text-muted">
          You will still get order updates. We have to be able to tell you where
          your bread is.
        </p>
        <ButtonLink
          href={whatsappHref("Hi Fillo — about the messages you send me.")}
          variant="secondary"
          className="mt-6"
          icon={<MessageCircle size={16} strokeWidth={1.5} />}
          iconPosition="leading"
        >
          Talk to a person
        </ButtonLink>
      </Panel>
    </div>
  );
}
