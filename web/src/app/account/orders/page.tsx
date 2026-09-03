import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { OrdersList } from "@/components/pages/account/OrdersList";
import { ORDERS_LIST_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/orders";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AccountOrdersPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(ORDERS_LIST_STATES, params.state, "default");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Orders", path: PATH },
        ]}
      />
      <AccountPage
        h1="Orders"
        kicker="Your account"
        lead="Everything you have ordered, newest first. Any of them goes back in your order in one tap."
      >
        <OrdersList state={state} />
      </AccountPage>
    </>
  );
}
