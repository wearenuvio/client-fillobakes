"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

/**
 * The WhatsApp nudge — PAGES-v2 "The Van".
 *
 * One message, on the day, when the van is two stops out. The limit is stated
 * before the field rather than after the sign-up, because the reason people
 * refuse an alert is the fear of a stream of them.
 *
 * The confirmation replaces the form in place and repeats the number back, so
 * a wrong digit is caught here rather than on a Saturday afternoon.
 */
export function NotifyWhatsApp({
  heading = "One message, when we are two stops away.",
  body = "On WhatsApp, on the day, and never more than one a day.",
  cta = "Notify me",
  /** Closes the confirmation: "on Saturday", "the week we reach Whitefield". */
  confirmSuffix,
  surface = "peach",
  className,
}: {
  heading?: string;
  body?: string;
  cta?: string;
  confirmSuffix: string;
  surface?: "peach" | "card";
  className?: string;
}) {
  const [phone, setPhone] = React.useState("");
  const [sent, setSent] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    // A live button that explains itself beats a dead grey one: the primary
    // action on the section should never look switched off.
    if (phone.length !== 10) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    setError(false);
    setSaving(true);
    timer.current = window.setTimeout(() => {
      setSaving(false);
      setSent(phone);
    }, 700);
  }

  return (
    <div
      className={cn(
        "rounded-xl p-6 sm:p-9",
        surface === "peach" ? "bg-peach" : "border border-line bg-card",
        className,
      )}
    >
      <div className="max-w-[46ch]">
        <h2 className="font-display text-[clamp(24px,3.2vw,32px)] leading-[1.1] text-ink">
          {heading}
        </h2>
        <p className="mt-3 text-body text-ink-2">{body}</p>
      </div>

      {sent ? (
        <p className="mt-6 flex items-start gap-2.5 text-body text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent"
          />
          <span>
            Done. We will message{" "}
            <span className="tabular">+91 {formatPhone(sent)}</span>{" "}
            {confirmSuffix}.{" "}
            <button
              type="button"
              onClick={() => {
                setSent(null);
                setPhone("");
              }}
              className="link-underline font-semibold text-accent"
            >
              Change the number
            </button>
          </span>
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="mt-6 flex max-w-[440px] flex-col gap-3 sm:flex-row"
        >
          <div
            className={cn(
              // `flex-1` on the column axis would zero the height out — the field
              // only grows along the row, once the form turns into one.
              "flex h-12 w-full min-w-0 items-stretch rounded-md border bg-card pl-3.5 sm:flex-1",
              error ? "border-accent" : "border-line focus-within:border-ink",
            )}
          >
            <label htmlFor="van-notify-phone" className="sr-only">
              Your mobile number
            </label>
            <span aria-hidden="true" className="flex shrink-0 items-center text-body-sm text-muted">
              +91
            </span>
            <input
              id="van-notify-phone"
              ref={inputRef}
              aria-invalid={error || undefined}
              aria-describedby={error ? "van-notify-error" : undefined}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                setError(false);
              }}
              placeholder="98765 43210"
              className="h-full w-full min-w-0 bg-transparent px-2.5 text-body-sm text-ink tabular placeholder:text-muted focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            loading={saving}
            className="h-12 shrink-0"
          >
            {cta}
          </Button>
        </form>
      )}

      {error && !sent ? (
        <p id="van-notify-error" role="alert" className="mt-3 text-body-sm text-accent">
          That needs to be a ten-digit mobile number.
        </p>
      ) : null}
    </div>
  );
}

/** "9876543210" → "98765 43210". Grouped the way an Indian number is read. */
function formatPhone(value: string): string {
  return value.length === 10 ? `${value.slice(0, 5)} ${value.slice(5)}` : value;
}
