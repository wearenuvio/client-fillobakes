"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { getAddresses, getArea, resolveAreaQuery, type Address } from "@/lib/mock";
import { Panel } from "@/components/pages/account/Panel";
import { TextField, CheckRow } from "@/components/pages/content/Form";
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
        <div className="rounded-lg border border-line bg-card px-6 py-16 text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block w-fit opacity-20">
            <LoafGlyph size={88} />
          </span>
          <p className="font-display text-[26px] leading-tight text-ink">
            No addresses saved.
          </p>
          <p className="mx-auto mt-2 max-w-[38ch] text-body text-ink-2">
            Add one and we will tell you which day the van reaches it.
          </p>
          <Button className="mt-7" onClick={() => setEditing(toDraft())}>
            Add an address
          </Button>
        </div>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => {
              const badge = badgeFor(address);
              return (
                <li key={address.id}>
                  <Panel as="div" className="flex h-full flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="font-display text-[22px] leading-snug text-ink">
                        {address.label}
                      </p>
                      {address.isDefault ? (
                        <Badge variant="outline">Default</Badge>
                      ) : null}
                    </div>
                    <address className="mt-3 flex-1 text-body-sm text-ink-2 not-italic">
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
                        "mt-4 flex items-start gap-2 text-body-sm",
                        badge.tone === "muted" ? "text-muted" : "text-ink-2",
                      )}
                    >
                      {badge.tone === "tint" ? (
                        <MapPin
                          size={16}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                      ) : (
                        <Truck
                          size={16}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                      )}
                      {badge.label}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(toDraft(address))}
                        className="link-underline text-body-sm font-semibold text-accent"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemoving(address)}
                        className="link-underline text-body-sm font-semibold text-accent"
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
                          className="link-underline text-body-sm font-semibold text-accent"
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

      <p className="text-body-sm text-muted">
        Not on the route yet?{" "}
        <Link href="/areas" className="link-underline font-semibold text-accent">
          See where the van goes
        </Link>
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
      <div className="mt-6 flex flex-col gap-5">
        <TextField
          id="addr-label"
          label="Label"
          helper="Home, Amma's, the office."
          value={value.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="Home"
        />
        <TextField
          id="addr-flat"
          label="Flat or house number"
          value={value.blockAndFlat}
          onChange={(e) => set("blockAndFlat", e.target.value)}
          placeholder="B Block, 402"
        />
        <TextField
          id="addr-society"
          label="Apartment or building"
          value={value.society}
          onChange={(e) => set("society", e.target.value)}
          placeholder="Sundarban Apartments"
        />
        <TextField
          id="addr-street"
          label="Street"
          value={value.street}
          onChange={(e) => set("street", e.target.value)}
          placeholder="12th Main"
        />
        <TextField
          id="addr-landmark"
          label="Landmark"
          helper="Whatever you would say on the phone. This is the line the rider reads."
          value={value.landmark}
          onChange={(e) => set("landmark", e.target.value)}
          placeholder="Opposite the Ramamurthy Nagar bus stand"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="addr-area"
            label="Area"
            helper={
              notServed
                ? `We do not reach ${value.area} yet. Save it anyway and we will tell you when the route changes.`
                : (area?.answer ?? "Indiranagar, Banaswadi, HSR Layout and more.")
            }
            value={value.area}
            onChange={(e) => set("area", e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Indiranagar"
          />
          <TextField
            id="addr-pin"
            label="Pincode"
            helper="Fills the area in for you."
            value={value.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            className="[&_input]:tabular"
            placeholder="560038"
          />
        </div>
        <TextField
          id="addr-leave"
          label="Leave it with"
          helper="Optional."
          value={value.leaveItWith}
          onChange={(e) => set("leaveItWith", e.target.value)}
          placeholder="Security, if nobody answers"
        />
        <CheckRow
          id="addr-default"
          label="Make this my default"
          checked={value.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
        />
      </div>
    </Dialog>
  );
}
