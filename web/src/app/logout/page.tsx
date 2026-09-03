import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { LogoutPanel } from "@/components/pages/account/LogoutPanel";

const PATH = "/logout";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Signing out is one question and one button. The stray "Fillo+" label that
 * used to sit above it is gone: this screen has nothing to do with the
 * membership, and a kicker that names the wrong thing is worse than none.
 */
export default function LogoutPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Signed out", path: PATH }]} />
      <div className="bg-paper">
        <div className="container-narrow py-16 lg:py-24">
          <LogoutPanel />
        </div>
      </div>
    </>
  );
}
