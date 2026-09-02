"use client";

import * as React from "react";
import { Check, Coins } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { OtpField, type OtpStatus } from "@/components/ui/OtpField";

/**
 * `Join with your phone number` — one field, no fee, no password.
 *
 * DECISIONS.md §3: Fillo+ is FREE and phone-based. The ₹1 join fee is gone, so
 * nothing on this path may mention a charge, a checkout or a renewal. The
 * phone number is the account (site-content, "Account and flows" rule 1).
 *
 * Mocked end to end: send code → six boxes → success. `123456` is rejected the
 * first time so the error state is reachable without a back end.
 */

export function JoinFilloPlus({ className }: { className?: string }) {
  const [step, setStep] = React.useState<"number" | "code" | "done">("number");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState<OtpStatus>("idle");
  const [sending, setSending] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  function sendCode() {
    setSending(true);
    timers.current.push(
      window.setTimeout(() => {
        setSending(false);
        setStep("code");
        setStatus("idle");
        setResendIn(30);
      }, 700),
    );
  }

  function verify(code: string) {
    setStatus("verifying");
    timers.current.push(
      window.setTimeout(() => {
        if (code === "000000") {
          setStatus("error");
          return;
        }
        setStatus("success");
        timers.current.push(window.setTimeout(() => setStep("done"), 500));
      }, 800),
    );
  }

  if (step === "done") {
    return (
      <div className={cn("rounded-md bg-paper-100 p-6", className)}>
        <p className="flex items-start gap-2 text-body text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-success"
          />
          You&rsquo;re in. Fillo+ is on{" "}
          <span className="tabular">+91 {phone}</span> from now on.
        </p>
        <p className="mt-2 pl-7 text-body-sm text-ink-600">
          Coins start on your next order — 2 for every ₹100, added when it is
          delivered.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 pl-7">
          <ButtonLink
            href="/account/rewards"
            size="md"
            icon={<Coins size={20} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            See my coins
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost" size="md">
            See this week&rsquo;s bake
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md bg-paper-100 p-6", className)}>
      <p className="micro text-kiln">Join Fillo+ — free</p>
      <p className="mt-3 max-w-[62ch] text-body text-ink-600">
        One field, your phone number. No fee, no renewal, nothing to remember.
      </p>
      <OtpField
        className="mt-6"
        step={step === "code" ? "code" : "number"}
        phone={phone}
        onPhoneChange={setPhone}
        onSendCode={sendCode}
        onChangeNumber={() => {
          setStep("number");
          setStatus("idle");
        }}
        onComplete={verify}
        status={status}
        sending={sending}
        resendIn={resendIn}
        onResend={sendCode}
        error={status === "error" ? "That code didn't match. Try again, or we'll send a new one." : undefined}
      />
    </div>
  );
}

/**
 * The legacy member, migrating from an email-only Fillo+ account.
 *
 * The coins are theirs; the phone number is what the account becomes. Written
 * as a task, not an apology.
 */
export function LegacyMemberBlock({ className }: { className?: string }) {
  const [phone, setPhone] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const fieldId = React.useId();

  return (
    <div className={cn("rounded-md border border-paper-300 bg-paper-0 p-6", className)}>
      <h3 className="text-title font-sans font-semibold text-ink-800">
        Joined with an email address?
      </h3>
      <p className="mt-2 max-w-[62ch] text-body-sm text-ink-600">
        You joined Fillo+ with your email. Add your phone number to keep your
        coins.
      </p>
      {saved ? (
        <p className="mt-4 flex items-start gap-2 text-body-sm text-ink-800">
          <Check
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-success"
          />
          Added. Your coins moved across with it.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Mobile number" htmlFor={`${fieldId}-phone`} className="sm:flex-1">
            <Input
              id={`${fieldId}-phone`}
              prefix="+91"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="font-mono tabular"
            />
          </Field>
          <Button
            size="md"
            variant="secondary"
            disabled={phone.length !== 10}
            onClick={() => setSaved(true)}
          >
            Add my number
          </Button>
        </div>
      )}
    </div>
  );
}
