"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/images";
import { useCartStore, useCartHydrated } from "@/store/cart";

/**
 * Header — DESIGN-v2 §2.
 *
 * 72px, paper ground, one bottom hairline, sticky. Left: the logo mark and the
 * wordmark in the display serif. Centre: five links in quiet sans. Right:
 * search, account, cart with an accent count badge, and one accent "Order"
 * button.
 *
 * No ticker above it and no area chip inside it — where the van meets you is a
 * cart-drawer question in v2, not a piece of global chrome.
 */

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/standing-order", label: "Standing order" },
  { href: "/van", label: "The van" },
  { href: "/about", label: "Our story" },
  { href: "/journal", label: "Journal" },
] as const;

export function Header({ onOpenAreaSheet }: { onOpenAreaSheet?: () => void }) {
  void onOpenAreaSheet;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const hydrated = useCartHydrated();
  const count = hydrated ? lines.reduce((n, l) => n + l.qty, 0) : 0;

  React.useEffect(() => setMenuOpen(false), [pathname]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-line bg-paper/95 backdrop-blur-[10px]">
      <div className="container-content flex h-16 items-center gap-3 lg:h-[72px] lg:gap-6">
        {/* -------- Mobile: burger left -------------------------------- */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close the menu" : "Open the menu"}
          aria-expanded={menuOpen}
          className="-ml-2.5 grid size-11 shrink-0 place-items-center rounded-md text-ink hover:bg-veil lg:hidden"
        >
          {menuOpen ? (
            <X size={22} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>

        {/* -------- Logo + wordmark ------------------------------------ */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Fillo Bakes, home"
        >
          <Image
            src={BRAND.logoTransparent}
            alt=""
            width={64}
            height={64}
            priority
            className="size-8 object-contain"
          />
          <span className="font-display text-[22px] leading-none lowercase text-ink">
            fillo bakes
          </span>
        </Link>

        {/* -------- Nav, centred at ≥1024 ------------------------------ */}
        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-1 text-body-sm font-medium transition-colors duration-[var(--dur-fast)]",
                      active
                        ? "text-ink"
                        : "link-underline text-ink-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* -------- Right cluster -------------------------------------- */}
        <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-1">
          <Link
            href="/shop"
            aria-label="Search the menu"
            className="hidden size-11 place-items-center rounded-md text-ink hover:bg-veil sm:grid"
          >
            <Search size={20} strokeWidth={1.5} aria-hidden="true" />
          </Link>

          <Link
            href="/account"
            aria-label="Your account"
            className="hidden size-11 place-items-center rounded-md text-ink hover:bg-veil sm:grid"
          >
            <User size={20} strokeWidth={1.5} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={
              count > 0 ? `Your order, ${count} items` : "Your order, empty"
            }
            className="relative grid size-11 place-items-center rounded-md text-ink hover:bg-veil"
          >
            <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
            {count > 0 ? (
              <span className="absolute top-1 right-1 grid size-[18px] place-items-center rounded-pill bg-accent text-[10px] font-semibold text-on-accent tabular">
                {count}
              </span>
            ) : null}
          </button>

          <Link
            href="/shop"
            className={cn(
              "ml-2 hidden h-10 items-center rounded-md bg-accent px-5 text-body-sm font-semibold",
              "text-on-accent transition-[background-color,transform] duration-[var(--dur-base)]",
              "ease-[var(--ease-standard)] hover:bg-accent-hover hover:-translate-y-px sm:inline-flex",
            )}
          >
            Order
          </Link>
        </div>
      </div>

      {/* -------- Mobile menu: full-height paper panel ----------------- */}
      {menuOpen ? (
        <div className="absolute inset-x-0 top-full z-[var(--z-sticky)] h-[calc(100dvh-100%)] overflow-y-auto border-t border-line bg-paper lg:hidden">
          <nav aria-label="Main" className="container-content py-10">
            <ul className="flex flex-col gap-5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-[30px] leading-tight text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/account"
                  className="font-display text-[30px] leading-tight text-ink"
                >
                  Account
                </Link>
              </li>
            </ul>
            <Link
              href="/shop"
              className="mt-10 inline-flex h-12 items-center rounded-md bg-accent px-6 text-body font-semibold text-on-accent"
            >
              Order for tomorrow
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
