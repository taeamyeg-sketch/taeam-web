"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  UserCircle,
  Receipt,
  MapPin,
  Coins,
  Crown,
  Question,
  ShieldCheck,
  SignOut,
  CaretDown,
  type Icon,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/cn";

interface Row {
  href: string;
  label: string;
  icon: Icon;
}

const ROWS: Row[] = [
  { href: "/account/orders", label: "Your orders", icon: Receipt },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/rewards", label: "Rewards", icon: Coins },
  { href: "/account/subscription", label: "Taeam Plus", icon: Crown },
  { href: "/account", label: "Profile & settings", icon: UserCircle },
  { href: "/help", label: "Help", icon: Question },
  { href: "/privacy-policy", label: "Privacy", icon: ShieldCheck },
];

/**
 * Signed-in account dropdown. Surfaces profile, orders, addresses, rewards,
 * Plus, settings, help and privacy — the pages that previously had no way in —
 * plus sign out. Animated open like the site hub menu.
 */
export function AccountMenu({ light = false }: { light?: boolean }) {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const first = profile?.name?.split(" ")[0] ?? "Account";

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold transition-colors sm:px-3",
          light ? "text-white/90 hover:bg-white/10" : "text-ink-soft hover:bg-cream-deep",
        )}
      >
        <UserCircle className="h-6 w-6" weight="fill" aria-hidden />
        <span className="hidden sm:inline">{first}</span>
        <CaretDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 max-h-[calc(100dvh-6.5rem)] w-64 origin-top-right overflow-y-auto overscroll-contain rounded-2xl border border-cream-line bg-cream p-2 shadow-card transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="rounded-xl bg-cream-deep px-3 py-2.5">
          <p className="truncate text-sm font-bold text-ink">{profile?.name ?? "Your account"}</p>
          {profile?.email && (
            <p className="truncate text-xs text-ink-mute">{profile.email}</p>
          )}
          {profile?.taeam_points != null && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">
              <Coins weight="fill" className="h-3.5 w-3.5" />
              {profile.taeam_points.toLocaleString()} points
            </p>
          )}
        </div>

        <div className="mt-1">
          {ROWS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-cream-deep hover:text-ink"
            >
              <r.icon className="h-5 w-5 text-ink-mute" aria-hidden />
              {r.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => {
            setOpen(false);
            void signOut();
          }}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red transition-colors hover:bg-red/10"
        >
          <SignOut className="h-5 w-5" aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}
