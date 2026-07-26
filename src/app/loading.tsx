/**
 * Route-level loading fallback shown while the next page streams in. A single
 * quiet spinner on the cream field — no glow, no bounce, just a calm hold state.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[100svh] items-center justify-center bg-cream"
    >
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-cream-line border-t-gold-deep"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
