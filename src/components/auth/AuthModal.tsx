"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { AuthPanel } from "./AuthPanel";
import { useAuth } from "./AuthContext";
import { useModalDialog } from "@/lib/useModalDialog";

/**
 * Global sign-in modal. Mounted once in the layout; opens on the `taeam:auth`
 * event (see `openAuth`). Closes itself the moment a session appears, so the
 * email-code and OAuth flows both just work.
 */
export function AuthModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState("/restaurants");

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ next?: string }>).detail;
      setNext(detail?.next ?? "/restaurants");
      setOpen(true);
    };
    window.addEventListener("taeam:auth", onOpen);
    return () => window.removeEventListener("taeam:auth", onOpen);
  }, []);

  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  if (!open) return null;
  return <AuthDialog next={next} onClose={() => setOpen(false)} />;
}

function AuthDialog({ next, onClose }: { next: string; onClose: () => void }) {
  const panelRef = useModalDialog<HTMLDivElement>(onClose);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        aria-label="Close sign in"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Taeam"
        className="relative z-10 max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-sheet sm:rounded-3xl sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 p-3 text-ink-mute transition-colors hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <AuthPanel next={next} onDone={onClose} />
      </div>
    </div>
  );
}
