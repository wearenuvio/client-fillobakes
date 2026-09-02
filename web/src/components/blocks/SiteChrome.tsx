"use client";

import * as React from "react";
import { Header } from "@/components/blocks/Header";
import { Footer } from "@/components/blocks/Footer";
import { CartDrawer } from "@/components/blocks/CartDrawer";
import { RevealOnScroll } from "@/components/blocks/RevealOnScroll";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * The global chrome: header → page → footer, with the cart drawer and the
 * Area & lane sheet mounted once at the root so any component can open either
 * without prop-drilling.
 *
 * DESIGN-v2 §2 removes the announcement ticker from the global chrome: the
 * header is the first thing on the page and nothing sits above it.
 *
 * There is exactly one floating element on this site and it is WhatsApp
 * (journey §2.7). The van tracker is a page, a header state and a home
 * module — it does not get a pill.
 */

/**
 * There is one Area & lane sheet on the site and it is mounted here. Any page
 * component that offers to change the area or the lane — the home lane cards,
 * the PDP route line, the cart's fulfilment row — opens *this* one through
 * `useAreaSheet()` rather than rendering a second copy of the control.
 */
const AreaSheetContext = React.createContext<(() => void) | null>(null);

export function useAreaSheet(): () => void {
  const open = React.useContext(AreaSheetContext);
  // A component rendered outside the chrome (the styleguide) still renders;
  // it just has no sheet to open.
  return open ?? noop;
}

function noop() {}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [areaSheetOpen, setAreaSheetOpen] = React.useState(false);
  const openAreaSheet = React.useCallback(() => setAreaSheetOpen(true), []);
  const closeAreaSheet = React.useCallback(() => setAreaSheetOpen(false), []);

  return (
    <ToastProvider>
      <AreaSheetContext.Provider value={openAreaSheet}>
        <a
          href="#main"
          className="sr-only rounded-md bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[var(--z-toast)]"
        >
          Skip to content
        </a>

        <Header onOpenAreaSheet={openAreaSheet} />

        <main id="main">{children}</main>

        <Footer />

        <RevealOnScroll />
        <CartDrawer onChangeLane={openAreaSheet} />
        <AreaLaneSheet open={areaSheetOpen} onClose={closeAreaSheet} />
      </AreaSheetContext.Provider>
    </ToastProvider>
  );
}
