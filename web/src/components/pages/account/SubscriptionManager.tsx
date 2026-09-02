"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  MapPin,
  MessageCircle,
  Pause,
  Repeat,
  SkipForward,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { whatsappHref } from "@/lib/config";
import { getAddresses, getAllStops, isTbc } from "@/lib/mock";
import { Panel, PanelHead, MetaRow } from "@/components/pages/account/Panel";
import {
  ItemPicker,
  describeLines,
  lineCount,
  type PickerLines,
} from "@/components/pages/account/ItemPicker";
import {
  dayName,
  standingOrder,
  WEEKDAYS,
  type StandingOrder,
  type UpcomingDelivery,
} from "@/components/pages/account/subscriptionData";
import type { SubscriptionPageState } from "@/components/pages/account/states";

/**
 * The Standing Order — site-content "Screen: The Standing Order".
 *
 * Every escape is on this screen and none is behind a retention flow: skip,
 * pause, change the contents, move the day, change the stop, cancel. None of
 * them is styled destructive-red — skipping a week is not a destructive act
 * (DESIGN.md §12.18) — and cancel offers pause exactly once.
 *
 * All of it runs on local state with a mock delay. Nothing is sent anywhere.
 */

type Sheet =
  | null
  | "skip"
  | "pause"
  | "contents"
  | "day"
  | "frequency"
  | "where"
  | "cancel";

const PAUSE_OPTIONS = [
  { id: "2w", label: "2 weeks", until: "Paused till 17 October" },
  { id: "1m", label: "1 month", until: "Paused till 3 November" },
  { id: "open", label: "Until I say", until: "Paused until you say otherwise" },
];

export function SubscriptionManager({
  state = "active",
}: {
  state?: SubscriptionPageState;
}) {
  const base = standingOrder("active");
  const variant = React.useMemo<StandingOrder>(() => {
    if (
      state === "paused" ||
      state === "payment_failed" ||
      state === "route_changed" ||
      state === "route_retired" ||
      state === "out_of_stock" ||
      state === "cancelled"
    ) {
      return standingOrder(state);
    }
    return base;
  }, [state, base]);

  const { toast } = useToast();

  const [sheet, setSheet] = React.useState<Sheet>(null);
  const [status, setStatus] = React.useState(variant.status);
  const [pausedUntil, setPausedUntil] = React.useState<string | null>(
    state === "paused" || state === "route_retired"
      ? (variant.resumeLabel ?? "Paused")
      : null,
  );
  const [skipped, setSkipped] = React.useState<string[]>(
    base.upcoming.filter((u) => u.status === "skipped").map((u) => u.date),
  );
  const [frequency, setFrequency] = React.useState(base.frequency);
  const [routeDay, setRouteDay] = React.useState(base.routeDay);
  const [where, setWhere] = React.useState(base.stopLabel);
  const [lines, setLines] = React.useState<PickerLines>(() =>
    Object.fromEntries(base.plan.items.map((i) => [i.slug, i.qty])),
  );
  const [draftLines, setDraftLines] = React.useState<PickerLines>(lines);
  const [cancelStep, setCancelStep] = React.useState<"offer" | "confirm">("offer");
  const [dismissedBanner, setDismissedBanner] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const pastCutoff = state === "past_cutoff";
  const cancelled = status === "cancelled";
  const paused = status === "paused";
  const nextDate = base.nextDelivery.date;
  const nextSkipped = skipped.includes(nextDate);

  const banner = dismissedBanner ? null : variant.banner;
  const bannerTone =
    state === "payment_failed" || state === "route_retired" ? "warning" : "info";

  const addresses = getAddresses();
  const stops = getAllStops();

  function withDelay(action: () => void) {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      action();
    }, 500);
  }

  if (state === "none") {
    return <NoStandingOrder />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* --- Banner states: payment failed, route changed, retired, OOS --- */}
      {banner ? (
        <div
          className={cn(
            "rounded-md p-4 sm:p-6",
            bannerTone === "warning" ? "bg-warning-tint" : "bg-info-tint",
          )}
        >
          <p
            className={cn(
              "flex items-start gap-2 text-body",
              bannerTone === "warning" ? "text-warning" : "text-info",
            )}
          >
            <AlertCircle size={20} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
            {banner}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {state === "payment_failed" ? (
              <>
                <Button
                  size="sm"
                  loading={busy}
                  onClick={() =>
                    withDelay(() => {
                      setDismissedBanner(true);
                      toast({ message: "Payment taken. Saturday is back on." });
                    })
                  }
                >
                  {variant.cta ?? "Retry payment"}
                </Button>
                <p className="text-caption text-ink-600">{variant.fallback}</p>
              </>
            ) : null}
            {state === "route_retired" ? (
              <ButtonLink href="/account/addresses" size="sm">
                Change address
              </ButtonLink>
            ) : null}
            {state === "route_changed" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setDismissedBanner(true);
                  toast({ message: "Noted. Your standing order moves with the stop." });
                }}
              >
                Got it
              </Button>
            ) : null}
            {state === "out_of_stock" ? (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    setDismissedBanner(true);
                    toast({ message: "Swapped for Milk Shokupan this week only." });
                  }}
                >
                  Swap for Milk Shokupan
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSkipped((s) => [...s, nextDate]);
                    setDismissedBanner(true);
                    toast({ message: `${base.nextDelivery.dateLabel} skipped. You won't be charged.` });
                  }}
                >
                  Skip this week
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ---------------- The plan card ----------------------------------- */}
      <Panel tone={paused || cancelled ? "muted" : "default"}>
        <PanelHead
          label="Your standing order"
          trailing={
            <Badge
              variant={
                cancelled || paused
                  ? "muted"
                  : status === "payment_failed"
                    ? "warning"
                    : "success"
              }
            >
              {cancelled
                ? "Cancelled"
                : paused
                  ? (pausedUntil ?? "Paused")
                  : variant.statusLabel}
            </Badge>
          }
        />

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-display-sm text-ink-800">{describeLines(lines) || base.plan.name}</h2>
          <p className="flex items-baseline gap-2">
            <Price amount={base.plan.weeklyPrice} size="lg" />
            <span className="text-body-sm text-ink-500">
              / {frequency === "weekly" ? "week" : "fortnight"}
            </span>
          </p>
        </div>
        <p className="mt-1 text-body-sm text-ink-600 tabular">
          Standing-order price, {formatINR(base.plan.savingPerWeek)} off{" "}
          {formatINR(base.plan.listPrice)}.
          {isTbc(base.plan.priceConfidence) ? " Price is an estimate until the founders set it." : ""}
        </p>

        <p className="mt-5 text-body text-ink-800">
          Every {dayName(routeDay)} · {where} · {base.windowLabel}
        </p>
        {paused ? (
          <p className="mt-2 text-body-sm text-ink-600">
            {variant.copy ?? "Paused. Nothing is charged while it's paused."}
          </p>
        ) : null}

        <div className="mt-4">
          <MetaRow
            label={cancelled ? "Last delivery" : "Next delivery"}
            value={
              cancelled
                ? base.nextDelivery.dateLabel
                : paused
                  ? (pausedUntil ?? "Paused")
                  : nextSkipped
                    ? `${base.nextDelivery.dateLabel} · skipped`
                    : base.nextDelivery.dateLabel
            }
          />
          {cancelled ? null : (
            <>
              <MetaRow label="Closes" value={base.cutoff.label.replace("Closes ", "")} />
              <MetaRow label="Paid with" value={base.payment.methodLabel} />
              <MetaRow
                label="How often"
                value={frequency === "weekly" ? "Every week" : "Every other week"}
              />
            </>
          )}
        </div>

        {!paused && !cancelled && base.cutoff.tbc ? (
          <p className="micro mt-4 text-warning">
            Changes for this {dayName(routeDay)} close {base.cutoff.label.replace("Closes ", "")}
          </p>
        ) : null}

        {/* ------------- The six controls, never hidden ------------------ */}
        {cancelled ? (
          <div className="mt-6 border-t border-paper-300 pt-6">
            <p className="text-body text-ink-600">
              {variant.copy ??
                `Cancelled. Your last delivery was ${base.nextDelivery.dateLabel}. Come back whenever.`}
            </p>
            <ButtonLink href="/account/subscription/setup" className="mt-4">
              Start another one
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 border-t border-paper-300 pt-6 sm:grid-cols-2">
            {paused ? (
              <Button
                loading={busy}
                onClick={() =>
                  withDelay(() => {
                    setStatus("active");
                    setPausedUntil(null);
                    toast({ message: "Resumed. Your next delivery is back on." });
                  })
                }
              >
                Resume now
              </Button>
            ) : (
              <Button
                variant="secondary"
                icon={<SkipForward size={16} strokeWidth={1.5} />}
                iconPosition="leading"
                onClick={() => setSheet("skip")}
                disabled={nextSkipped}
              >
                {nextSkipped ? "Skipped this week" : "Skip this week"}
              </Button>
            )}
            <Button variant="secondary" onClick={() => { setDraftLines(lines); setSheet("contents"); }}>
              Change what&rsquo;s in it
            </Button>
            {!paused ? (
              <Button
                variant="secondary"
                icon={<Pause size={16} strokeWidth={1.5} />}
                iconPosition="leading"
                onClick={() => setSheet("pause")}
              >
                Going away? Pause
              </Button>
            ) : null}
            <Button
              variant="secondary"
              icon={<Calendar size={16} strokeWidth={1.5} />}
              iconPosition="leading"
              onClick={() => setSheet("day")}
            >
              Move to another day
            </Button>
            <Button
              variant="secondary"
              icon={<Repeat size={16} strokeWidth={1.5} />}
              iconPosition="leading"
              onClick={() => setSheet("frequency")}
            >
              Change frequency
            </Button>
            <Button
              variant="secondary"
              icon={<MapPin size={16} strokeWidth={1.5} />}
              iconPosition="leading"
              onClick={() => setSheet("where")}
            >
              Change stop or address
            </Button>
          </div>
        )}
      </Panel>

      {/* ---------------- Upcoming ---------------------------------------- */}
      {!cancelled ? (
        <Panel>
          <PanelHead label="Upcoming" />
          <ul className="mt-4 divide-y divide-paper-300 border-y border-paper-300">
            {base.upcoming.map((delivery) => (
              <UpcomingRow
                key={delivery.date}
                delivery={delivery}
                skipped={skipped.includes(delivery.date)}
                paused={paused}
                pastCutoff={pastCutoff && delivery.date === nextDate}
                pastCutoffCopy={base.actions.pastCutoffSkip}
                onSkip={() => {
                  setSkipped((s) => [...s, delivery.date]);
                  toast({
                    message: `Skipping ${delivery.dateLabel}. You won't be charged. Back the week after.`,
                    action: {
                      label: "Undo",
                      onClick: () =>
                        setSkipped((s) => s.filter((d) => d !== delivery.date)),
                    },
                  });
                }}
                onUnskip={() => {
                  setSkipped((s) => s.filter((d) => d !== delivery.date));
                  toast({ message: `${delivery.dateLabel} is back on.` });
                }}
                onChange={() => {
                  setDraftLines(lines);
                  setSheet("contents");
                }}
              />
            ))}
          </ul>
          <p className="mt-4 text-caption text-ink-500">
            {base.actions.changeBoxCopy}
          </p>
        </Panel>
      ) : null}

      {/* ---------------- History ----------------------------------------- */}
      <Panel>
        <PanelHead label="History" />
        <p className="mt-3 text-body text-ink-800 tabular">{base.history.label}</p>
      </Panel>

      {/* ---------------- Cancel ------------------------------------------ */}
      {!cancelled ? (
        <div>
          <button
            type="button"
            onClick={() => {
              setCancelStep(base.actions.cancelOffersPauseOnce ? "offer" : "confirm");
              setSheet("cancel");
            }}
            className="link-underline text-body-sm text-ink-600 hover:text-ink-900"
          >
            Cancel my standing order
          </button>
        </div>
      ) : null}

      {/* ================= Sheets ========================================= */}

      <Dialog
        open={sheet === "skip"}
        onClose={() => setSheet(null)}
        title={pastCutoff ? "This one is already baking" : "Skip this week?"}
        description={
          pastCutoff
            ? base.actions.pastCutoffSkip
            : `Skipping ${base.nextDelivery.dateLabel}. You won't be charged. Back the week after.`
        }
        footer={
          pastCutoff ? (
            <>
              <Button variant="ghost" onClick={() => setSheet(null)}>
                Close
              </Button>
              <ButtonLink
                href={whatsappHref("Hi Fillo — about my standing order this week.")}
                variant="secondary"
                icon={<MessageCircle size={16} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                WhatsApp us
              </ButtonLink>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setSheet(null)}>
                Keep it
              </Button>
              <Button
                loading={busy}
                onClick={() =>
                  withDelay(() => {
                    setSkipped((s) => [...s, nextDate]);
                    setSheet(null);
                    toast({
                      message: `Skipping ${base.nextDelivery.dateLabel}. You won't be charged. Back the week after.`,
                      action: {
                        label: "Undo",
                        onClick: () => setSkipped((s) => s.filter((d) => d !== nextDate)),
                      },
                    });
                  })
                }
              >
                Skip this week
              </Button>
            </>
          )
        }
      />

      <PauseSheet
        open={sheet === "pause"}
        onClose={() => setSheet(null)}
        busy={busy}
        onPause={(option) =>
          withDelay(() => {
            setStatus("paused");
            setPausedUntil(option.until);
            setSheet(null);
            toast({ message: `${option.until}. We'll message you the day before.` });
          })
        }
      />

      <Dialog
        open={sheet === "contents"}
        onClose={() => setSheet(null)}
        title="Change what's in it"
        description={base.actions.changeBoxCopy}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheet(null)}>
              Leave it as it is
            </Button>
            <Button
              loading={busy}
              disabled={lineCount(draftLines) === 0}
              onClick={() =>
                withDelay(() => {
                  setLines(draftLines);
                  setSheet(null);
                  toast({ message: `Changed. ${base.actions.changeBoxCopy}.` });
                })
              }
            >
              Save — applies from Sat 10 Oct
            </Button>
          </>
        }
      >
        <ItemPicker className="mt-6" lines={draftLines} onChange={setDraftLines} />
      </Dialog>

      <Dialog
        open={sheet === "day"}
        onClose={() => setSheet(null)}
        title="Move to another day"
        description={`Only the days the van reaches ${where} can be picked. ${base.actions.changeBoxCopy}.`}
      >
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {WEEKDAYS.map((day) => {
            const available = base.actions.availableRouteDays.includes(day);
            const active = day === routeDay;
            return (
              <li key={day}>
                <button
                  type="button"
                  disabled={!available}
                  aria-disabled={!available}
                  onClick={() => {
                    setRouteDay(day);
                    setSheet(null);
                    toast({ message: `Moved to ${dayName(day)}. Applies from Saturday 10 October.` });
                  }}
                  className={cn(
                    "flex h-11 w-full flex-col items-center justify-center rounded-sm border px-2",
                    "text-body-sm transition-colors duration-[var(--dur-fast)]",
                    active
                      ? "border-ink-800 bg-ink-800 text-paper-0"
                      : available
                        ? "border-paper-400 bg-paper-0 text-ink-800 hover:border-ink-600"
                        : "cursor-not-allowed border-paper-300 bg-paper-100 text-ink-400",
                  )}
                >
                  {dayName(day)}
                </button>
                {!available ? (
                  <p className="nano mt-1 text-center text-ink-400">Not on this route</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Dialog>

      <Dialog
        open={sheet === "frequency"}
        onClose={() => setSheet(null)}
        title="How often?"
        description="Change it as often as you like. It applies from the next delivery that has not closed."
      >
        <ul className="mt-6 flex flex-col gap-3">
          {base.frequencyOptions.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  setFrequency(option);
                  setSheet(null);
                  toast({
                    message: `Now ${option === "weekly" ? "every week" : "every other week"}. Applies from Saturday 10 October.`,
                  });
                }}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between rounded-md border px-4 py-3",
                  "text-body text-ink-800 transition-colors duration-[var(--dur-fast)]",
                  option === frequency
                    ? "border-ink-800 bg-paper-100"
                    : "border-paper-400 bg-paper-0 hover:border-ink-600",
                )}
              >
                {option === "weekly" ? "Every week" : "Every other week"}
                {option === frequency ? (
                  <Check size={20} strokeWidth={1.5} className="text-ink-800" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </Dialog>

      <Dialog
        open={sheet === "where"}
        onClose={() => setSheet(null)}
        title="Where should it go?"
        description="This changes every delivery from now on. For one week only, use the change link on that row instead."
      >
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="micro text-ink-500">Van stops</p>
            <ul className="mt-3 flex flex-col gap-2">
              {stops.slice(0, 5).map((stop) => (
                <li key={stop.id}>
                  <WhereOption
                    active={where === stop.name}
                    title={stop.name}
                    detail={`${stop.descriptor} · ${stop.runDaysLabel}`}
                    onSelect={() => {
                      setWhere(stop.name);
                      setSheet(null);
                      toast({ message: `Moved to ${stop.name}. Applies from Saturday 10 October.` });
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="micro text-ink-500">Your addresses</p>
            <ul className="mt-3 flex flex-col gap-2">
              {addresses.map((address) => (
                <li key={address.id}>
                  <WhereOption
                    active={where === address.label}
                    title={`${address.label} · ${address.area}`}
                    detail={`${address.blockAndFlat}, ${address.society}`}
                    onSelect={() => {
                      setWhere(address.label);
                      setSheet(null);
                      toast({ message: `Moved to ${address.label}. Applies from Saturday 10 October.` });
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={sheet === "cancel"}
        onClose={() => setSheet(null)}
        title={cancelStep === "offer" ? "Going away, or done?" : "Cancel your standing order?"}
        description={
          cancelStep === "offer"
            ? "If it's a break, pause it instead and nothing gets charged while you're away."
            : base.actions.cancelCopy
        }
        footer={
          cancelStep === "offer" ? (
            <>
              <Button
                variant="ghost"
                onClick={() => setCancelStep("confirm")}
              >
                No, cancel it
              </Button>
              <Button
                onClick={() => {
                  setSheet("pause");
                  setCancelStep("offer");
                }}
              >
                Pause instead
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setSheet(null)}>
                Keep it
              </Button>
              <Button
                variant="destructive"
                loading={busy}
                onClick={() =>
                  withDelay(() => {
                    setStatus("cancelled");
                    setSheet(null);
                    toast({
                      message: `Cancelled. Your last delivery was ${base.nextDelivery.dateLabel}. Come back whenever.`,
                    });
                  })
                }
              >
                Cancel my standing order
              </Button>
            </>
          )
        }
      />
    </div>
  );
}

function UpcomingRow({
  delivery,
  skipped,
  paused,
  pastCutoff,
  pastCutoffCopy,
  onSkip,
  onUnskip,
  onChange,
}: {
  delivery: UpcomingDelivery;
  skipped: boolean;
  paused: boolean;
  pastCutoff: boolean;
  pastCutoffCopy: string;
  onSkip: () => void;
  onUnskip: () => void;
  onChange: () => void;
}) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-baseline gap-4">
        <span className="w-20 shrink-0 text-body-sm text-ink-800 tabular sm:w-24">
          {delivery.dateLabel}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 text-body-sm",
            skipped ? "text-ink-500" : "text-ink-800",
          )}
        >
          {skipped ? "Skipped — you won't be charged" : (delivery.items?.join(", ") ?? "—")}
        </span>
        {delivery.price !== undefined && !skipped ? (
          <Price amount={delivery.price} size="sm" className="shrink-0" muted={paused} />
        ) : null}
      </div>
      <span className="flex shrink-0 items-center gap-4 pl-20 sm:pl-0">
        {skipped ? (
          <button
            type="button"
            onClick={onUnskip}
            className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
          >
            Un-skip
          </button>
        ) : pastCutoff ? (
          <span className="text-caption text-ink-500">{pastCutoffCopy}</span>
        ) : (
          <>
            <button
              type="button"
              onClick={onSkip}
              disabled={paused}
              className="link-underline text-body-sm text-ink-700 hover:text-ink-900 disabled:text-ink-400"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={onChange}
              disabled={paused}
              className="link-underline text-body-sm text-ink-700 hover:text-ink-900 disabled:text-ink-400"
            >
              Change
            </button>
          </>
        )}
      </span>
    </li>
  );
}

function PauseSheet({
  open,
  onClose,
  busy,
  onPause,
}: {
  open: boolean;
  onClose: () => void;
  busy: boolean;
  onPause: (option: (typeof PAUSE_OPTIONS)[number]) => void;
}) {
  const [picked, setPicked] = React.useState(PAUSE_OPTIONS[0].id);
  const option = PAUSE_OPTIONS.find((o) => o.id === picked) ?? PAUSE_OPTIONS[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Going away?"
      description="Pick when you want it back. Nothing is charged while it's paused."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <Button loading={busy} onClick={() => onPause(option)}>
            Pause deliveries
          </Button>
        </>
      }
    >
      <div
        role="radiogroup"
        aria-label="How long"
        className="mt-6 flex flex-wrap gap-3"
      >
        {PAUSE_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === picked}
            onClick={() => setPicked(item.id)}
            className={cn(
              "h-11 rounded-sm border px-4 text-body-sm transition-colors",
              "duration-[var(--dur-fast)]",
              item.id === picked
                ? "border-ink-800 bg-ink-800 text-paper-0"
                : "border-paper-400 bg-paper-0 text-ink-800 hover:border-ink-600",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-caption text-ink-500">{option.until}.</p>
    </Dialog>
  );
}

function WhereOption({
  active,
  title,
  detail,
  onSelect,
}: {
  active: boolean;
  title: string;
  detail: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start justify-between gap-3 rounded-md border p-4 text-left",
        "transition-colors duration-[var(--dur-fast)]",
        active ? "border-ink-800 bg-paper-100" : "border-paper-400 bg-paper-0 hover:border-ink-600",
      )}
    >
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-ink-800">{title}</span>
        <span className="mt-0.5 block text-caption text-ink-500">{detail}</span>
      </span>
      {active ? (
        <Check size={20} strokeWidth={1.5} className="shrink-0 text-ink-800" aria-hidden="true" />
      ) : null}
    </button>
  );
}

function NoStandingOrder() {
  return (
    <Panel>
      <PanelHead label="The Standing Order" />
      <h2 className="mt-4 text-display-sm text-ink-800">
        You don&rsquo;t have one yet.
      </h2>
      <p className="mt-2 max-w-[46ch] text-body text-ink-600">
        Same loaf, same day, no thinking about it. Skip any week, pause anytime,
        cancel in one tap.
      </p>
      <div className="mt-6">
        <ButtonLink href="/account/subscription/setup">
          Set up a standing order
        </ButtonLink>
      </div>
    </Panel>
  );
}
