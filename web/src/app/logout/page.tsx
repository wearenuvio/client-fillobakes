import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { LogoutPanel } from "@/components/pages/account/LogoutPanel";

const PATH = "/logout";

export const metadata: Metadata = buildMetadata(PATH);

export default function LogoutPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Signed out", path: PATH }]} />
      <Section surface="paper-50" width="narrow">
        <p className="micro text-kiln">Fillo+</p>
        <LogoutPanel />
      </Section>
    </>
  );
}
