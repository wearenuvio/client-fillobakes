import * as React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The v2 form kit.
 *
 * `ui/Field` is still on the v1 geometry — 4px radius, the darker paper-400
 * hairline, a caps label glued to every control — and it is shared with pages
 * this pass does not own, so it is left alone and this is what the rebuilt
 * pages use instead. It is the same object as the shop's search field and the
 * home newsletter input: a 48px control, 8px radius, the `--color-line`
 * hairline on the card ground, and a label in the site's own label layer.
 *
 * It lives under `content/` because the contact and franchise forms are its
 * first callers; the account screens import it rather than growing a second
 * kit that would drift from this one within a week.
 */

export function FieldLabel({
  className,
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...rest}
      className={cn(
        "mb-2 block text-[12px] font-medium tracking-[0.12em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </label>
  );
}

const CONTROL =
  "w-full rounded-md border border-line bg-card px-3.5 text-body text-ink " +
  "placeholder:text-muted transition-colors duration-[var(--dur-fast)] " +
  "hover:border-muted focus:border-ink focus:outline-none " +
  "disabled:bg-paper-2 disabled:text-muted";

const INVALID = "border-accent hover:border-accent focus:border-accent";

export function TextField({
  label,
  id,
  helper,
  error,
  prefix,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
  id: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  /** The fixed "+91" on a phone field, behind a hairline. */
  prefix?: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {prefix ? (
        <div
          className={cn(
            "flex h-12 items-stretch overflow-hidden rounded-md border border-line bg-card",
            "focus-within:border-ink",
            error && "border-accent",
          )}
        >
          <span className="flex items-center border-r border-line px-3.5 text-body text-muted tabular">
            {prefix}
          </span>
          <input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
            {...rest}
            className="min-w-0 flex-1 bg-transparent px-3.5 text-body text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
      ) : (
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          {...rest}
          className={cn(CONTROL, "h-12", error && INVALID)}
        />
      )}
      <FieldFoot id={id} helper={helper} error={error} />
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  helper,
  error,
  rows = 5,
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: React.ReactNode;
  id: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        {...rest}
        className={cn(CONTROL, "resize-y py-3 leading-relaxed", error && INVALID)}
      />
      <FieldFoot id={id} helper={helper} error={error} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  helper,
  error,
  children,
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: React.ReactNode;
  id: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          {...rest}
          className={cn(CONTROL, "h-12 appearance-none pr-11", error && INVALID)}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
        />
      </div>
      <FieldFoot id={id} helper={helper} error={error} />
    </div>
  );
}

function FieldFoot({
  id,
  helper,
  error,
}: {
  id: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
}) {
  if (error) {
    return (
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 flex items-start gap-1.5 text-body-sm text-accent"
      >
        <AlertCircle
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        />
        <span>{error}</span>
      </p>
    );
  }
  if (helper) {
    return (
      <p id={`${id}-helper`} className="mt-2 text-body-sm text-muted">
        {helper}
      </p>
    );
  }
  return null;
}

/** A checkbox row: the label is the target, and the target is 44px tall. */
export function CheckRow({
  id,
  label,
  description,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn("flex min-h-11 cursor-pointer items-start gap-3 py-2", className)}
    >
      <input
        id={id}
        type="checkbox"
        {...rest}
        className="mt-1 size-[18px] shrink-0 accent-[var(--color-accent)]"
      />
      <span className="min-w-0">
        <span className="block text-body text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-body-sm text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/**
 * A switch row: label, one line of help, and the control on the right. A
 * locked switch stays visible and says why rather than disappearing — a
 * setting you cannot see is a setting you do not trust.
 */
export function SwitchRow({
  id,
  label,
  helper,
  checked,
  locked = false,
  lockedCopy,
  onCheckedChange,
  className,
}: {
  id: string;
  label: React.ReactNode;
  helper?: React.ReactNode;
  checked: boolean;
  locked?: boolean;
  lockedCopy?: React.ReactNode;
  onCheckedChange?: (next: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-5 py-4", className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-body text-ink">{label}</span>
        {helper ? (
          <span className="mt-1 block max-w-[46ch] text-body-sm text-muted">
            {helper}
          </span>
        ) : null}
        {locked && lockedCopy ? (
          <span className="mt-1 block max-w-[46ch] text-body-sm text-muted">
            {lockedCopy}
          </span>
        ) : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={locked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative mt-1 h-6 w-11 shrink-0 rounded-pill border transition-colors",
          "duration-[var(--dur-base)] ease-[var(--ease-standard)]",
          checked ? "border-accent bg-accent" : "border-line bg-well",
          locked && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-[3px] size-4 rounded-pill bg-card transition-[left]",
            "duration-[var(--dur-base)] ease-[var(--ease-standard)]",
            checked ? "left-[23px]" : "left-[3px]",
          )}
        />
      </button>
    </div>
  );
}

/** A row of pill choices: one decision, never more than four options. */
export function PillChoice<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; note?: string }[];
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      <div role="radiogroup" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <span key={option.id} className="flex flex-col">
            <button
              type="button"
              role="radio"
              aria-checked={option.id === value}
              onClick={() => onChange(option.id)}
              className={cn(
                "h-11 rounded-md border px-4 text-body-sm transition-colors",
                "duration-[var(--dur-fast)]",
                option.id === value
                  ? "border-accent bg-accent font-semibold text-on-accent"
                  : "border-line bg-card text-ink hover:border-ink",
              )}
            >
              {option.label}
            </button>
            {option.note ? (
              <span className="mt-1 max-w-[18ch] text-body-sm text-muted">
                {option.note}
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
