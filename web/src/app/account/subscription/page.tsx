import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { SubscriptionManager } from "@/components/pages/account/SubscriptionManager";
import { SUBSCRIPTION_PAGE_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/subscription";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function StandingOrderPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(SUBSCRIPTION_PAGE_STATES, params.state, "active");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Standing order", path: PATH },
        ]}
      />
      <AccountPage
        h1="Your standing order"
        kicker="The Standing Order"
        lead="Skip any week. Pause anytime. Cancel in one tap. All of it is on this page, not behind a phone call."
      >
        <SubscriptionManager state={state} />
      </AccountPage>
    </>
  );
}
