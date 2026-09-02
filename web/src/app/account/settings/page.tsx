import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { SettingsPanel } from "@/components/pages/account/SettingsPanel";

const PATH = "/account/settings";

export const metadata: Metadata = buildMetadata(PATH);

export default function SettingsPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Settings", path: PATH },
        ]}
      />
      <AccountPage
        h1="Settings"
        kicker="Your account"
        lead="Your number is your account. Everything else here is optional."
      >
        <SettingsPanel />
      </AccountPage>
    </>
  );
}
