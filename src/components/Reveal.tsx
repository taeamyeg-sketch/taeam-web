import type { ReactNode } from "react";

/**
 * Plain block wrapper. It used to fade-rise its children in on scroll; content
 * now renders immediately. `delay` is accepted so existing call sites keep
 * compiling, and ignored.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
