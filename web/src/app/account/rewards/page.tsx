import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { Rewards } from "@/components/pages/account/Rewards";
import { REWARDS_STATES, pickState } from "@/components/pages/account/states";
import { getLoyaltyLedger } from "@/lib/mock";
import { pluralise } from "@/lib/format";

const PATH = "/account/rewards";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RewardsPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(REWARDS_STATES, params.state, "default");
  const ledger = getLoyaltyLedger();

  const balance =
    state === "empty" || state === "not_member"
      ? 0
      : state === "redeemable" || state === "armed"
        ? 30
        : ledger.balance;

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Rewards", path: PATH },
        ]}
      />
      <AccountPage
        h1={pluralise(balance, "coin")}
        kicker="Fillo+"
        lead="Two coins for every ₹100. Twenty-five coins is ₹25 off. They never expire, and that is the whole scheme."
      >
        <Rewards state={state} />
      </AccountPage>
    </>
  );
}
