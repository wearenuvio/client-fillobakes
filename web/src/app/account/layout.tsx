import * as React from "react";
import { Section } from "@/components/blocks/Section";
import { AccountNav } from "@/components/pages/account/AccountNav";

/**
 * The account shell.
 *
 * A left rail at ≥1024 (3 of 12 columns) with the screen at 9 of 12; below
 * that the rail becomes a scroll rail of chips directly under the nav and the
 * screen runs full width. Never centred (DESIGN.md §13).
 */
export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Section surface="paper-50" size="default">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-3 xl:col-span-2">
          <AccountNav />
        </div>
        <div className="min-w-0 lg:col-span-9 xl:col-span-10">{children}</div>
      </div>
    </Section>
  );
}
