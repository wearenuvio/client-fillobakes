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
    <>
      <TopMarquee />

      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-line bg-paper/95 backdrop-blur-[10px]">
      {/* A three-column grid from 1024 with equal `1fr` sides, so the nav is
          centred on the header rather than on whatever space the logo and the
          action cluster happen to leave. Those two are different widths — a
          wordmark against four icons and a button — so a flex row with a
          `flex-1` nav in the middle centres the nav in the gap and pushes it
          visibly left of true centre. Below 1024 it stays a flex row: there
          is no nav to centre. */}
      <div className="container-content flex h-16 items-center gap-3 lg:grid lg:h-[72px] lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
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
            width={128}
            height={128}
            priority
            sizes="44px"
            className="size-9 object-contain lg:size-11"
          />
          {/* Just "fillo" beside a mark this size: the full name twice over,
              in the logo and again in type, was the widest thing in a 72px
              header. The footer wordmark still says it in full. */}
          <span className="font-display text-[26px] leading-none lowercase text-ink">
            fillo
          </span>
        </Link>

        {/* -------- Nav, centred at ≥1024 ------------------------------ */}
        <nav aria-label="Main" className="hidden justify-center lg:flex">
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
        <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:justify-self-end lg:gap-1">
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
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* The top marquee                                                            */
/* -------------------------------------------------------------------------- */

const MARQUEE = [
  "Fresh from the van, every morning",
  "Free delivery over \u20B9499",
  "Catch the van, pay no delivery fee",
  "The Standing Order: your bread, every week",
  "Bengaluru, Tue to Sun",
] as const;

/**
 * The strip above the header — 28px of chocolate carrying the five things
 * worth saying before anyone has scrolled.
 *
 * It scrolls away with the page; only the header is sticky, so the promises
 * are a greeting rather than a permanent band eating 28px of every screen.
 *
 * The track is rendered twice and translated by exactly half its own width,
 * which is what makes the loop seamless: at -50% the second copy sits exactly
 * where the first one started. Hovering pauses it, so nobody has to chase a
 * line they wanted to read. Under reduced motion `motion-safe` never applies
 * the animation and the strip is simply a static line.
 */
function TopMarquee() {
  const track = (
    <ul
      aria-hidden="true"
      className="flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap"
    >
      {MARQUEE.map((item) => (
        <li key={item} className="flex items-center gap-8">
          <span>{item}</span>
          <span aria-hidden="true" className="text-on-choc/40">
            &middot;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-surface="dark"
      className="group flex h-7 items-center overflow-hidden bg-choc text-[12px] font-medium tracking-[0.12em] text-on-choc uppercase"
    >
      {/* The list is decorative repetition; one readable copy is exposed to
          assistive technology and the visible tracks are hidden from it. */}
      <p className="sr-only">{MARQUEE.join(". ")}.</p>
      <div className="flex motion-safe:animate-[marquee_38s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]">
        {track}
        {track}
      </div>
    </div>
  );
}
