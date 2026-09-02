"use client";

import * as React from "react";

/**
 * The mock submit every form on this front end shares.
 *
 * Phase 2b has no back end: interactions are state plus a delay plus a toast
 * (README, Conventions). The delay is deliberate and honest — an instant
 * "sent" reads as a lie, and a real submit will take about this long — but
 * nothing leaves the browser.
 */
export function useMockSubmit(delay = 900) {
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const submit = React.useCallback(
    (onDone?: () => void) => {
      setStatus("sending");
      timer.current = setTimeout(() => {
        setStatus("sent");
        onDone?.();
      }, delay);
    },
    [delay],
  );

  const reset = React.useCallback(() => setStatus("idle"), []);

  return { status, submit, reset };
}

/** "9876543210" — ten digits, nothing else. Errors show on blur, never on keystroke. */
export function isPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\s+/g, ""));
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
