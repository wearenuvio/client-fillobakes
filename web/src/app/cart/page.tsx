import type { Metadata } from "next";
import { buildMetadata, getH1, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { CartPage } from "@/components/pages/commerce/CartPage";
import { runViews } from "@/components/pages/commerce/board-data";
import { getRuns, isOnRun } from "@/components/pages/commerce/run";
import { getBestsellers, getProducts } from "@/lib/catalog";
import { getAreas, getCartReservation, getLoyaltyLedger, getOnBoard } from "@/lib/mock";
import { COMMERCE } from "@/lib/config";

const PATH = "/cart";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Your box — the full-page cart.
 *
 * Everything that reads a fixture happens here; the client gets slugs and
 * sentences. The empty state carries a menu rail beneath it, because an empty
 * cart should hand you one door, never a dead end.
 */
export default function CartRoute() {
  const runs = runViews();
  const onBoard = getOnBoard();
  const reservation = getCartReservation();
  const ledger = getLoyaltyLedger();

  const areaRuns: Record<string, string> = {};
  for (const area of getAreas()) {
    if (area.routeId) areaRuns[area.name] = area.routeId;
  }

  const runCarries: Record<string, string[]> = {};
  for (const run of getRuns()) {
    runCarries[run.id] = getProducts()
      .filter((p) => isOnRun(p, run))
      .map((p) => p.slug);
  }

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Your box", path: PATH }]} />

      <Section surface="paper-50">
        <SectionHeader
          as="h1"
          kicker="Your order"
          heading={getH1(PATH, "Your box")}
          meta={
            <>
              <p>Delivery is inside the total</p>
              <p>Free on the van, free over ₹{COMMERCE.freeDeliveryThreshold}</p>
            </>
          }
        />

        <CartPage
          runs={runs}
          areaRuns={areaRuns}
          runCarries={runCarries}
          soldOutSlugs={onBoard.filter((i) => i.state === "sold_out").map((i) => i.slug)}
          onVanSlugs={onBoard.filter((i) => i.left > 0).map((i) => i.slug)}
          suggestions={getBestsellers()
            .slice(0, 4)
            .map((p) => p.slug)}
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
            progress: ledger.progressCopy,
          }}
        />
      </Section>
    </>
  );
}
