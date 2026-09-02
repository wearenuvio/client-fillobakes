import { Tbc } from "@/components/pages/home/Tbc";

/**
 * Trust strip — site-content "Page: Home" §4.
 *
 * A hairline-bounded row of four claims directly under the hero. The eggless
 * claim is deliberately NOT the headline (abstention labels depress choice
 * when they lead); it lives here, as a persistent badge, where the people
 * looking for it will find it.
 *
 * The FSSAI licence number is a founder placeholder, so the row says so
 * rather than printing a plausible fourteen digits.
 */

/** The legal green vegetarian mark: a filled circle inside a square outline. */
function VegMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="1"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="3.6" fill="var(--color-success)" />
    </svg>
  );
}

const CLAIMS = [
  { label: "No preservatives" },
  { label: "Baked the morning it goes out" },
] as const;

export function TrustStrip() {
  return (
    <div className="bg-paper-50">
      <div className="container-content">
        <ul className="flex flex-col divide-y divide-paper-300 border-y border-y-paper-300 sm:flex-row sm:divide-x sm:divide-y-0">
          <li className="micro flex items-center gap-2 py-4 text-ink-600 sm:flex-1 sm:justify-center sm:px-4">
            <VegMark />
            100% eggless
          </li>
          {CLAIMS.map((claim) => (
            <li
              key={claim.label}
              className="micro flex items-center py-4 text-ink-600 sm:flex-1 sm:justify-center sm:px-4"
            >
              {claim.label}
            </li>
          ))}
          <li className="micro flex items-center gap-2 py-4 text-ink-600 sm:flex-1 sm:justify-center sm:px-4">
            FSSAI licence <Tbc what="The FSSAI licence number" />
          </li>
        </ul>
      </div>
    </div>
  );
}
