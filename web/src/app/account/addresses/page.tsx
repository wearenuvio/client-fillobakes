import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { AddressBook } from "@/components/pages/account/AddressBook";
import { ADDRESS_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/addresses";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AddressesPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(ADDRESS_STATES, params.state, "default");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Addresses", path: PATH },
        ]}
      />
      <AccountPage
        h1="Addresses"
        kicker="Your account"
        lead="Save a place and we tell you which day the van reaches it."
      >
        <AddressBook state={state} />
      </AccountPage>
    </>
  );
}
