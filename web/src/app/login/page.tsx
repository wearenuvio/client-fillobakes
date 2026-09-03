import * as React from "react";
import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { InkArt } from "@/components/ui/InkArt";
import { LoginForm } from "@/components/pages/account/LoginForm";

const PATH = "/login";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The one screen on this site that is centred, because there is exactly one
 * thing on it and nowhere else for the eye to go.
 */
export default function LoginPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Sign in", path: PATH }]} />
      {/* No page header here: this is the one screen with a single thing on
          it, and a full-width head would give the eye somewhere else to go.
          The drawing carries the page instead. */}
      <div className="relative overflow-hidden bg-paper">
        <InkArt
          name="wheat-pair"
          width={260}
          opacity={0.14}
          parallax
          className="top-12 right-6 hidden lg:block"
        />
        <div className="container-content flex min-h-[calc(100vh-var(--header-h)-1px)] items-center justify-center py-16">
          <React.Suspense fallback={null}>
            <LoginForm />
          </React.Suspense>
        </div>
      </div>
    </>
  );
}
