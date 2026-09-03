"use client";

import * as React from "react";
import { Check, MapPin } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OtpField } from "@/components/ui/OtpField";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { getAddresses, getAllStops } from "@/lib/mock";
import { Panel, PanelHead, MetaRow } from "@/components/pages/account/Panel";
import {
  ItemPicker,
  describeLines,
  lineCount,
  linesTotal,
  type PickerLines,
} from "@/components/pages/account/ItemPicker";
import {
  dayName,
  standingOrder,
  WEEKDAYS,
} from "@/components/pages/account/subscriptionData";
import {
  useAccountSession,
  useAccountSessionStore,
} from "@/components/pages/account/session";

/**
 * The standing-order builder — site-content "Screen: Standing order builder".
 *
 * Four steps on ONE screen, not a wizard: what, where and when, how often,
 * confirm. The run day is derived from the saved area, so step two confirms
 * rather than asks. Signed out, the phone step happens INSIDE the builder at
 * the confirm step, never as a wall in front of it.
 */

const SAVING_PER_ITEM = 20;

export function SubscriptionBuilder() {
  const base = standingOrder("active");
  const stops = getAllStops();
  const addresses = getAddresses();
  const { toast } = useToast();
  const { hydrated, signedIn } = useAccountSession();
  const signIn = useAccountSessionStore((s) => s.signIn);

  const [lines, setLines] = React.useState<PickerLines>({ "milk-shokupan": 1 });
  const [routeDay, setRouteDay] = React.useState(base.routeDay);
  const [where, setWhere] = React.useState(base.stopLabel);
  const [frequency, setFrequency] = React.useState<"weekly" | "fortnightly">("weekly");
  const [phone, setPhone] = React.useState("");
  const [otpStep, setOtpStep] = React.useState<"number" | "code">("number");
  const [sending, setSending] = React.useState(false);
  const [otpStatus, setOtpStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const count = lineCount(lines);
  const listTotal = linesTotal(lines);
  const saving = count * SAVING_PER_ITEM;
  const weeklyTotal = Math.max(0, listTotal - saving);
  const needsSignIn = hydrated && !signedIn;

  if (done) {
    return (
      <Panel>
        <p className="flex items-start gap-3 font-display text-[28px] leading-tight text-ink">
          <Check
            size={24}
            strokeWidth={1.5}
            className="mt-1.5 shrink-0 text-success"
            aria-hidden="true"
          />
          You are on the {dayName(routeDay)} list for {where}.
        </p>
        <p className="mt-3 max-w-[46ch] text-body text-ink-2 tabular">
          First delivery {base.nextDelivery.dateLabel}. We message you Wednesday
          with what is coming.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/account/subscription">Manage it</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">
            See this week&rsquo;s bake
          </ButtonLink>
        </div>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1 — What */}
      <Panel>
        <PanelHead
          label="1 · What"
          trailing={
            count ? (
              <span className="text-body-sm text-muted tabular">
                {count} in the plan
              </span>
            ) : null
          }
        />
        <h2 className="mt-3 font-display text-[24px] leading-snug text-ink">
          Pick the loaves and buns you want every {dayName(routeDay)}.
        </h2>
        <ItemPicker
          className="mt-6"
          lines={lines}
          onChange={setLines}
          categories={["breads", "anpan", "karepan"]}
        />
      </Panel>

      {/* 2 — Where and when */}
      <Panel>
        <PanelHead label="2 · Where and when" />
        <h2 className="mt-3 font-display text-[24px] leading-snug text-ink">
          {where}, {dayName(routeDay)}s, {base.windowLabel}.
        </h2>
        <p className="mt-2 text-body-sm text-ink-2">
          Taken from the area you&rsquo;ve already set. Change it here if you want it
          somewhere else.
        </p>

        <p className="mt-6 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">Run day</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => {
            const available = base.actions.availableRouteDays.includes(day);
            const active = day === routeDay;
            return (
              <li key={day}>
                <button
                  type="button"
                  disabled={!available}
                  aria-disabled={!available}
                  onClick={() => setRouteDay(day)}
                  className={cn(
                    "h-11 rounded-md border px-4 text-body-sm transition-colors",
                    "duration-[var(--dur-fast)]",
                    active
                      ? "border-accent bg-accent font-semibold text-on-accent"
                      : available
                        ? "border-line bg-card text-ink hover:border-ink"
                        : "cursor-not-allowed border-line bg-paper-2 text-muted",
                  )}
                  title={available ? undefined : "Not on this route"}
                >
                  {dayName(day)}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-body-sm text-muted">
          Greyed days are not on this route
        </p>

        <p className="mt-6 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">Stop or address</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ...stops.slice(0, 4).map((s) => ({
              key: s.id,
              title: s.name,
              detail: `${s.descriptor} · ${s.runDaysLabel}`,
            })),
            ...addresses.map((a) => ({
              key: a.id,
              title: `${a.label} · ${a.area}`,
              detail: `${a.blockAndFlat}, ${a.society}`,
            })),
          ].map((option) => {
            const active = where === option.title;
            return (
              <li key={option.key}>
                <button
                  type="button"
                  onClick={() => setWhere(option.title)}
                  className={cn(
                    "flex h-full w-full items-start justify-between gap-3 rounded-md border p-4 text-left",
                    "transition-colors duration-[var(--dur-fast)]",
                    active
                      ? "border-ink bg-paper-2"
                      : "border-line bg-card hover:border-ink",
                  )}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-body-sm font-semibold text-ink">
                      <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
                      {option.title}
                    </span>
                    <span className="mt-1 block text-body-sm text-muted">
                      {option.detail}
                    </span>
                  </span>
                  {active ? (
                    <Check size={20} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      {/* 3 — How often */}
      <Panel>
        <PanelHead label="3 · How often" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["weekly", "fortnightly"] as const).map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setFrequency(option)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between rounded-md border px-4 py-3",
                  "text-body text-ink transition-colors duration-[var(--dur-fast)]",
                  option === frequency
                    ? "border-ink bg-paper-2"
                    : "border-line bg-card hover:border-ink",
                )}
              >
                {option === "weekly" ? "Every week" : "Every other week"}
                {option === frequency ? (
                  <Check size={20} strokeWidth={1.5} aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      {/* 4 — Confirm */}
      <Panel>
        <PanelHead label="4 · Confirm" />
        <h2 className="mt-3 font-display text-[26px] leading-tight text-ink">
          {describeLines(lines) || "Nothing picked yet"}
        </h2>
        <p className="mt-1 text-body-sm text-ink-2">
          {dayName(routeDay)}s · {where} · {base.windowLabel} ·{" "}
          {frequency === "weekly" ? "every week" : "every other week"}
        </p>

        <div className="mt-6">
          <MetaRow label="Normal price" value={formatINR(listTotal)} />
          <MetaRow label="Standing-order saving" value={`−${formatINR(saving)}`} />
          <MetaRow label="First delivery" value={base.nextDelivery.dateLabel} />
          <MetaRow label="Orders close" value={base.cutoff.label.replace("Closes ", "")} />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4">
          <span className="font-display text-[22px] text-ink">
            Every {frequency === "weekly" ? "week" : "fortnight"}
          </span>
          <Price amount={weeklyTotal} size="lg" />
        </div>

        {needsSignIn ? (
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">Your number</p>
            <p className="mt-2 text-body-sm text-ink-2">
              Your number is your account. No password to forget.
            </p>
            {otpStep === "number" ? (
              <OtpField
                className="mt-4"
                step="number"
                phone={phone}
                onPhoneChange={setPhone}
                sending={sending}
                onSendCode={() => {
                  setSending(true);
                  window.setTimeout(() => {
                    setSending(false);
                    setOtpStep("code");
                    toast({ message: "Sent. Check your messages." });
                  }, 700);
                }}
              />
            ) : (
              <OtpField
                className="mt-4"
                step="code"
                phone={phone}
                status={otpStatus}
                error={otpError}
                onChangeNumber={() => setOtpStep("number")}
                onComplete={(code) => {
                  setOtpStatus("verifying");
                  window.setTimeout(() => {
                    if (code === "000000") {
                      setOtpStatus("error");
                      setOtpError("That code didn't match. Try again, or we'll send a new one.");
                      return;
                    }
                    setOtpStatus("success");
                    setOtpError(null);
                    signIn(phone);
                    toast({ message: "Signed in. Now finish your standing order." });
                  }, 900);
                }}
              />
            )}
          </div>
        ) : null}

        {/* The reassurance line sits ABOVE the confirm button, not below it. */}
        <p className="mt-6 text-body text-ink">
          Skip any week. Pause any time. Cancel in one tap.
        </p>
        <Button
          className="mt-4"
          size="lg"
          loading={busy}
          disabled={count === 0 || needsSignIn}
          onClick={() => {
            setBusy(true);
            window.setTimeout(() => {
              setBusy(false);
              setDone(true);
              toast({
                message: `You're on the ${dayName(routeDay)} list for ${where}. First delivery ${base.nextDelivery.dateLabel}.`,
              });
            }, 800);
          }}
        >
          Start my standing order
        </Button>
        {count === 0 ? (
          <p className="mt-3 text-body-sm text-muted">
            Pick at least one thing above and this button wakes up.
          </p>
        ) : null}
      </Panel>
    </div>
  );
}
