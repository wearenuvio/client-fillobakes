import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { GiftCards } from "@/components/pages/account/GiftCards";
import { GIFT_CARD_STATES, pickState } from "@/components/pages/account/states";

const PATH = "/account/gift-cards";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AccountGiftCardsPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(GIFT_CARD_STATES, params.state, "default");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Gift cards", path: PATH },
        ]}
      />
      <AccountPage
        h1="Gift cards"
        kicker="Your account"
        lead="The ones you've sent, and the ones sent to you. A balance comes off your next order on its own."
      >
        <GiftCards state={state} />
      </AccountPage>
    </>
  );
}
