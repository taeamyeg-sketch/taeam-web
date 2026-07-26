"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

/**
 * The brand's route transition: a quiet noir veil with the gold logo lockup
 * as the whole show. On navigate the page dims to near-black, the mark rises
 * in and keeps a slow drift while the route swaps underneath, then it lifts
 * away and the veil fades off the new page. No wipes, no panels — the logo's
 * entrance and exit carry it.
 *
 * Reserved for the moments that deserve it (opening the ordering surface),
 * not every link. Honors prefers-reduced-motion by skipping straight to the
 * push.
 */

type Phase = "idle" | "cover" | "hold" | "reveal";

// Push happens once fully covered; reveal waits a beat so the swap never
// flashes.
const COVER_MS = 560;
const HOLD_MS = 160;
const REVEAL_MS = 820;
const FAILSAFE_MS = 4000;

const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const navigate = useCallback(
    (href: string) => {
      if (pending.current) return;
      const samePage = href === pathname;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced || samePage) {
        router.push(href);
        return;
      }
      pending.current = true;
      setPhase("cover");
      timers.current.push(
        window.setTimeout(() => {
          setPhase("hold");
          router.push(href);
        }, COVER_MS),
      );
      // Never trap the user behind the curtain if the route doesn't move.
      timers.current.push(
        window.setTimeout(() => {
          if (!pending.current) return;
          pending.current = false;
          setPhase("reveal");
          timers.current.push(
            window.setTimeout(() => setPhase("idle"), REVEAL_MS),
          );
        }, FAILSAFE_MS),
      );
    },
    [pathname, router],
  );

  // The route swapped in underneath the curtain: give it a couple of frames
  // to paint, hold a beat, then pull the curtain off the top.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    clearTimers();
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        timers.current.push(
          window.setTimeout(() => {
            setPhase("reveal");
            timers.current.push(
              window.setTimeout(() => setPhase("idle"), REVEAL_MS),
            );
          }, HOLD_MS),
        );
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => clearTimers, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div className="pt-root" data-phase={phase} aria-hidden>
        <div className="pt-veil grain" />
        <div className="pt-mark">
          <span className="pt-logo" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/**
 * Drop-in next/link that plays the diagonal wipe before navigating. Falls
 * back to normal link behavior for modified clicks (new tab etc.) and
 * external URLs.
 */
export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: ComponentProps<typeof Link>) {
  const { navigate } = usePageTransition();
  const url = typeof href === "string" ? href : (href.pathname ?? "");

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!url.startsWith("/")) return;
        e.preventDefault();
        navigate(url);
      }}
    >
      {children}
    </Link>
  );
}
