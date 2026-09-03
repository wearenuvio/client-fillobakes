import * as React from "react";
import { AccountNav } from "@/components/pages/account/AccountNav";

/**
 * The account shell — PAGES-v2 Account.
 *
 * A phone gets the tab rail directly under the header and the screen full
 * width; from 1024 the rail becomes a quiet left list and the screen takes
 * nine of twelve columns. Never centred.
 */
export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-paper pt-6 pb-[var(--section-y)] lg:pt-10">
      <div className="container-content">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-3">
            <AccountNav />
          </div>
          <div className="min-w-0 lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
