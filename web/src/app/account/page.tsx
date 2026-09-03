import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage, AreaChipStatic } from "@/components/pages/account/AccountPage";
import { AccountHome } from "@/components/pages/account/AccountHome";
import { accountChipLabel } from "@/components/pages/account/orderData";
import { DASHBOARD_STATES, pickState } from "@/components/pages/account/states";
import { getCustomer } from "@/lib/mock";

const PATH = "/account";

export const metadata: Metadata = buildMetadata(PATH);

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AccountDashboardPage({ searchParams }: Search) {
  const params = await searchParams;
  const state = pickState(DASHBOARD_STATES, params.state, "default");
  const customer = getCustomer();

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Account", path: PATH }]} />
      <AccountPage
        art="anpan-bun"
        h1={`Hey ${customer.name}.`}
        kicker="Your account"
        chip={state === "new" ? undefined : <AreaChipStatic label={accountChipLabel()} />}
      >
        <AccountHome state={state} />
      </AccountPage>
    </>
  );
}
