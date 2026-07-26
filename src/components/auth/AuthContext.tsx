"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  /** Canonical points balance (points_balance; taeam_points is a legacy mirror). */
  taeam_points: number | null;
  is_plus: boolean | null;
  plus_expires_at: string | null;
  referral_code: string | null;
}

interface AuthApi {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabaseBrowser()
      .from("users")
      .select(
        "id,name,email,phone,points_balance,taeam_points,is_plus,plus_expires_at,referral_code",
      )
      .eq("id", userId)
      .maybeSingle();
    if (!data) {
      setProfile(null);
      return;
    }
    const row = data as Profile & { points_balance: number | null };
    // points_balance is the source of truth; taeam_points is the legacy mirror.
    setProfile({ ...row, taeam_points: row.points_balance ?? row.taeam_points });
  }

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) loadProfile(s.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthApi>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      refreshProfile: async () => {
        if (session?.user) await loadProfile(session.user.id);
      },
      signOut: async () => {
        await supabaseBrowser().auth.signOut();
      },
    }),
    [session, profile, loading],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
