"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * The account nav — DESIGN-v2 §6 ("scrollable tabs with edge fade") and the
 * PAGES-v2 account spec: a scroll rail of tabs on a phone, a quiet left list
 * from 1024 up.
 *
 * The tabs are the shop's tabs, deliberately: one tab pattern for the whole
 * site. Terracotta marks the page you are on, every target is 44px, and the
 * fade at the right edge is what tells a thumb there is more.
 */

export const ACCOUNT_NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/subscription", label: "Standing order" },
  { href: "/account/rewards", label: "Rewards" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/alerts", label: "Alerts" },
  { href: "/account/gift-cards", label: "Gift cards" },
  { href: "/account/settings", label: "Settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountNav() {
  const pathname = usePathname() ?? "/account";

  return (
    <nav aria-label="Account">
      {/* ---- 1024 and up: the quiet left list ------------------------- */}
      <ul className="hidden lg:block">
        {ACCOUNT_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="relative">
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-0 w-[2px] rounded-pill bg-accent"
                />
              ) : null}
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center py-2 pl-4 text-body-sm",
                  "transition-colors duration-[var(--dur-fast)]",
                  active
                    ? "font-semibold text-ink"
                    : "text-ink-2 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="mt-4 border-t border-line pt-3 pl-4">
          <Link
            href="/logout"
            className="link-underline flex min-h-11 items-center text-body-sm text-muted hover:text-ink"
          >
            Sign out
          </Link>
        </li>
      </ul>

      {/* ---- Below 1024: the scroll rail ------------------------------ */}
      <div className="relative lg:hidden">
        <div className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] py-1">
          {ACCOUNT_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-pill border px-4 text-body-sm whitespace-nowrap",
                  "transition-colors duration-[var(--dur-base)]",
                  active
                    ? "border-accent bg-accent font-semibold text-on-accent"
                    : "border-line bg-card text-ink-2",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/logout"
            className="inline-flex h-11 items-center rounded-pill border border-line bg-card px-4 text-body-sm whitespace-nowrap text-muted"
          >
            Sign out
          </Link>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[calc(var(--gutter)*-1)] w-12 bg-linear-to-l from-paper to-transparent"
        />
      </div>
    </nav>
  );
}
