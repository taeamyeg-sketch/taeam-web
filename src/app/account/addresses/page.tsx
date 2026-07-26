"use client";

import { useCallback, useEffect, useState } from "react";
import { House, MapPin, Star, Trash } from "@phosphor-icons/react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthContext";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";

interface AddressRow {
  id: string;
  label: string | null;
  full_address: string;
  is_default: boolean | null;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabaseBrowser()
      .from("user_addresses")
      .select("id,label,full_address,is_default")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses((data as AddressRow[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function makeDefault(id: string) {
    if (!user) return;
    setBusyId(id);
    const supabase = supabaseBrowser();
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    await supabase.from("user_addresses").update({ is_default: true }).eq("id", id);
    await load();
    setBusyId(null);
  }

  async function remove(id: string) {
    setBusyId(id);
    await supabaseBrowser().from("user_addresses").delete().eq("id", id);
    await load();
    setBusyId(null);
  }

  return (
    <AccountShell>
      {addresses === null ? (
        <p className="py-16 text-center text-sm text-ink-mute">
          Loading addresses…
        </p>
      ) : addresses.length === 0 ? (
        <div className="py-16 text-center">
          <MapPin className="mx-auto h-8 w-8 text-ink-mute" aria-hidden />
          <p className="mt-4 font-black uppercase tracking-tight text-xl text-ink">
            No saved addresses.
          </p>
          <p className="mt-2 text-sm text-ink-mute">
            Addresses you save in the app show up here, and you can add one
            during checkout.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 p-5 shadow-card"
            >
              <div className="flex min-w-0 items-start gap-3">
                <House className="mt-0.5 h-5 w-5 shrink-0 text-ink-mute" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {address.label || "Address"}
                    {address.is_default && (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-deep">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 break-words text-sm text-ink-mute">
                    {address.full_address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!address.is_default && (
                  <button
                    onClick={() => makeDefault(address.id)}
                    disabled={busyId === address.id}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-cream-line px-3.5 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-deep disabled:opacity-50"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden />
                    Make default
                  </button>
                )}
                <button
                  onClick={() => remove(address.id)}
                  disabled={busyId === address.id}
                  aria-label="Delete address"
                  className={cn(
                    "rounded-full border border-cream-line p-3 text-ink-mute hover:bg-red/10 hover:text-red disabled:opacity-50",
                  )}
                >
                  <Trash className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
