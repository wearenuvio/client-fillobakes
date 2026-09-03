"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { OtpField } from "@/components/ui/OtpField";
import { useToast } from "@/components/ui/Toast";
import { getCustomer, getLoyaltyLedger } from "@/lib/mock";
import { pluralise } from "@/lib/format";
import { Panel, PanelHead } from "@/components/pages/account/Panel";
import {
  formatPhone,
  useAccountSessionStore,
} from "@/components/pages/account/session";
import { TextField } from "@/components/pages/content/Form";

/**
 * Settings — site-content "Screen: Settings".
 *
 * Changing the number re-verifies by code, because the number IS the account.
 * Deleting is a plain explanation of what goes and what stays, not a dark
 * pattern: the button says what it does, and the confirmation asks you to
 * type the word.
 */
export function SettingsPanel() {
  const customer = getCustomer();
  const ledger = getLoyaltyLedger();
  const router = useRouter();
  const signOut = useAccountSessionStore((s) => s.signOut);
  const { toast } = useToast();

  const [name, setName] = React.useState(customer.name);
  const [email, setEmail] = React.useState(customer.email ?? "");
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [phone, setPhone] = React.useState(customer.phone.replace("+91", ""));
  const [newPhone, setNewPhone] = React.useState("");
  const [otpStep, setOtpStep] = React.useState<"number" | "code">("number");
  const [sending, setSending] = React.useState(false);
  const [otpStatus, setOtpStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle");
  const [otpError, setOtpError] = React.useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [confirmWord, setConfirmWord] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  function saveProfile() {
    setSavingProfile(true);
    window.setTimeout(() => {
      setSavingProfile(false);
      toast({ message: "Saved." });
    }, 500);
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel as="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); saveProfile(); }}>
        <PanelHead label="You" />
        <div className="mt-5 flex max-w-[440px] flex-col gap-5">
          <TextField
            id="settings-name"
            label="Name"
            helper="We ask for this after the first order, never before it."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
          <TextField
            id="settings-email"
            label="Email"
            type="email"
            helper="Optional, and only used for your invoice."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <Button className="mt-6" type="submit" loading={savingProfile}>
          Save
        </Button>
      </Panel>

      <Panel>
        <PanelHead label="Your number" />
        <p className="mt-4 font-display text-[26px] leading-tight text-ink tabular">
          {formatPhone(phone)}
        </p>
        <p className="mt-2 max-w-[46ch] text-body text-ink-2">
          Changing your number moves your orders, coins and standing order with
          it. We send a code to the new one.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => {
            setPhoneOpen(true);
            setOtpStep("number");
            setNewPhone("");
            setOtpStatus("idle");
            setOtpError(null);
          }}
        >
          Change my number
        </Button>
      </Panel>

      <Panel>
        <PanelHead label="Delete my account" />
        <ul className="mt-4 flex max-w-[58ch] list-none flex-col gap-2 text-body text-ink-2">
          <li>Deleting removes your addresses, your saved stops and your alerts.</li>
          <li className="tabular">
            Your {pluralise(ledger.balance, "Fillo coin")} go with it, and we
            cannot get them back.
          </li>
          <li>
            Orders already placed still get delivered, and we keep the invoices
            as long as the law requires.
          </li>
          <li>
            A standing order is cancelled after the delivery already in the
            plan.
          </li>
        </ul>
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmWord("");
              setDeleteOpen(true);
            }}
          >
            Delete my account
          </Button>
        </div>
      </Panel>

      {/* ---- Change number ------------------------------------------------ */}
      <Dialog
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        title="Change your number"
        description="Your orders, coins and standing order move with it. We'll send a code to the new number."
      >
        {otpStep === "number" ? (
          <OtpField
            className="mt-6"
            step="number"
            phone={newPhone}
            onPhoneChange={setNewPhone}
            sending={sending}
            onSendCode={() => {
              setSending(true);
              window.setTimeout(() => {
                setSending(false);
                setOtpStep("code");
                toast({ message: "Sent. Check your messages." });
              }, 700);
            }}
          />
        ) : (
          <OtpField
            className="mt-6"
            step="code"
            phone={newPhone}
            status={otpStatus}
            error={otpError}
            onChangeNumber={() => setOtpStep("number")}
            onComplete={(code) => {
              setOtpStatus("verifying");
              window.setTimeout(() => {
                if (code === "000000") {
                  setOtpStatus("error");
                  setOtpError("That code didn't match. Try again, or we'll send a new one.");
                  return;
                }
                setOtpStatus("success");
                setOtpError(null);
                setPhone(newPhone);
                setPhoneOpen(false);
                toast({ message: `Done. Your account is on ${formatPhone(newPhone)} now.` });
              }, 900);
            }}
          />
        )}
      </Dialog>

      {/* ---- Delete ------------------------------------------------------- */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete your account?"
        description="This cannot be undone. Type DELETE to confirm."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              loading={deleting}
              disabled={confirmWord.trim().toUpperCase() !== "DELETE"}
              onClick={() => {
                setDeleting(true);
                window.setTimeout(() => {
                  setDeleting(false);
                  setDeleteOpen(false);
                  signOut();
                  toast({
                    message:
                      "Deleted. Sorry to see you go. The van is still around if you change your mind.",
                  });
                  router.push("/");
                }, 800);
              }}
            >
              Delete my account
            </Button>
          </>
        }
      >
        <TextField
          className="mt-6"
          id="delete-confirm"
          label="Type DELETE"
          value={confirmWord}
          onChange={(e) => setConfirmWord(e.target.value)}
          autoComplete="off"
          placeholder="DELETE"
        />
        {confirmWord.trim().toUpperCase() === "DELETE" ? (
          <p className="mt-3 flex items-center gap-2 text-body-sm text-ink-2">
            <Check
              size={16}
              strokeWidth={1.5}
              className="text-success"
              aria-hidden="true"
            />
            That is the word.
          </p>
        ) : null}
      </Dialog>
    </div>
  );
}
