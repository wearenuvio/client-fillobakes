"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { OtpBoxes, type OtpStatus } from "@/components/ui/OtpField";

/**
 * Joining Fillo+ — PAGES-v2 "Fillo+".
 *
 * One field on the page and one sheet over it. Fillo+ is free and phone-based,
 * so nothing on this path may mention a fee, a checkout, a renewal or a
 * password: the number is the account.
 *
 * The number is collected in the hero rather than inside the sheet, so the
 * sheet opens already knowing who it is verifying and a visitor is never asked
 * the same thing twice. Success closes the sheet and replaces the field in
 * place — the page never navigates away from what the visitor was reading.
 *
 * Mocked end to end: any four digits verify, `0000` fails, so the error state
 * is reachable without a back end.
 */
export function FilloPlusJoin({ className }: { className?: string }) {
  const [phone, setPhone] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<OtpStatus>("idle");
  const [sending, setSending] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);
  const [joined, setJoined] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timers = React.useRef<number[]>([]);

  React.useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    [],
  );

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  function send() {
    setInvalid(false);
    setSending(true);
    setStatus("idle");
    timers.current.push(
      window.setTimeout(() => {
        setSending(false);
        setOpen(true);
        setResendIn(30);
      }, 600),
    );
  }

  function verify(code: string) {
    setStatus("verifying");
    timers.current.push(
      window.setTimeout(() => {
        if (code === "0000") {
          setStatus("error");
          return;
        }
        setStatus("success");
        timers.current.push(
          window.setTimeout(() => {
            setOpen(false);
            setJoined(phone);
          }, 450),
        );
      }, 800),
    );
  }

  if (joined) {
    return (
      <div className={className}>
        <p className="flex items-start gap-2.5 text-body-lg text-ink">
          <Check
            size={22}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-accent"
          />
          <span>
            You are in. Fillo+ is on{" "}
            <span className="tabular">+91 {formatPhone(joined)}</span> from now
            on, and coins start with your next order.
          </span>
        </p>
        <ButtonLink href="/account/rewards" size="lg" className="mt-6">
          See my coins
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (sending) return;
          // The hero's one button stays live; an incomplete number is
          // explained rather than silently ignored.
          if (phone.length !== 10) {
            setInvalid(true);
            inputRef.current?.focus();
            return;
          }
          send();
        }}
        className="flex max-w-[440px] flex-col gap-3 sm:flex-row"
      >
        <div
          className={cn(
            // `flex-1` on the column axis would zero the height out — the field
            // only grows along the row, once the form turns into one.
            "flex h-12 w-full min-w-0 items-stretch rounded-md border bg-card pl-3.5 sm:flex-1",
            invalid ? "border-accent" : "border-line focus-within:border-ink",
          )}
        >
          <label htmlFor="fillo-plus-phone" className="sr-only">
            Your mobile number
          </label>
          <span aria-hidden="true" className="flex shrink-0 items-center text-body-sm text-muted">
            +91
          </span>
          <input
            id="fillo-plus-phone"
            ref={inputRef}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "fillo-plus-error" : undefined}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""));
              setInvalid(false);
            }}
            placeholder="98765 43210"
            className="h-full w-full min-w-0 bg-transparent px-2.5 text-body-sm text-ink tabular placeholder:text-muted focus:outline-none"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          loading={sending}
          className="h-12 shrink-0"
        >
          Join free
        </Button>
      </form>

      {invalid ? (
        <p id="fillo-plus-error" role="alert" className="mt-3 text-body-sm text-accent">
          That needs to be a ten-digit mobile number.
        </p>
      ) : null}

      <p className="mt-3 text-body-sm text-muted">
        We will never call you. Only bread updates, and only if you ask.
      </p>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        variant="sheet"
        title={
          <span className="font-display text-[28px] leading-tight text-ink">
            Check your messages
          </span>
        }
        description={
          <span className="text-body-sm text-ink-2">
            We sent a four-digit code to{" "}
            <span className="tabular">+91 {formatPhone(phone)}</span>.
          </span>
        }
      >
        <OtpBoxes
          className="mt-6"
          length={4}
          status={status}
          onComplete={verify}
          error={
            status === "error"
              ? "That code didn't match. Try again, or ask for a new one."
              : undefined
          }
        />

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {resendIn > 0 ? (
            <p className="text-body-sm text-muted tabular">
              A new code in {resendIn}s
            </p>
          ) : (
            <Button variant="ghost" size="sm" onClick={send}>
              Send a new code
            </Button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn("link-underline text-body-sm text-ink-2")}
          >
            Use a different number
          </button>
        </div>
      </Dialog>
    </div>
  );
}

/** "9876543210" → "98765 43210". Grouped the way an Indian number is read. */
function formatPhone(value: string): string {
  return value.length === 10 ? `${value.slice(0, 5)} ${value.slice(5)}` : value;
}
