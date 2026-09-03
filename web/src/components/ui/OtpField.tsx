"use client";

import * as React from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { formatCountdown } from "@/lib/format";

/**
 * OTP phone field — PAGES-v2 checkout block 4 and the login card.
 *
 * The number is the account; there is no password anywhere on this site. Two
 * states share one patch of screen: the number, then the four boxes, then the
 * verified line that replaces both. Nothing opens a new page and nothing
 * jumps — the block keeps its position while its contents change.
 *
 * The mock code is 1234. Four boxes, not six, because four is what an Indian
 * bank OTP looks like and the shorter run is the whole point of the pattern.
 */

export type OtpStatus = "idle" | "verifying" | "success" | "error";

export const OTP_LENGTH = 4;

/** "+91 86189 06902" — the shape people recognise on a bill. */
export function formatIndianPhone(digits: string): string {
  const clean = digits.replace(/\D/g, "").slice(0, 10);
  if (clean.length <= 5) return `+91 ${clean}`;
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
}

/* -------------------------------------------------------------------------- */
/* The phone input                                                             */
/* -------------------------------------------------------------------------- */

export function PhoneInput({
  id,
  value,
  onChange,
  disabled,
  invalid,
  className,
}: {
  id?: string;
  value: string;
  onChange: (digits: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch rounded-md border bg-card",
        "transition-colors duration-[var(--dur-fast)]",
        invalid ? "border-danger" : "border-line focus-within:border-ink",
        disabled && "opacity-60",
        className,
      )}
    >
      <span className="flex items-center pl-4 text-body text-muted tabular">
        +91
      </span>
      <span aria-hidden="true" className="my-3 ml-3 w-px bg-line" />
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        maxLength={10}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="98765 43210"
        aria-invalid={invalid || undefined}
        className={cn(
          "h-13 min-w-0 flex-1 bg-transparent px-3 text-body text-ink tabular",
          "placeholder:text-muted focus:outline-none",
        )}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The verified line — replaces the field once the code lands                  */
/* -------------------------------------------------------------------------- */

export function VerifiedPhone({
  phone,
  onChange,
  className,
}: {
  phone: string;
  onChange?: () => void;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body text-ink",
        className,
      )}
    >
      <Check
        size={20}
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0 text-success"
      />
      <span>Verified</span>
      <span aria-hidden="true" className="text-muted">
        ·
      </span>
      <span className="tabular">{formatIndianPhone(phone)}</span>
      {onChange ? (
        <>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <button
            type="button"
            onClick={onChange}
            className="link-underline font-semibold text-accent"
          >
            change
          </button>
        </>
      ) : null}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* The code boxes                                                              */
/* -------------------------------------------------------------------------- */

export function OtpBoxes({
  length = OTP_LENGTH,
  status = "idle",
  onComplete,
  error,
  autoFocus = false,
  className,
}: {
  length?: number;
  status?: OtpStatus;
  onComplete?: (code: string) => void;
  error?: React.ReactNode;
  autoFocus?: boolean;
  className?: string;
}) {
  const [digits, setDigits] = React.useState<string[]>(() =>
    Array.from({ length }, () => ""),
  );
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const groupId = React.useId();

  // A wrong code clears the boxes and returns focus to the first one, so the
  // next attempt starts where a finger already is.
  React.useEffect(() => {
    if (status !== "error") return;
    setDigits(Array.from({ length }, () => ""));
    refs.current[0]?.focus();
  }, [status, length]);

  React.useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next: string[]) {
    setDigits(next);
    const code = next.join("");
    if (code.length === length && !next.includes("")) onComplete?.(code);
  }

  function handleChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    // A pasted code distributes across the whole group.
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

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  const verifying = status === "verifying";

  return (
    <div
      className={cn("min-w-0", className)}
      aria-busy={verifying || undefined}
    >
      <div
        role="group"
        aria-label={`Enter the ${length}-digit code`}
        className={cn(
          "flex items-center gap-2.5",
          status === "error" && "motion-safe:animate-[var(--animate-shake)]",
        )}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
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
            aria-describedby={error ? `${groupId}-error` : undefined}
            className={cn(
              "h-14 w-13 rounded-md border bg-card text-center",
              "font-display text-[24px] leading-none text-ink tabular",
              "transition-colors duration-[var(--dur-fast)]",
              "focus:border-ink focus:outline-none",
              status === "error"
                ? "border-danger"
                : status === "success"
                  ? "border-success"
                  : verifying
                    ? "border-line bg-paper-2"
                    : "border-line",
            )}
          />
        ))}
      </div>

      {verifying ? (
        <p className="mt-3 flex items-center gap-2 text-body-sm text-muted">
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
          className="mt-3 flex items-start gap-1.5 text-body-sm text-danger"
        >
          <AlertCircle
            size={16}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The whole two-step field                                                    */
/* -------------------------------------------------------------------------- */

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
  sendLabel = "Send code",
  helper,
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
  sendLabel?: string;
  helper?: React.ReactNode;
  className?: string;
}) {
  const fieldId = React.useId();

  if (step === "number") {
    return (
      <div className={className}>
        <label
          htmlFor={fieldId}
          className="micro mb-2 block text-muted"
        >
          Mobile number
        </label>
        <PhoneInput id={fieldId} value={phone} onChange={onPhoneChange ?? noop} />
        {helper ? (
          <p className="mt-2 text-body-sm text-muted">{helper}</p>
        ) : null}
        <Button
          className="mt-4"
          size="md"
          loading={sending}
          onClick={onSendCode}
          disabled={phone.length !== 10}
        >
          {sendLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-body-sm text-ink-2 tabular">
          {formatIndianPhone(phone)}
        </p>
        <button
          type="button"
          onClick={onChangeNumber}
          className="link-underline text-body-sm font-semibold text-accent"
        >
          Change
        </button>
      </div>

      <OtpBoxes
        className="mt-4"
        status={status}
        onComplete={onComplete}
        error={error}
        autoFocus
      />

      <div className="mt-4 min-h-9">
        {resendIn > 0 ? (
          <p className="text-body-sm text-muted tabular">
            Resend in {formatCountdown(resendIn)}
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

function noop() {}
