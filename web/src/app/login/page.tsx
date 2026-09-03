import * as React from "react";
import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
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
      <div className="relative overflow-hidden bg-paper">
        <span aria-hidden="true" className="lineart" />
        <div className="container-content flex min-h-[calc(100vh-var(--header-h)-1px)] items-center justify-center py-16">
          <React.Suspense fallback={null}>
            <LoginForm />
          </React.Suspense>
        </div>
      </div>
    </>
  );
}
