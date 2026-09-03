import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { Rewards } from "@/components/pages/account/Rewards";
import { REWARDS_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/rewards";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RewardsPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(REWARDS_STATES, params.state, "default");

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
        h1="Fillo coins"
        kicker="Fillo+"
        lead="Two coins for every ₹100. Twenty-five coins is ₹25 off, and they never expire."
      >
        <Rewards state={state} />
      </AccountPage>
    </>
  );
}
