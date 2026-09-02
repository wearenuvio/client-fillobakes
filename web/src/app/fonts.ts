import { Instrument_Serif, Hanken_Grotesk, Caveat } from "next/font/google";

/**
 * The three Latin families named in DESIGN-v2 §1. Each exposes a CSS variable
 * that globals.css's `--font-display` / `--font-sans` / `--font-script`
 * references.
 *
 * DM Mono is gone. v2 has no monospace on any customer-facing surface — the
 * label layer is Hanken caps at 500, not a mono tag system.
 */

/** Display. Ships only weight 400 — which is what enforces §1's "always 400". */
export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Body / UI / labels. Variable 100–900; the system uses 400, 500, 600. */
export const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The signature script. Appears at most once per page, always terracotta,
 * always directly above a display headline (§1).
 */
export const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * Kana — Zen Kaku Gothic New (§12.26) — is NOT loaded through next/font.
 *
 * next/font only exposes this family's `latin`, `latin-ext` and `cyrillic`
 * subsets, so a next/font copy would ship no kana at all and every KanaLabel
 * would fall back to whatever Japanese face the device happens to have (on
 * most Android and Windows machines: none, i.e. tofu). Instead the family is
 * loaded from the Google Fonts stylesheet in the root layout, which serves the
 * Japanese subset split by `unicode-range` — so the kana chunks download only
 * on pages that actually render kana. `--font-kana` in globals.css names the
 * family directly, with a device fallback stack behind it.
 */
export const KANA_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500&display=swap";

export const fontVariables = [
  instrumentSerif.variable,
  hankenGrotesk.variable,
  caveat.variable,
].join(" ");
