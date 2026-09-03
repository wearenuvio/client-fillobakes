"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  MessageCircle,
  PauseCircle,
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
import { getAddresses, getAllStops } from "@/lib/mock";
import { Panel, PanelHead, MetaRow, Notice } from "@/components/pages/account/Panel";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
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
  type StandingOrder,
  type UpcomingDelivery,
} from "@/components/pages/account/subscriptionData";
import type { SubscriptionPageState } from "@/components/pages/account/states";

/**
 * The Standing Order — PAGES-v2 Account, "Standing Order".
 *
 * Four controls and a link, in the order people reach for them: skip this
 * week, change what is in it, change the day and stop, pause. Cancel is a text
 * link that offers pause once before it does anything, because someone going
 * away for a fortnight does not want to lose their slot.
 *
 * Nothing here is styled destructive: skipping a week is a choice, not damage.
 * All of it runs on local state with a mock delay; nothing is sent anywhere.
 */

type Sheet = null | "skip" | "pause" | "contents" | "when" | "cancel";

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
    Object.fromEntries(base.plan.items.map((i) => [i.slug, i.qty ?? 1])),
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

  // The standing-order discount, kept as a ratio so changing the contents
  // recalculates the weekly price instead of quoting the old plan's number.
  const discount =
    base.plan.listPrice > 0 ? base.plan.weeklyPrice / base.plan.listPrice : 1;
  const listNow = linesTotal(lines) || base.plan.listPrice;
  const weeklyNow = Math.round(listNow * discount);
  const draftList = linesTotal(draftLines);
  const draftWeekly = Math.round(draftList * discount);

  const banner = dismissedBanner ? null : variant.banner;
  const bannerAttention = state === "payment_failed" || state === "route_retired";

  const addresses = getAddresses();
  const stops = getAllStops();
  const planLine = describeLines(lines) || base.plan.name;
  const planItems = Object.keys(lines).map((slug) => ({ slug, name: slug }));

  function withDelay(action: () => void) {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      action();
    }, 500);
  }

  if (state === "none") return <NoStandingOrder />;

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* ---- Banners: payment failed, paused, route changed, OOS -------- */}
      {banner ? (
        <Notice
          tone={bannerAttention ? "attention" : "info"}
          icon={<AlertCircle size={20} strokeWidth={1.5} />}
          actions={
            <>
              {state === "payment_failed" ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
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
                  <span className="text-body-sm text-muted">{variant.fallback}</span>
                </>
              ) : null}
              {state === "route_retired" ? (
                <ButtonLink href="/account/addresses" size="sm" variant="secondary">
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
                    variant="secondary"
                    onClick={() => {
                      setDismissedBanner(true);
                      toast({ message: "Swapped for Milk Shokupan this week only." });
                    }}
                  >
                    Swap for Milk Shokupan
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setSkipped((s) => [...s, nextDate]);
                      setDismissedBanner(true);
                      toast({
                        message: `${base.nextDelivery.dateLabel} skipped. You will not be charged.`,
                      });
                    }}
                    className="link-underline text-body-sm font-semibold text-accent"
                  >
                    Skip this week
                  </button>
                </>
              ) : null}
            </>
          }
        >
          {banner}
        </Notice>
      ) : null}

      {paused && !banner ? (
        <Notice icon={<PauseCircle size={20} strokeWidth={1.5} />}>
          {pausedUntil ?? "Paused"}. Nothing is charged while it is paused.
        </Notice>
      ) : null}

      {/* ---- The plan --------------------------------------------------- */}
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
              {cancelled ? "Cancelled" : paused ? "Paused" : variant.statusLabel}
            </Badge>
          }
        />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 className="min-w-0 font-display text-[26px] leading-tight text-ink">
            {planLine}
          </h2>
          <p className="flex shrink-0 items-baseline gap-1.5">
            <Price amount={weeklyNow} size="lg" muted={paused || cancelled} />
            <span className="text-body-sm text-muted">
              a {frequency === "weekly" ? "week" : "fortnight"}
            </span>
          </p>
        </div>
        <p className="mt-1 text-body-sm text-muted tabular">
          Standing-order price, {formatINR(listNow - weeklyNow)} off{" "}
          {formatINR(listNow)}.
        </p>

        <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
          <ItemThumbs items={planItems} size={44} max={3} className="shrink-0" />
          <p className="min-w-0 flex-1 text-body text-ink">
            Every {dayName(routeDay)} · {where}
          </p>
        </div>

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
              <MetaRow label="Window" value={base.windowLabel} />
              <MetaRow
                label="Changes close"
                value={base.cutoff.label.replace("Closes ", "")}
              />
              <MetaRow label="Paid with" value={base.payment.methodLabel} />
            </>
          )}
        </div>

        {/* ---- The controls -------------------------------------------- */}
        {cancelled ? (
          <div className="mt-6 border-t border-line pt-6">
            <p className="max-w-[46ch] text-body text-ink-2">
              {variant.copy ??
                `Your last delivery was ${base.nextDelivery.dateLabel}. Come back whenever.`}
            </p>
            <ButtonLink href="/account/subscription/setup" className="mt-6">
              Start another one
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
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
                Resume
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
            <Button
              variant="secondary"
              onClick={() => {
                setDraftLines(lines);
                setSheet("contents");
              }}
            >
              Change what is in it
            </Button>
            <Button
              variant="secondary"
              icon={<Calendar size={16} strokeWidth={1.5} />}
              iconPosition="leading"
              onClick={() => setSheet("when")}
            >
              Change day and stop
            </Button>
            {!paused ? (
              <Button
                variant="secondary"
                icon={<PauseCircle size={16} strokeWidth={1.5} />}
                iconPosition="leading"
                onClick={() => setSheet("pause")}
              >
                Pause
              </Button>
            ) : null}
          </div>
        )}
      </Panel>

      {/* ---- Upcoming ---------------------------------------------------- */}
      {!cancelled ? (
        <Panel>
          <PanelHead label="Upcoming" />
          <ul className="mt-4 divide-y divide-line border-t border-line">
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
                    message: `Skipping ${delivery.dateLabel}. You will not be charged.`,
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
              />
            ))}
          </ul>
          <p className="mt-4 text-body-sm text-muted">{base.actions.changeBoxCopy}.</p>
        </Panel>
      ) : null}

      {/* ---- History and cancel ------------------------------------------ */}
      {!cancelled ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-body-sm text-muted tabular">{base.history.label}</p>
          <button
            type="button"
            onClick={() => {
              setCancelStep(base.actions.cancelOffersPauseOnce ? "offer" : "confirm");
              setSheet("cancel");
            }}
            className="link-underline text-body-sm text-ink-2 hover:text-ink"
          >
            Cancel my standing order
          </button>
        </div>
      ) : null}

      {/* ================= Sheets ========================================= */}

      <Dialog
        open={sheet === "skip"}
        onClose={() => setSheet(null)}
        title={pastCutoff ? "This one is already baking" : `Skip ${base.nextDelivery.dateLabel}?`}
        description={
          pastCutoff
            ? base.actions.pastCutoffSkip
            : "You will not be charged, and it is back the week after."
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
                Message us
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
                      message: `Skipping ${base.nextDelivery.dateLabel}. You will not be charged.`,
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
            toast({ message: `${option.until}. We will message you the day before.` });
          })
        }
      />

      {/* Change what is in it — cutouts, steppers and a live weekly price. */}
      <Dialog
        open={sheet === "contents"}
        onClose={() => setSheet(null)}
        title="Change what is in it"
        description={`${base.actions.changeBoxCopy}.`}
        footer={
          <>
            <div className="mr-auto flex items-baseline gap-2">
              <Price amount={draftWeekly} size="md" />
              <span className="text-body-sm text-muted">
                a {frequency === "weekly" ? "week" : "fortnight"}
              </span>
            </div>
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
              Save
            </Button>
          </>
        }
      >
        <ItemPicker className="mt-6" lines={draftLines} onChange={setDraftLines} />
      </Dialog>

      {/* Change day and stop — one sheet, because they are one decision. */}
      <Dialog
        open={sheet === "when"}
        onClose={() => setSheet(null)}
        title="Change day and stop"
        description={`${base.actions.changeBoxCopy}. Only the days the van reaches ${where} can be picked.`}
      >
        <div className="mt-6 flex flex-col gap-8">
          <div>
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Day
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WEEKDAYS.map((day) => {
                const available = base.actions.availableRouteDays.includes(day);
                const active = day === routeDay;
                return (
                  <li key={day}>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => setRouteDay(day)}
                      className={cn(
                        "h-11 w-full rounded-md border px-2 text-body-sm",
                        "transition-colors duration-[var(--dur-fast)]",
                        active
                          ? "border-accent bg-accent font-semibold text-on-accent"
                          : available
                            ? "border-line bg-card text-ink hover:border-ink"
                            : "cursor-not-allowed border-line bg-paper-2 text-muted",
                      )}
                    >
                      {dayName(day).slice(0, 3)}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-body-sm text-muted">
              The van reaches {where} on {base.actions.availableRouteDays.map(dayName).join(", ")}.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              How often
            </p>
            <div className="mt-3 flex gap-2">
              {base.frequencyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFrequency(option)}
                  className={cn(
                    "h-11 rounded-md border px-4 text-body-sm",
                    "transition-colors duration-[var(--dur-fast)]",
                    option === frequency
                      ? "border-accent bg-accent font-semibold text-on-accent"
                      : "border-line bg-card text-ink hover:border-ink",
                  )}
                >
                  {option === "weekly" ? "Every week" : "Every other week"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Where
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {stops.slice(0, 4).map((stop) => (
                <li key={stop.id}>
                  <WhereOption
                    active={where === stop.name}
                    title={stop.name}
                    detail={`${stop.descriptor} · ${stop.runDaysLabel}`}
                    onSelect={() => setWhere(stop.name)}
                  />
                </li>
              ))}
              {addresses.map((address) => (
                <li key={address.id}>
                  <WhereOption
                    active={where === address.label}
                    title={`${address.label} · ${address.area}`}
                    detail={`${address.blockAndFlat}, ${address.society}`}
                    onSelect={() => setWhere(address.label)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <Button
            fullWidth
            loading={busy}
            onClick={() =>
              withDelay(() => {
                setSheet(null);
                toast({
                  message: `Every ${dayName(routeDay)} at ${where}. ${base.actions.changeBoxCopy}.`,
                });
              })
            }
          >
            Save
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={sheet === "cancel"}
        onClose={() => setSheet(null)}
        title={cancelStep === "offer" ? "Going away, or done?" : "Cancel your standing order?"}
        description={
          cancelStep === "offer"
            ? "If it is a break, pause it instead and nothing gets charged while you are away."
            : base.actions.cancelCopy
        }
        footer={
          cancelStep === "offer" ? (
            <>
              <Button variant="ghost" onClick={() => setCancelStep("confirm")}>
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
                      message: `Cancelled. Your last delivery is ${base.nextDelivery.dateLabel}.`,
                    });
                  })
                }
              >
                Cancel it
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
}: {
  delivery: UpcomingDelivery;
  skipped: boolean;
  paused: boolean;
  pastCutoff: boolean;
  pastCutoffCopy: string;
  onSkip: () => void;
  onUnskip: () => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <span className="w-24 shrink-0 text-body-sm text-ink tabular">
        {delivery.dateLabel}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 text-body-sm",
          skipped ? "text-muted" : "text-ink-2",
        )}
      >
        {skipped
          ? "Skipped, you will not be charged"
          : (delivery.items?.join(", ") ?? "—")}
      </span>
      {delivery.price !== undefined && !skipped ? (
        <Price amount={delivery.price} size="sm" className="shrink-0" muted={paused} />
      ) : null}
      <span className="shrink-0">
        {skipped ? (
          <button
            type="button"
            onClick={onUnskip}
            className="link-underline text-body-sm font-semibold text-accent"
          >
            Un-skip
          </button>
        ) : pastCutoff ? (
          <span className="text-body-sm text-muted">{pastCutoffCopy}</span>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            disabled={paused}
            className="link-underline text-body-sm font-semibold text-accent disabled:text-muted"
          >
            Skip
          </button>
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
      description="Pick when you want it back. Nothing is charged while it is paused."
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
      <div role="radiogroup" aria-label="How long" className="mt-6 flex flex-wrap gap-2">
        {PAUSE_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === picked}
            onClick={() => setPicked(item.id)}
            className={cn(
              "h-11 rounded-md border px-4 text-body-sm transition-colors",
              "duration-[var(--dur-fast)]",
              item.id === picked
                ? "border-accent bg-accent font-semibold text-on-accent"
                : "border-line bg-card text-ink hover:border-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-body-sm text-muted">{option.until}.</p>
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
      aria-pressed={active}
      className={cn(
        "flex w-full items-start justify-between gap-3 rounded-md border p-4 text-left",
        "transition-colors duration-[var(--dur-fast)]",
        active ? "border-ink bg-paper-2" : "border-line bg-card hover:border-ink",
      )}
    >
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-body-sm text-muted">{detail}</span>
      </span>
      {active ? (
        <Check size={20} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
      ) : null}
    </button>
  );
}

function NoStandingOrder() {
  return (
    <Panel tone="peach">
      <PanelHead label="The Standing Order" />
      <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(26px,3vw,34px)] leading-[1.05] text-ink">
        Your bread, every week.
      </h2>
      <p className="mt-4 max-w-[44ch] text-body text-ink-2">
        Pick a plan, pick a day. Skip any week, pause any time.
      </p>
      <ButtonLink href="/account/subscription/setup" className="mt-7">
        Set it up
      </ButtonLink>
    </Panel>
  );
}
