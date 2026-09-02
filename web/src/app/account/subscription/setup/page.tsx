import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { SubscriptionBuilder } from "@/components/pages/account/SubscriptionBuilder";

const PATH = "/account/subscription/setup";

export const metadata: Metadata = buildMetadata(PATH);

export default function StandingOrderSetupPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Standing order", path: "/account/subscription" },
          { name: "Set up", path: PATH },
        ]}
      />
      <AccountPage
        h1="Set up a standing order"
        kicker="The Standing Order"
        lead="Four steps, one screen. The bread turns up on the same day every week and you stop thinking about it."
      >
        <SubscriptionBuilder />
      </AccountPage>
    </>
  );
}
