"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSealedPath } from "@/lib/launch";

/**
 * Pre-launch seal (see lib/launch.ts). The ordering + account routes still get
 * built into the static export, so this bounces any direct-URL visit to one of
 * them back to the home waitlist, covering the brief mount with a branded
 * splash so the sealed page never flashes. When SEALED is off, isSealedPath is
 * always false and this renders nothing on every route.
 */
export function LaunchGate() {
  const pathname = usePathname();
  const router = useRouter();
  const sealed = isSealedPath(pathname);

  useEffect(() => {
    if (sealed) router.replace("/");
  }, [sealed, router]);

  if (!sealed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-gold-bright">
      <span
        className="text-[18vw] font-black leading-none text-noir sm:text-[10vw]"
        style={{ fontFamily: "var(--font-arabic)" }}
        lang="ar"
        dir="rtl"
      >
        طعام
      </span>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-noir/70">
        Taking you home
      </p>
    </div>
  );
}
