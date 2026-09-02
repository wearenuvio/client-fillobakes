"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useHydrated } from "@/store/hydrated";

/**
 * The account session.
 *
 * The phone number IS the account (site-content.md, "Account and flows"):
 * no password anywhere, no separate sign-up. This store holds the one fact
 * the front end needs — the verified number — and nothing else. Everything
 * a signed-in screen shows comes from the mock fixtures, so there is no
 * customer data in localStorage.
 *
 * The site's own session store (store/session.ts) holds WHERE the van meets
 * you and is deliberately left alone here: signing out must not lose
 * someone's area.
 */

export type AccountSessionState = {
  /** Schema version — bump when the shape changes so old blobs are dropped. */
  version: number;
  /** Ten digits, no country code. null when signed out. */
  phone: string | null;
  signIn: (phone: string) => void;
  signOut: () => void;
};

export const useAccountSessionStore = create<AccountSessionState>()(
  persist(
    (set) => ({
      version: 1,
      phone: null,
      signIn: (phone) => set({ phone }),
      signOut: () => set({ phone: null }),
    }),
    {
      name: "fillo.account.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ version: s.version, phone: s.phone }),
    },
  ),
);

/**
 * Reads the session behind the hydration guard, because the server cannot see
 * localStorage and the signed-out shell has to render first.
 */
export function useAccountSession(): {
  hydrated: boolean;
  signedIn: boolean;
  phone: string | null;
} {
  const hydrated = useHydrated();
  const phone = useAccountSessionStore((s) => s.phone);
  return { hydrated, signedIn: hydrated && phone !== null, phone };
}

/** "8618906902" -> "+91 86189 06902" */
export function formatPhone(phone: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return `+91 ${phone}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
