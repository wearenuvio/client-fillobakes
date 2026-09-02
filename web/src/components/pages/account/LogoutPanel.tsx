"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/pages/account/Panel";
import {
  useAccountSession,
  useAccountSessionStore,
} from "@/components/pages/account/session";

/**
 * Sign out — one confirm, then back to the home page. Signing out never
 * touches the session store, so the area chip survives it: losing someone's
 * area is a worse outcome than leaving them signed in.
 */
export function LogoutPanel() {
  const signOut = useAccountSessionStore((s) => s.signOut);
  const { hydrated, signedIn } = useAccountSession();
  const [done, setDone] = React.useState(false);

  const signedOut = done || (hydrated && !signedIn);

  return (
    <>
      <h1 className="mt-4 text-display-lg text-ink-800">
        {signedOut ? "Signed out" : "Sign out"}
      </h1>

      <Panel className="mt-10 max-w-[var(--max-narrow)]">
        {signedOut ? (
          <>
            <p className="flex items-center gap-2 text-body text-ink-800">
              <Check size={20} strokeWidth={1.5} className="text-success" aria-hidden="true" />
              You&rsquo;re signed out.
            </p>
            <p className="mt-2 text-body-sm text-ink-600">
              Your area and your slot are still set, so the van still knows where to
              meet you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/">Back to the home page</ButtonLink>
              <ButtonLink href="/login" variant="secondary">
                Sign back in
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="text-body text-ink-800">Sign out of this browser?</p>
            <p className="mt-2 text-body-sm text-ink-600">
              Your orders, coins and standing order stay on your number. Your area
              stays set too.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  signOut();
                  setDone(true);
                }}
              >
                Sign out
              </Button>
              <ButtonLink href="/account" variant="ghost">
                Stay signed in
              </ButtonLink>
            </div>
          </>
        )}
      </Panel>
    </>
  );
}
