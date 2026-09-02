import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { AlertsPrefs } from "@/components/pages/account/AlertsPrefs";
import { ALERTS_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/alerts";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AlertsPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(ALERTS_STATES, params.state, "default");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Alerts", path: PATH },
        ]}
      />
      <AccountPage
        h1="What we send you"
        kicker="Your account"
        lead="WhatsApp by default. We don't have a mailing list you didn't ask for."
      >
        <AlertsPrefs state={state} />
      </AccountPage>
    </>
  );
}
