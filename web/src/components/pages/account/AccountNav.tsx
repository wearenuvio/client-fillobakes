"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * The account nav — a left rail at ≥1024, a scroll rail of chips below,
 * mirroring the CategoryFilter geometry in DESIGN.md §12.6 so the account
 * area does not invent a second navigation pattern.
 */

export const ACCOUNT_NAV = [
  { href: "/account", label: "Account home" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/subscription", label: "Standing order" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/rewards", label: "Rewards" },
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
      {/* ≥1024 — the left rail. */}
      <ul className="hidden lg:block">
        {ACCOUNT_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="relative">
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 left-0 w-0.5 bg-ink-800"
                />
              ) : null}
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "micro flex min-h-11 items-center py-3 pl-4 transition-colors",
                  "duration-[var(--dur-fast)]",
                  active ? "text-ink-800" : "text-ink-600 hover:text-ink-800",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="mt-4 border-t border-paper-300 pt-2 pl-4">
          <Link
            href="/logout"
            className="micro link-underline flex min-h-11 items-center text-ink-600 hover:text-ink-800"
          >
            Sign out
          </Link>
        </li>
      </ul>

      {/* <1024 — the scroll rail, bleeding to the viewport edge. */}
      <div className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] lg:hidden">
        {ACCOUNT_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "micro flex h-11 items-center rounded-sm px-4 whitespace-nowrap",
                "transition-colors duration-[var(--dur-fast)]",
                active
                  ? "bg-ink-800 text-paper-0"
                  : "border border-paper-300 text-ink-600",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/logout"
          className="micro flex h-11 items-center rounded-sm border border-paper-300 px-4 whitespace-nowrap text-ink-600"
        >
          Sign out
        </Link>
      </div>
    </nav>
  );
}
