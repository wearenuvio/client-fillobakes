import type { Metadata } from "next";
import { buildMetadata, getH1, JsonLd } from "@/lib/seo";
import { Section, Container } from "@/components/blocks/Section";
import { Kicker } from "@/components/ui/Rule";
import { CheckoutPage } from "@/components/pages/commerce/CheckoutPage";
import { runViews } from "@/components/pages/commerce/board-data";
import { getRuns } from "@/components/pages/commerce/run";
import {
  getAreas,
  getCartReservation,
  getCutoffClock,
  getLatestOrder,
  getLoyaltyLedger,
  getOnBoard,
  TBC,
} from "@/lib/mock";

const PATH = "/checkout";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * One page, one domain, four blocks.
 *
 * The van lane skips the address block entirely — there is no door to bring it
 * to, and asking for one is the kind of form that makes people give up.
 */
export default function CheckoutRoute() {
  const runs = runViews();
  const reservation = getCartReservation();
  const ledger = getLoyaltyLedger();
  const onBoard = getOnBoard();

  const areaRuns: Record<string, string> = {};
  const areaWindows: Record<string, string[]> = {};
  for (const area of getAreas()) {
    if (area.routeId) areaRuns[area.name] = area.routeId;
    areaWindows[area.name] = area.windows;
  }

  const runSlots: Record<
    string,
    { date: string; dateLabel: string; open: boolean; isToday: boolean }[]
  > = {};
  for (const run of getRuns()) {
    runSlots[run.id] = run.slots.map((s) => ({
      date: s.date,
      dateLabel: s.dateLabel,
      open: s.open,
      isToday: s.isToday,
    }));
  }

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Checkout", path: PATH }]} />

      <Section surface="paper-50">
        <Container width="narrow" className="!px-0">
          <Kicker>Checkout</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">
            {getH1(PATH, "How do you want it?")}
          </h1>
          <p className="mt-3 max-w-[46ch] text-body-lg text-ink-600">
            Four things, one page. Delivery is already inside the total, so the number
            on the button is the number you pay.
          </p>

          <CheckoutPage
            runs={runs}
            areaRuns={areaRuns}
            runSlots={runSlots}
            areaWindows={areaWindows}
            soldOutSlugs={onBoard.filter((i) => i.state === "sold_out").map((i) => i.slug)}
            onVanSlugs={onBoard.filter((i) => i.left > 0).map((i) => i.slug)}
            cutoffCopy={getCutoffClock().copy}
            holdCopy={{
              running: reservation.copy.running,
              expiringSoon: reservation.copy.expiringSoon,
              expired: reservation.copy.expired,
            }}
            holdMinutes={reservation.holdMinutes}
            coins={{
              balance: ledger.balance,
              threshold: ledger.redeemThreshold,
              value: ledger.redemptionValue,
            }}
            cod={{ surcharge: 30, cap: 500, note: TBC.codSurcharge }}
            orderId={getLatestOrder()?.id ?? "FB-2609-0142"}
          />
        </Container>
      </Section>
    </>
  );
}
