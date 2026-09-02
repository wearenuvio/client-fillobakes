"use client";

import * as React from "react";
import { MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { getAddresses, getArea, resolveAreaQuery, type Address } from "@/lib/mock";
import { Panel } from "@/components/pages/account/Panel";
import type { AddressState } from "@/components/pages/account/states";

/**
 * Addresses — site-content "Screen: Addresses".
 *
 * India-shaped fields: society or building, block and flat, landmark, area.
 * Never "Address line 1 / line 2" — nobody in Bengaluru navigates that way,
 * and the landmark is the field the rider actually uses.
 *
 * An unserviceable address is saved anyway, with a plain line about it. Not
 * served is a route we have not reached, not an error.
 */

type Draft = {
  id: string;
  label: string;
  blockAndFlat: string;
  society: string;
  street: string;
  landmark: string;
  area: string;
  pincode: string;
  leaveItWith: string;
  isDefault: boolean;
};

type StoredAddress = Address & { street?: string };

function toDraft(address?: StoredAddress): Draft {
  return {
    id: address?.id ?? "",
    label: address?.label ?? "",
    blockAndFlat: address?.blockAndFlat ?? "",
    society: address?.society ?? "",
    street: address?.street ?? "",
    landmark: address?.landmark ?? "",
    area: address?.area ?? "",
    pincode: address?.pincode ?? "",
    leaveItWith: address?.leaveItWith ?? "",
    isDefault: address?.isDefault ?? false,
  };
}

function badgeFor(address: StoredAddress): { label: string; tone: "success" | "tint" | "muted" } {
  const raw = address as unknown as { serviceabilityBadge?: string };
  if (!address.serviceable) return { label: "Not served yet", tone: "muted" };
  if (raw.serviceabilityBadge) {
    return {
      label: raw.serviceabilityBadge,
      tone: raw.serviceabilityBadge.toLowerCase().startsWith("catch") ? "tint" : "success",
    };
  }
  return { label: "Home delivery ₹49", tone: "success" };
}

export function AddressBook({ state = "default" }: { state?: AddressState }) {
  const { toast } = useToast();
  const [addresses, setAddresses] = React.useState<StoredAddress[]>(
    state === "empty" ? [] : (getAddresses() as StoredAddress[]),
  );
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [removing, setRemoving] = React.useState<StoredAddress | null>(null);
  const [busy, setBusy] = React.useState(false);

  function save(draft: Draft) {
    const area = resolveAreaQuery(draft.area) ?? getArea(draft.pincode);
    const serviceable = area ? area.serviceability !== "not_yet" : false;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setAddresses((current) => {
        const next: StoredAddress = {
          id: draft.id || `addr_${Date.now()}`,
          label: draft.label || "Home",
          isDefault: draft.isDefault || current.length === 0,
          society: draft.society,
          blockAndFlat: draft.blockAndFlat,
          street: draft.street,
          landmark: draft.landmark || null,
          area: area?.name ?? draft.area,
          pincode: area?.pincode ?? draft.pincode,
          leaveItWith: draft.leaveItWith || null,
          serviceable,
          routeId: area?.routeId ?? "",
          routeLine: area?.answer ?? "",
          availableWindows: area?.windows ?? [],
        };
        const cleared = current.map((a) =>
          next.isDefault ? { ...a, isDefault: false } : a,
        );
        const exists = cleared.some((a) => a.id === next.id);
        return exists
          ? cleared.map((a) => (a.id === next.id ? next : a))
          : [...cleared, next];
      });
      setEditing(null);
      toast({
        message: serviceable
          ? `Saved. ${area?.answer ?? "We'll tell you which day the van reaches it."}`
          : `Saved. We don't reach ${draft.area} yet — we'll tell you when the route changes.`,
      });
    }, 500);
  }

  return (
    <div className="flex flex-col gap-6">
      {addresses.length === 0 ? (
        <EmptyState
          glyph={<LoafGlyph size={96} />}
          title="No addresses saved."
          body="Add one and we'll tell you which day the van reaches it."
          action={<Button onClick={() => setEditing(toDraft())}>Add an address</Button>}
        />
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => {
              const badge = badgeFor(address);
              return (
                <li key={address.id}>
                  <Panel as="div" className="flex h-full flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-title text-ink-800">{address.label}</p>
                      {address.isDefault ? (
                        <Badge variant="outline">Default</Badge>
                      ) : null}
                    </div>
                    <address className="mt-3 flex-1 text-body-sm text-ink-600 not-italic">
                      {address.blockAndFlat}, {address.society}
                      <br />
                      {address.landmark ? (
                        <>
                          {address.landmark}
                          <br />
                        </>
                      ) : null}
                      {address.area} <span className="tabular">{address.pincode}</span>
                      {address.leaveItWith ? (
                        <>
                          <br />
                          Leave it with: {address.leaveItWith}
                        </>
                      ) : null}
                    </address>
                    <p
                      className={cn(
                        "mt-4 flex items-start gap-2 text-caption",
                        badge.tone === "success" ? "text-success" : "text-ink-600",
                      )}
                    >
                      {badge.tone === "tint" ? (
                        <MapPin size={16} strokeWidth={1.5} className="mt-px shrink-0" aria-hidden="true" />
                      ) : (
                        <Truck size={16} strokeWidth={1.5} className="mt-px shrink-0" aria-hidden="true" />
                      )}
                      {badge.label}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-paper-300 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(toDraft(address))}
                        className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemoving(address)}
                        className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                      >
                        Remove
                      </button>
                      {!address.isDefault ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAddresses((current) =>
                              current.map((a) => ({ ...a, isDefault: a.id === address.id })),
                            );
                            toast({ message: `${address.label} is your default now.` });
                          }}
                          className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                        >
                          Make default
                        </button>
                      ) : null}
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ul>
          <div>
            <Button variant="secondary" onClick={() => setEditing(toDraft())}>
              Add an address
            </Button>
          </div>
        </>
      )}

      <AddressDialog
        draft={editing}
        busy={busy}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={removing ? `Remove ${removing.label}?` : "Remove this address?"}
        description={
          removing?.isDefault
            ? "Your standing order goes there on Saturdays. Removing it means picking another one."
            : "Nothing already on the van changes. You can add it back any time."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const target = removing;
                setRemoving(null);
                if (!target) return;
                setAddresses((current) => {
                  const rest = current.filter((a) => a.id !== target.id);
                  if (target.isDefault && rest.length) rest[0] = { ...rest[0], isDefault: true };
                  return rest;
                });
                toast({
                  message: target.isDefault
                    ? `${target.label} removed. Your standing order moved to the next address.`
                    : `${target.label} removed.`,
                });
              }}
            >
              {removing?.isDefault ? "Remove and pick another" : "Remove it"}
            </Button>
          </>
        }
      />

      <p className="text-caption text-ink-500">
        Not on the route yet?{" "}
        <ButtonLink href="/areas" variant="ghost" size="sm">
          See where the van goes
        </ButtonLink>
      </p>
    </div>
  );
}

function AddressDialog({
  draft,
  busy,
  onClose,
  onSave,
}: {
  draft: Draft | null;
  busy: boolean;
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const [value, setValue] = React.useState<Draft>(draft ?? toDraft());
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (draft) {
      setValue(draft);
      setTouched(false);
    }
  }, [draft]);

  const area = resolveAreaQuery(value.area);
  const notServed = touched && value.area.length > 2 && (!area || area.serviceability === "not_yet");
  const missing = !value.blockAndFlat || !value.society || !value.area;

  function set<K extends keyof Draft>(key: K, next: Draft[K]) {
    setValue((current) => ({ ...current, [key]: next }));
  }

  return (
    <Dialog
      open={draft !== null}
      onClose={onClose}
      title={draft?.id ? "Edit this address" : "Add an address"}
      description="The landmark is the field the rider actually uses, so it earns its own line."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={busy}
            disabled={missing}
            onClick={() => {
              setTouched(true);
              onSave(value);
            }}
          >
            {notServed ? "Save anyway" : "Save this address"}
          </Button>
        </>
      }
    >
      <div className="mt-6 flex flex-col gap-4">
        <Field label="Label" htmlFor="addr-label" helper="Home, Amma's, the office.">
          <Input
            id="addr-label"
            value={value.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Home"
          />
        </Field>
        <Field label="Flat or house number" htmlFor="addr-flat">
          <Input
            id="addr-flat"
            value={value.blockAndFlat}
            onChange={(e) => set("blockAndFlat", e.target.value)}
            placeholder="B Block, 402"
          />
        </Field>
        <Field label="Apartment or building name" htmlFor="addr-society">
          <Input
            id="addr-society"
            value={value.society}
            onChange={(e) => set("society", e.target.value)}
            placeholder="Sundarban Apartments"
          />
        </Field>
        <Field label="Street" htmlFor="addr-street">
          <Input
            id="addr-street"
            value={value.street}
            onChange={(e) => set("street", e.target.value)}
            placeholder="12th Main"
          />
        </Field>
        <Field
          label="Landmark"
          htmlFor="addr-landmark"
          helper="Opposite the Nandini booth, behind the water tank — whatever you would say on the phone."
        >
          <Input
            id="addr-landmark"
            value={value.landmark}
            onChange={(e) => set("landmark", e.target.value)}
            placeholder="Opposite the Ramamurthy Nagar bus stand"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Area"
            htmlFor="addr-area"
            helper={
              notServed
                ? `We don't reach ${value.area} yet. You can still save this, and we'll tell you when the route changes.`
                : (area?.answer ?? "Indiranagar, Banaswadi, HSR Layout and more.")
            }
          >
            <Input
              id="addr-area"
              value={value.area}
              onChange={(e) => set("area", e.target.value)}
              onBlur={() => setTouched(true)}
              leadingIcon={<MapPin size={20} strokeWidth={1.5} />}
              placeholder="Indiranagar"
            />
          </Field>
          <Field label="Pincode" htmlFor="addr-pin" helper="Fills the area in for you.">
            <Input
              id="addr-pin"
              value={value.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              className="font-mono tabular"
              placeholder="560038"
            />
          </Field>
        </div>
        <Field label="City" htmlFor="addr-city">
          <Input id="addr-city" value="Bengaluru" readOnly disabled />
        </Field>
        <Field label="Leave it with" htmlFor="addr-leave" helper="Optional.">
          <Input
            id="addr-leave"
            value={value.leaveItWith}
            onChange={(e) => set("leaveItWith", e.target.value)}
            placeholder="Security, if nobody answers"
          />
        </Field>
        <Checkbox
          label="Make this my default"
          checked={value.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
        />
      </div>
    </Dialog>
  );
}
