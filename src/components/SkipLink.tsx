"use client";

/**
 * "Skip to content", the first thing a keyboard user reaches with Tab. Hidden
 * until focused, then shown as a small pill over the header.
 *
 * Pages don't share one <main> (several render their sections straight after
 * the site header), so the target is found at click time: the page's <main>
 * when it has one, otherwise whatever follows the site header. The target gets
 * tabindex=-1 so it can take focus, and the next Tab carries on from there.
 * `data-skip-target` switches off the focus ring for it (globals.css), since
 * it is a region rather than a control.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        const target =
          document.querySelector<HTMLElement>("main") ??
          (document.querySelector("header")?.nextElementSibling as HTMLElement | null);
        if (!target) return;
        e.preventDefault();
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.setAttribute("data-skip-target", "");
        target.focus();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-noir focus:px-5 focus:py-3 focus:text-[13px] focus:font-bold focus:uppercase focus:tracking-wide focus:text-gold"
    >
      Skip to content
    </a>
  );
}
