import * as React from "react";
import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { LoginForm } from "@/components/pages/account/LoginForm";

const PATH = "/login";

export const metadata: Metadata = buildMetadata(PATH);

export default function LoginPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Sign in", path: PATH }]} />
      <Section surface="paper-50" width="narrow">
        <p className="micro text-kiln">Fillo+</p>
        <h1 className="mt-4 text-display-lg text-ink-800">Sign in</h1>
        <div className="mt-10">
          <React.Suspense fallback={null}>
            <LoginForm />
          </React.Suspense>
        </div>
      </Section>
    </>
  );
}
