"use client";

import { useState } from "react";
import { X, Hand, Gear, ArrowsLeftRight, CheckCircle, SlidersHorizontal } from "@phosphor-icons/react";
import { type HalalFilter, EMPTY_HALAL_FILTER } from "@/lib/halal-filter";
import { QUICK_FILTERS } from "@/lib/collections";
import { useModalDialog } from "@/lib/useModalDialog";
import { cn } from "@/lib/cn";

const SLAUGHTER = [
  { value: "hand_slaughtered", label: "Zabiha", sub: "Hand slaughtered", icon: Hand },
  { value: "machine_slaughtered", label: "Machine", sub: "Mechanical blade", icon: Gear },
  { value: "mixed", label: "Mixed", sub: "Multiple sources", icon: ArrowsLeftRight },
] as const;

const STUNNING = [
  { value: "non_stunned", label: "Non-stunned", sub: "Fully conscious" },
  { value: "stunned_reversible", label: "Reversible", sub: "Low voltage" },
  { value: "stunned", label: "Pre-stunned", sub: "Stunned first" },
] as const;

export interface FiltersState {
  halal: HalalFilter;
  quick: string[];
}

/**
 * The single Filters sheet — one button, one place. Quick filters up top (the
 * old collection lenses), then the halal standard (slaughter → optional
 * stunning → verified). Edits stay local until Apply.
 */
export function FiltersSheet({
  open,
  initial,
  onApply,
  onClose,
}: {
  open: boolean;
  initial: FiltersState;
  onApply: (f: FiltersState) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return <FiltersDialog initial={initial} onApply={onApply} onClose={onClose} />;
}

function FiltersDialog({
  initial,
  onApply,
  onClose,
}: {
  initial: FiltersState;
  onApply: (f: FiltersState) => void;
  onClose: () => void;
}) {
  const [halal, setHalal] = useState<HalalFilter>(initial.halal);
  const [quick, setQuick] = useState<string[]>(initial.quick);
  const panelRef = useModalDialog<HTMLDivElement>(onClose);

  const toggleQuick = (key: string) =>
    setQuick((q) => (q.includes(key) ? q.filter((k) => k !== key) : [...q, key]));

  const pickSlaughter = (v: string) =>
    setHalal((d) => {
      const slaughter = d.slaughter === v ? null : v;
      return { ...d, slaughter, stunning: slaughter ? d.stunning : null };
    });
  const pickStunning = (v: string) =>
    setHalal((d) => ({ ...d, stunning: d.stunning === v ? null : v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button className="absolute inset-0 bg-ink/50 backdrop-blur-sm" aria-label="Close" tabIndex={-1} onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="relative z-10 max-h-[85svh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-cream p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sheet sm:max-w-lg sm:rounded-3xl sm:pb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
              <SlidersHorizontal className="h-5 w-5" weight="bold" />
            </span>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-ink">Filters</h2>
              <p className="text-xs text-ink-mute">Refine what you see</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="-m-2 p-3 text-ink-mute transition-colors hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick filters */}
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">Quick filters</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((q) => {
            const on = quick.includes(q.key);
            return (
              <button
                key={q.key}
                onClick={() => toggleQuick(q.key)}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  on
                    ? "border-gold bg-gold text-ink shadow-sm"
                    : "border-cream-line bg-cream-deep text-ink-soft hover:border-gold/40",
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Halal standard */}
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
          Halal standard · slaughter method
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2 min-[360px]:grid-cols-3">
          {SLAUGHTER.map((o) => (
            <Tile
              key={o.value}
              label={o.label}
              sub={o.sub}
              selected={halal.slaughter === o.value}
              onClick={() => pickSlaughter(o.value)}
              icon={<o.icon className="h-5 w-5" />}
            />
          ))}
        </div>

        {halal.slaughter && (
          <>
            <div className="mt-5 flex items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">Stunning</p>
              <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold-deep">
                Optional
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 min-[360px]:grid-cols-3">
              {STUNNING.map((o) => (
                <Tile
                  key={o.value}
                  label={o.label}
                  sub={o.sub}
                  selected={halal.stunning === o.value}
                  onClick={() => pickStunning(o.value)}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setHalal((d) => ({ ...d, verifiedOnly: !d.verifiedOnly }))}
          className={cn(
            "mt-5 flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
            halal.verifiedOnly ? "border-green/40 bg-green/10" : "border-cream-line bg-cream-deep",
          )}
        >
          <CheckCircle
            weight={halal.verifiedOnly ? "fill" : "regular"}
            className={cn("h-6 w-6", halal.verifiedOnly ? "text-green" : "text-ink-mute")}
          />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-ink">Taeam Verified only</span>
            <span className="block text-xs text-ink-mute">Halal sourcing independently reviewed by us</span>
          </span>
          <span
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              halal.verifiedOnly ? "bg-green" : "bg-cream-line",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                halal.verifiedOnly ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </span>
        </button>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setHalal(EMPTY_HALAL_FILTER);
              setQuick([]);
            }}
            className="flex-1 rounded-full border border-cream-line py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30"
          >
            Reset
          </button>
          <button
            onClick={() => onApply({ halal, quick })}
            className="flex-[2] rounded-full bg-gold py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

function Tile({
  label,
  sub,
  selected,
  onClick,
  icon,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-all",
        selected ? "border-gold bg-gold/10 ring-1 ring-gold" : "border-cream-line bg-cream-deep hover:border-gold/40",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            selected ? "bg-gold/20 text-gold-deep" : "bg-cream text-ink-mute",
          )}
        >
          {icon}
        </span>
      )}
      <span className={cn("text-xs font-bold", selected ? "text-ink" : "text-ink-soft")}>{label}</span>
      <span className="text-[10px] leading-tight text-ink-mute">{sub}</span>
    </button>
  );
}
