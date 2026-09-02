"use client";

import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { formatCountdown } from "@/lib/format";

/**
 * OTP phone field — DESIGN.md §12.25.
 *
 * Two steps in one component; the second REPLACES the first in place, never on
 * a new page. The phone number is the account — there is no password anywhere
 * (site-content.md, "Account and flows").
 *
 * Never masks the digits. Never auto-submits on the sixth digit without a
 * visible state change — `onComplete` fires, and the parent is expected to
 * move the component into `verifying`.
 */

export type OtpStatus = "idle" | "verifying" | "success" | "error";

export function OtpField({
  step,
  phone,
  onPhoneChange,
  onSendCode,
  onChangeNumber,
  onComplete,
  status = "idle",
  error,
  sending = false,
  resendIn = 0,
  onResend,
  /** After three failed sends the resend becomes the WhatsApp fallback. */
  whatsappFallback = false,
  onWhatsappFallback,
  className,
}: {
  step: "number" | "code";
  phone: string;
  onPhoneChange?: (value: string) => void;
  onSendCode?: () => void;
  onChangeNumber?: () => void;
  onComplete?: (code: string) => void;
  status?: OtpStatus;
  error?: React.ReactNode;
  sending?: boolean;
  resendIn?: number;
  onResend?: () => void;
  whatsappFallback?: boolean;
  onWhatsappFallback?: () => void;
  className?: string;
}) {
  if (step === "number") {
    return (
      <div className={className}>
        <Field
          label="Mobile number"
          htmlFor="otp-phone"
          helper="We only use this to tell you where the van is."
        >
          <Input
            id="otp-phone"
            prefix="+91"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={10}
            value={phone}
            onChange={(e) => onPhoneChange?.(e.target.value.replace(/\D/g, ""))}
            placeholder="98765 43210"
            className="font-mono tabular"
            aria-describedby="otp-phone-helper"
          />
        </Field>
        <Button
          className="mt-4"
          size="md"
          loading={sending}
          onClick={onSendCode}
          disabled={phone.length !== 10}
        >
          Send code
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-body-sm text-ink-600 tabular">
          +91 {phone || "—"}
        </p>
        <button
          type="button"
          onClick={onChangeNumber}
          className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
        >
          Change
        </button>
      </div>
      <OtpBoxes
        className="mt-5"
        status={status}
        onComplete={onComplete}
        error={error}
      />
      <div className="mt-4">
        {whatsappFallback ? (
          <Button variant="ghost" size="sm" onClick={onWhatsappFallback}>
            Get the code on WhatsApp instead
          </Button>
        ) : resendIn > 0 ? (
          <p className="micro text-ink-500 tabular">
            RESEND IN {formatCountdown(resendIn)}
          </p>
        ) : (
          <Button variant="ghost" size="sm" onClick={onResend}>
            Resend code
          </Button>
        )}
      </div>
    </div>
  );
}

const NUMBER_WORD: Record<number, string> = {
  4: "four",
  5: "five",
  6: "six",
  8: "eight",
};

/** The code boxes on their own — reusable inside a checkout block. */
export function OtpBoxes({
  length = 6,
  status = "idle",
  onComplete,
  error,
  className,
}: {
  length?: number;
  status?: OtpStatus;
  onComplete?: (code: string) => void;
  error?: React.ReactNode;
  className?: string;
}) {
  const [digits, setDigits] = React.useState<string[]>(() =>
    Array.from({ length }, () => ""),
  );
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const groupId = React.useId();

  // An error clears the boxes and returns focus to the first (§12.25).
  React.useEffect(() => {
    if (status !== "error") return;
    setDigits(Array.from({ length }, () => ""));
    refs.current[0]?.focus();
  }, [status, length]);

  function commit(next: string[]) {
    setDigits(next);
    const code = next.join("");
    if (code.length === length && !next.includes("")) onComplete?.(code);
  }

  function handleChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    // A paste of the whole code distributes across the group.
    if (clean.length > 1) {
      for (let i = 0; i < clean.length && index + i < length; i++) {
        next[index + i] = clean[i];
      }
      refs.current[Math.min(index + clean.length, length - 1)]?.focus();
    } else {
      next[index] = clean;
      refs.current[Math.min(index + 1, length - 1)]?.focus();
    }
    commit(next);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  const verifying = status === "verifying";

  return (
    <fieldset
      className={cn("min-w-0 border-0 p-0", className)}
      aria-busy={verifying || undefined}
      aria-describedby={error ? `${groupId}-error` : undefined}
    >
      <legend className="micro mb-2 text-ink-600">
        Enter the {NUMBER_WORD[length] ?? length}-digit code
      </legend>
      <div
        className={cn(
          "flex items-center gap-2",
          status === "error" && "motion-safe:animate-[var(--animate-shake)]",
        )}
      >
        {digits.map((digit, index) => (
          <React.Fragment key={index}>
            {/* A wider gap between the third and fourth box (§12.25). */}
            {index === length / 2 ? <span className="w-2" aria-hidden="true" /> : null}
            <input
              ref={(el) => {
                refs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={length}
              disabled={verifying}
              aria-label={`Digit ${index + 1} of ${length}`}
              className={cn(
                "h-14 w-12 rounded-sm border text-center font-mono text-display-sm tabular",
                "bg-paper-0 text-ink-800 transition-colors duration-[var(--dur-fast)]",
                "focus:border-ink-800 focus:outline-none",
                status === "error" && "border-danger",
                status === "success" && "border-success",
                verifying && "border-paper-300 bg-paper-100",
                status === "idle" && "border-paper-400",
              )}
            />
          </React.Fragment>
        ))}
      </div>

      {verifying ? (
        <p className="mt-3 flex items-center gap-2 text-caption text-ink-500">
          <Loader2
            size={16}
            strokeWidth={1.5}
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Checking that code.
        </p>
      ) : null}

      {error ? (
        <p
          id={`${groupId}-error`}
          role="alert"
          className="mt-3 flex items-start gap-1.5 text-caption text-danger"
        >
          <AlertCircle size={16} strokeWidth={1.5} className="mt-px shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  );
}
