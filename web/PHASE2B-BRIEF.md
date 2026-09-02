# Phase 2b brief — page build agents (shared rules)

Five agents build pages in parallel in this repo. Follow this exactly to avoid conflicts.

## Read first (in order)
1. `research/DECISIONS.md` (binding decisions + FINAL ROUTE MAP)
2. `web/README.md` (folder map, components, stores, conventions)
3. `design/DESIGN.md` (the design system; §12 component specs; do/don't lists)
4. `src-content/site-content.md` — ONLY the sections for your routes, plus "Global elements" and "Microcopy library"
5. `research/competitors/journey-recommendation.md` — ONLY the sections for your routes
6. Data: `web/src/lib/catalog.ts`, `web/src/lib/mock.ts`, `web/src/lib/format.ts`, `web/src/lib/images.ts`, `web/src/store/*`
7. Visit `/styleguide` in the dev server (`pnpm dev` in web/, port may vary; use the Browser pane / curl) to see every component and state before composing pages.
Load skills `frontend-design` and `vercel-react-best-practices` via the Skill tool before writing code.

## File ownership (hard rule)
- You may create/edit ONLY: the `page.tsx`/`layout.tsx`/`loading.tsx`/`not-found.tsx` files under YOUR routes, and new files under `web/src/components/pages/<your-group>/`.
- Do NOT edit `globals.css`, `components/ui/*`, `components/blocks/*`, `lib/*`, `store/*`, `data/*`, `next.config.ts`, `layout.tsx` at app root. If you need a change there, write it as a request in `web/PHASE2B-REQUESTS.md` (append a section with your group name) and work around it locally in your own components. Additive-only exception: you may add a NEW export to `lib/format.ts` only if it is a pure function and you append it at the end of the file.
- Never run `pnpm images`/`pnpm routes`, never install packages, never touch `public/`.
- Do not commit.

## Build rules
- Copy is in `src-content/site-content.md`; use it verbatim where given, adapt only for grammar. No emoji anywhere. No exclamation marks in UI. Sentence case. `₹` formatting via `lib/format.ts`. `[TBC]` strings rendered via the TBC helper, never rounded into a confident number.
- Tokens only (Tailwind theme classes / CSS vars from globals.css). No hex literals, no gradients, no soft shadows beyond the token set, Lucide icons only.
- Images: product cutouts via `lib/images.ts` (falls back automatically). Stock photos are under `/images/stock/<bucket>/<file>` — see `assets/stock/STOCK-INDEX.md` for suggested placements; use `next/image` with correct `sizes`, `priority` only on the LCP image. Product cutouts sit on paper/tinted wells per DESIGN.md §10.
- Lane ids are `catch_the_van` / `home_delivery`. Delivery ₹49 inside total, free over ₹499, free on van lane — `computeTotals(lines, lane)` in the cart store is the source of truth.
- Persisted store reads go behind `useCartHydrated()` / `useSessionHydrated()`.
- Never build a `Date` from fixture ISO strings; use `lib/format.ts`.
- `null` timestamp = not happened yet.
- Server components by default; `"use client"` only for interactivity. Mock interactions (OTP, pay, skip week, notify-me) should work locally with state + Toast and mock delays, no network.
- Every page: real `Metadata` via `lib/seo` (already wired in the placeholder, keep it), correct H1, responsive from 360px to 1440px, keyboard accessible, no horizontal scroll, no layout shift from images (always width/height or fill+aspect).
- Off-air tracker state and sold-out product state are primary states, never styled as errors.
- When done: `pnpm typecheck && pnpm lint && pnpm build` must pass (run from `web/`). Then open each of your routes in the Browser pane at desktop and 375px mobile and fix visual problems. Report: routes built, components created, any deviations from copy/design and why, and requests you logged.
