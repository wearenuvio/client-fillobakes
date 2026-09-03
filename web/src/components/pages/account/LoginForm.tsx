"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  OtpBoxes,
  PhoneInput,
  formatIndianPhone,
  type OtpStatus,
} from "@/components/ui/OtpField";
import {
  useAccountSession,
  useAccountSessionStore,
} from "@/components/pages/account/session";

/**
 * Sign in — PAGES-v2 "Login".
 *
 * One centred card. The number is the account: there is no password and no
 * separate sign-up, so a number that has never ordered creates an account on
 * its first code. The second step replaces the first in place — nothing opens
 * a new page and the card never jumps.
 *
 * Mocked end to end. The code is 1234; anything else takes the wrong-code
 * path, so both states are reachable without a back end.
 */

const OTP_CODE = "1234";
const RESEND_SECONDS = 28;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const signIn = useAccountSessionStore((s) => s.signIn);
  const { hydrated, signedIn, phone: sessionPhone } = useAccountSession();

  const next = params?.get("next") ?? "/account";

  const [step, setStep] = React.useState<"number" | "code">("number");
  const [phone, setPhone] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<OtpStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  function sendCode() {
    setSending(true);
    setError(null);
    setStatus("idle");
    window.setTimeout(() => {
      setSending(false);
      setStep("code");
      setResendIn(RESEND_SECONDS);
    }, 600);
  }

  function verify(code: string) {
    setStatus("verifying");
    setError(null);
    window.setTimeout(() => {
      if (code !== OTP_CODE) {
        setStatus("error");
        setError("That code didn't match. Try again or resend.");
        return;
      }
      setStatus("success");
      signIn(phone);
      window.setTimeout(() => router.push(next), 400);
    }, 700);
  }

  /* -------- Already signed in ------------------------------------- */
  if (hydrated && signedIn) {
    return (
      <Card>
        <p className="flex items-center gap-2.5 text-body text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            className="shrink-0 text-success"
            aria-hidden="true"
          />
          <span>
            Signed in as{" "}
            <span className="tabular">{formatIndianPhone(sessionPhone ?? "")}</span>
          </span>
        </p>
        <p className="mt-3 text-body-sm text-ink-2">
          Your orders, your coins and your standing order all live on this
          number.
        </p>
        <ButtonLink href="/account" size="lg" fullWidth className="mt-6">
          Go to your account
        </ButtonLink>
        <p className="mt-4 text-center">
          <ButtonLink href="/logout" variant="ghost" size="sm">
            Sign out
          </ButtonLink>
        </p>
      </Card>
    );
  }

  /* -------- Step 1: the number ------------------------------------ */
  if (step === "number") {
    return (
      <Card>
        <h1 className="font-display text-[34px] leading-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-3 text-body text-ink-2">
          Your number is your account. No password to forget.
        </p>

        <div className="mt-7">
          <label htmlFor="login-phone" className="micro mb-2 block text-muted">
            Mobile number
          </label>
          <PhoneInput id="login-phone" value={phone} onChange={setPhone} />
        </div>

        <Button
          className="mt-5"
          size="lg"
          fullWidth
          loading={sending}
          disabled={phone.length !== 10}
          onClick={sendCode}
        >
          Send code
        </Button>

        <p className="mt-5 text-body-sm text-muted">
          We&rsquo;ll never call you. Only bread updates.
        </p>
      </Card>
    );
  }

  /* -------- Step 2: the code -------------------------------------- */
  return (
    <Card>
      <h1 className="font-display text-[34px] leading-tight text-ink">
        Check your messages
      </h1>
      <p className="mt-3 text-body text-ink-2 tabular">
        We sent a code to {formatIndianPhone(phone)}.{" "}
        <button
          type="button"
          onClick={() => {
            setStep("number");
            setStatus("idle");
            setError(null);
          }}
          className="link-underline font-semibold text-accent"
        >
          Change
        </button>
      </p>

      <OtpBoxes
        className="mt-7"
        status={status}
        onComplete={verify}
        error={error}
        autoFocus
      />

      <div className="mt-5 min-h-9">
        {resendIn > 0 ? (
          <p className="text-body-sm text-muted tabular">
            Resend in {resendIn}s
          </p>
        ) : (
          <Button variant="ghost" size="sm" onClick={sendCode}>
            Resend code
          </Button>
        )}
      </div>

      <p className="mt-2 text-body-sm text-muted">
        We&rsquo;ll never call you. Only bread updates.
      </p>
    </Card>
  );
}

/** The centred card. Nothing else is on this page. */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[420px] rounded-lg border border-line bg-card p-6 sm:p-8">
      {children}
    </div>
  );
}
