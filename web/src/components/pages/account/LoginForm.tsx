"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Check, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OtpField } from "@/components/ui/OtpField";
import { useToast } from "@/components/ui/Toast";
import { CONTACT, whatsappHref } from "@/lib/config";
import { Panel } from "@/components/pages/account/Panel";
import {
  formatPhone,
  useAccountSession,
  useAccountSessionStore,
} from "@/components/pages/account/session";

/**
 * Sign in — site-content.md "Screen: Login".
 *
 * The phone number is the account. There is no password and no separate
 * sign-up: a number that has not ordered before creates an account on the
 * first code, and the name is asked after the first order, never before it.
 *
 * Everything here is mocked with local state and a delay — no network. Any
 * six digits verify; `000000` is the failure path, so the wrong-code, the
 * resend-cooldown, the WhatsApp fallback and the rate-limited states are all
 * reachable without a back end.
 */

const RESEND_SECONDS = 28;
const WRONG_CODE = "000000";
const MAX_ATTEMPTS = 3;

type Step = "number" | "code";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const signIn = useAccountSessionStore((s) => s.signIn);
  const { hydrated, signedIn, phone: sessionPhone } = useAccountSession();

  const next = params?.get("next") ?? "/account";

  const [step, setStep] = React.useState<Step>("number");
  const [phone, setPhone] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const [resendIn, setResendIn] = React.useState(0);
  const [sends, setSends] = React.useState(0);

  // The resend cooldown. A real second, not a decorative one.
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const rateLimited = attempts >= MAX_ATTEMPTS;

  function sendCode() {
    setSending(true);
    setError(null);
    setStatus("idle");
    window.setTimeout(() => {
      setSending(false);
      setSends((n) => n + 1);
      setStep("code");
      setResendIn(RESEND_SECONDS);
      toast({ message: "Sent. Check your messages." });
    }, 700);
  }

  function resend() {
    if (resendIn > 0) {
      toast({ message: `Hang on ${resendIn} seconds and we'll send another.`, tone: "info" });
      return;
    }
    sendCode();
  }

  function verify(code: string) {
    if (rateLimited) return;
    setStatus("verifying");
    setError(null);
    window.setTimeout(() => {
      if (code === WRONG_CODE) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setStatus("error");
        setError(
          nextAttempts >= MAX_ATTEMPTS
            ? "Too many tries. Wait 10 minutes, or WhatsApp us and we'll sign you in."
            : "That code didn't match. Try again, or we'll send a new one.",
        );
        return;
      }
      setStatus("success");
      signIn(phone);
      window.setTimeout(() => router.push(next), 400);
    }, 900);
  }

  if (hydrated && signedIn) {
    return (
      <Panel className="max-w-[var(--max-narrow)]">
        <p className="flex items-center gap-2 text-body text-ink-800">
          <Check size={20} strokeWidth={1.5} className="text-success" aria-hidden="true" />
          You&rsquo;re signed in as <span className="tabular">{formatPhone(sessionPhone)}</span>
        </p>
        <p className="mt-2 text-body-sm text-ink-600">
          Your orders, your coins and your standing order are all on this number.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/account">Go to your account</ButtonLink>
          <ButtonLink href="/logout" variant="secondary">
            Sign out
          </ButtonLink>
        </div>
      </Panel>
    );
  }

  return (
    <div className="max-w-[var(--max-narrow)]">
      {step === "number" ? (
        <Panel>
          <p className="text-body-lg text-ink-600">
            Your number is your account. No password to forget.
          </p>
          <OtpField
            className="mt-6"
            step="number"
            phone={phone}
            onPhoneChange={setPhone}
            onSendCode={sendCode}
            sending={sending}
          />
          <p className="mt-4 text-caption text-ink-500">
            We&rsquo;ll send a six-digit code on WhatsApp.
          </p>
          <p className="mt-6 border-t border-paper-300 pt-6 text-body-sm text-ink-600">
            New here? Same thing. Put your number in.
          </p>
        </Panel>
      ) : (
        <Panel>
          <h2 className="text-display-sm text-ink-800">Check your messages</h2>
          <p className="mt-2 text-body text-ink-600">
            We sent a code on WhatsApp. It lasts ten minutes.
          </p>

          {rateLimited ? (
            <div className="mt-6 rounded-md bg-warning-tint p-4">
              <p className="flex items-start gap-2 text-body-sm text-warning">
                <AlertCircle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
                Too many tries. Wait 10 minutes, or WhatsApp us and we&rsquo;ll sign you in.
              </p>
              <Button
                className="mt-4"
                variant="secondary"
                size="sm"
                icon={<MessageCircle size={16} strokeWidth={1.5} />}
                iconPosition="leading"
                onClick={() => window.open(whatsappHref("Hi Fillo — I can't sign in. Can you help?"), "_blank")}
              >
                Message us on WhatsApp
              </Button>
            </div>
          ) : (
            <OtpField
              className="mt-6"
              step="code"
              phone={phone}
              onChangeNumber={() => {
                setStep("number");
                setStatus("idle");
                setError(null);
              }}
              onComplete={verify}
              status={status}
              error={error}
              resendIn={resendIn}
              onResend={resend}
              whatsappFallback={sends >= MAX_ATTEMPTS}
              onWhatsappFallback={() =>
                window.open(whatsappHref("Hi Fillo — please send my sign-in code on WhatsApp."), "_blank")
              }
            />
          )}

          <p className="mt-6 border-t border-paper-300 pt-6 text-caption text-ink-500">
            Not on WhatsApp? We can send it as an SMS instead —{" "}
            <button
              type="button"
              onClick={() => {
                setResendIn(RESEND_SECONDS);
                toast({ message: "Sent as an SMS. Check your messages." });
              }}
              className="link-underline text-ink-700"
            >
              send an SMS
            </button>
            .
          </p>
        </Panel>
      )}

      <p className="mt-6 text-caption text-ink-500">
        Trouble signing in? <Link href="/contact" className="link-underline text-ink-700">Write to us</Link>, or
        WhatsApp <span className="tabular">{CONTACT.phone}</span>.
      </p>
    </div>
  );
}
