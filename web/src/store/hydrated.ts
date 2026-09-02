"use client";

import { useEffect, useState } from "react";

/**
 * Both stores persist to localStorage, which the server cannot see. Any
 * component that renders persisted state must therefore render the EMPTY
 * state on the server and on the first client paint, then swap — otherwise
 * React reports a hydration mismatch and, worse, the cart badge flickers.
 *
 * zustand's `persist` rehydrates synchronously from localStorage while the
 * store is being created, i.e. before React mounts anything. So "has the
 * browser taken over yet" is the only question worth asking, and one effect
 * answers it without touching the persist API.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
