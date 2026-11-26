"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * The public Taeam halal lookup (GROCERY_PLAN G-38, acceptance test 16).
 *
 * Reads three anon RPCs from migration 20261116_03:
 *   grocery_public_state()   decides whether the search box shows at all
 *   grocery_lookup_search()  display fields only, rate limited (hint rate_limited)
 *   grocery_lookup_request() the "Ask us to check this" vote
 *
 * Wording is a legal requirement (FDR B.01.050): a result is never a bare
 * "Halal" or "Not halal". It names the certifier in full, or says it was
 * assessed by Taeam Technologies Inc., or names the failing ingredient, or
 * says "Not checked yet". Every result says "Check the label before eating."
 * Copy rules: no em or en dashes, no store names, no competitor names, no
 * "cheaper than".
 */

type Verdict = "certified" | "assessed" | "not_listed" | "not_checked";

interface LookupResult {
  id: string;
  name: string;
  brand: string | null;
  size: string | null;
  category: string | null;
  gtin: string | null;
  verdict: Verdict;
  certifier_name: string | null;
  cert_valid_until: string | null;
  checked_on: string | null;
  flags: string[] | null;
  fail_ingredient: string | null;
  photo_path: string | null;
  image_url: string | null;
  orderable: boolean;
}

interface SearchResponse {
  open: boolean;
  gtin?: string | null;
  results: LookupResult[];
}

type PageState = "loading" | "open" | "closed" | "unreachable";

interface DoneSearch {
  kind: "done";
  query: string;
  barcode: string | null;
  results: LookupResult[];
}

type SearchState =
  | { kind: "idle" }
  // `prev` keeps the last answer on screen while the next one loads.
  | { kind: "searching"; query: string; prev: DoneSearch | null }
  | DoneSearch
  | { kind: "error"; query: string; message: string };

type AskState = "sending" | "sent" | "limited" | "failed";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;
const PHOTO_TTL_S = 3600;

const COPY = {
  rateLimited: "Too many searches. Try again in a minute.",
  searchFailed: "We could not reach the lookup just now. Try again in a moment.",
  noResults: "We have not checked this product yet.",
  ask: "Ask us to check this",
  asking: "Sending",
  asked: "Thanks. We will check it.",
  askLimited: "Too many requests. Try again later.",
  askFailed: "That did not go through. Try again.",
  checkLabel: "Check the label before eating.",
  orderable: "Available on Taeam Grocery in the app",
  offCredit: "Photo: Open Food Facts",
} as const;

/** "0 12345-67890 5" and similar: the 8 to 14 digit barcode, or null. */
function barcodeOf(raw: string): string | null {
  const compact = raw.replace(/[\s-]/g, "");
  return /^\d{8,14}$/.test(compact) ? compact : null;
}

/**
 * Parse "2026-11-16" as a calendar date. new Date("2026-11-16") is UTC
 * midnight, which renders as the previous day anywhere west of Greenwich,
 * Edmonton included.
 */
function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The certified tier only renders with a named certifier (plan 6.1). A row
 * that somehow arrives without one falls back to "Not checked yet" rather
 * than showing as halal with nobody named.
 */
function displayVerdict(r: LookupResult): Verdict {
  if (r.verdict === "certified" && !r.certifier_name?.trim()) return "not_checked";
  if (r.verdict === "not_listed" && !r.fail_ingredient?.trim()) return "not_checked";
  return r.verdict;
}

async function fetchPageState(): Promise<PageState> {
  const { data, error } = await supabaseBrowser().rpc("grocery_public_state");
  if (error || !data) return "unreachable";
  return (data as { lookup_open?: boolean }).lookup_open ? "open" : "closed";
}

function isRateLimited(error: { hint?: string | null; message?: string | null } | null): boolean {
  return !!error && (error.hint === "rate_limited" || /too many/i.test(error.message ?? ""));
}

export function HalalCheckClient() {
  const [page, setPage] = useState<PageState>("loading");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState>({ kind: "idle" });
  const [asks, setAsks] = useState<Record<string, AskState>>({});
  const [photos, setPhotos] = useState<Record<string, string>>({});

  const inputId = useId();
  const hintId = useId();
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);
  // Paths already signed (or being signed), so a repeat search does not re-sign them.
  const signedRef = useRef<Set<string>>(new Set());

  // ── Is the lookup open? ──────────────────────────────────────────────────
  useEffect(() => {
    let live = true;
    void fetchPageState().then((s) => {
      if (live) setPage(s);
    });
    return () => {
      live = false;
    };
  }, []);

  const retryState = async () => {
    setPage("loading");
    setPage(await fetchPageState());
  };

  // ── Photos: Taeam's own front photo first, signed in one batch ──────────
  const signPhotos = useCallback(async (results: LookupResult[]) => {
    const paths = [
      ...new Set(results.map((r) => r.photo_path).filter((p): p is string => !!p)),
    ].filter((p) => !signedRef.current.has(p));
    if (paths.length === 0) return;
    paths.forEach((p) => signedRef.current.add(p));
    const { data, error } = await supabaseBrowser()
      .storage.from("grocery-evidence")
      .createSignedUrls(paths, PHOTO_TTL_S);
    if (error || !data) {
      // Let a later search try again.
      paths.forEach((p) => signedRef.current.delete(p));
      return;
    }
    const next: Record<string, string> = {};
    for (const row of data) {
      if (row.path && row.signedUrl && !row.error) next[row.path] = row.signedUrl;
      else if (row.path) signedRef.current.delete(row.path);
    }
    if (Object.keys(next).length) setPhotos((prev) => ({ ...prev, ...next }));
  }, []);

  // ── Search ───────────────────────────────────────────────────────────────
  const runSearch = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      abortRef.current?.abort();
      const seq = ++seqRef.current;

      if (text.length < MIN_CHARS) {
        abortRef.current = null;
        setSearch({ kind: "idle" });
        return;
      }

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const barcode = barcodeOf(text);
      setSearch((prev) => ({
        kind: "searching",
        query: text,
        prev: prev.kind === "done" ? prev : prev.kind === "searching" ? prev.prev : null,
      }));

      const { data, error } = await supabaseBrowser()
        .rpc("grocery_lookup_search", { p_query: barcode ?? text, p_gtin: null, p_limit: 30 })
        .abortSignal(ctrl.signal);

      // A newer keystroke has taken over; drop this answer.
      if (ctrl.signal.aborted || seq !== seqRef.current) return;

      if (error) {
        setSearch({
          kind: "error",
          query: text,
          message: isRateLimited(error) ? COPY.rateLimited : COPY.searchFailed,
        });
        return;
      }

      const res = (data ?? { open: false, results: [] }) as SearchResponse;
      if (!res.open) {
        // The lookup was closed while the page was open.
        setPage("closed");
        setSearch({ kind: "idle" });
        return;
      }
      const results = Array.isArray(res.results) ? res.results : [];
      setSearch({ kind: "done", query: text, barcode, results });
      void signPhotos(results);
    },
    [signPhotos],
  );

  const onType = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void runSearch(value), DEBOUNCE_MS);
  };

  // Clear any pending timer and in-flight request on unmount.
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  // ── "Ask us to check this" ───────────────────────────────────────────────
  const ask = useCallback(
    async (key: string, args: { productId?: string; query?: string; barcode?: string | null }) => {
      setAsks((prev) => ({ ...prev, [key]: "sending" }));
      const { error } = await supabaseBrowser().rpc("grocery_lookup_request", {
        p_product_id: args.productId ?? null,
        p_query: args.query ?? null,
        p_gtin: args.barcode ?? null,
      });
      // Success and { duplicate: true } read the same to the visitor.
      const next: AskState = !error ? "sent" : isRateLimited(error) ? "limited" : "failed";
      setAsks((prev) => ({ ...prev, [key]: next }));
    },
    [],
  );

  // ── Render ───────────────────────────────────────────────────────────────
  if (page === "loading") {
    return (
      <section aria-busy="true" aria-label="Taeam halal lookup">
        <Eyebrow>Taeam halal lookup</Eyebrow>
        {/* The static HTML is this loading state, so without this the page a
            crawler reads first has no heading at all. */}
        <h1 className="sr-only">Taeam halal product check</h1>
        <div className="mt-4 h-10 w-3/4 animate-pulse rounded-lg bg-cream-deep motion-reduce:animate-none" />
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-cream-deep motion-reduce:animate-none" />
        <div className="mt-8 h-12 w-full animate-pulse rounded-lg bg-cream-deep motion-reduce:animate-none" />
      </section>
    );
  }

  if (page === "unreachable") {
    return (
      <section>
        <Eyebrow>Taeam halal lookup</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Check a grocery product
        </h1>
        <p className="mt-4 max-w-xl text-ink-mute" role="status">
          We could not reach the lookup just now. Try again in a moment, or email{" "}
          <a className="link-underline" href="mailto:contact@taeam.ca">
            contact@taeam.ca
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => void retryState()}
          className="mt-6 rounded-lg bg-ink px-6 py-3 font-semibold text-cream transition-colors hover:bg-gold hover:text-ink"
        >
          Try again
        </button>
      </section>
    );
  }

  if (page === "closed") {
    return (
      <section>
        <Eyebrow>Taeam halal lookup</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          The Taeam halal lookup opens soon
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-mute">
          Soon you will be able to search a grocery product by name, brand or
          barcode and see what Taeam found when we checked it. It will be free,
          with no sign-in.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-mute">
          Below is how we check and what each result will mean.
        </p>
      </section>
    );
  }

  const status = statusText(search);
  const view: DoneSearch | null =
    search.kind === "done" ? search : search.kind === "searching" ? search.prev : null;

  return (
    <section>
      <Eyebrow>Taeam halal lookup</Eyebrow>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Check a grocery product
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-mute">
        Search by product name, brand or barcode to see what Taeam found when we
        checked it. Free, and no sign-in.
      </p>

      <form
        role="search"
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (timerRef.current) clearTimeout(timerRef.current);
          void runSearch(query);
        }}
      >
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
          Product name, brand or barcode
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => onType(e.target.value)}
            aria-describedby={hintId}
            aria-controls={`${inputId}-results`}
            placeholder="Cheese slices, a brand, or a barcode"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            className="w-full min-w-0 rounded-lg border border-cream-line bg-white px-4 py-3 text-ink placeholder:text-ink-mute/60"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-ink px-6 py-3 font-semibold text-cream transition-colors hover:bg-gold hover:text-ink"
          >
            Search
          </button>
        </div>
        <p id={hintId} className="mt-2 text-xs text-ink-mute">
          Results appear as you type. A barcode is the 8 to 14 digits under the stripes.
        </p>
      </form>

      {/* One polite live region announces every change of state. */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </p>

      <div
        id={`${inputId}-results`}
        className={cn("mt-8 transition-opacity", search.kind === "searching" && view && "opacity-60")}
      >
        {search.kind === "searching" && !view && (
          <p className="text-sm text-ink-mute" aria-hidden="true">
            Searching…
          </p>
        )}

        {search.kind === "error" && (
          <p className="rounded-xl border border-cream-line bg-white px-5 py-4 text-ink-soft" aria-hidden="true">
            {search.message}
          </p>
        )}

        {view && view.results.length === 0 && (
          <div className="rounded-xl border border-cream-line bg-white px-5 py-5">
            <p className="font-semibold text-ink">{COPY.noResults}</p>
            <AskButton
              state={asks[`q:${view.query}`]}
              onAsk={() => void ask(`q:${view.query}`, { query: view.query, barcode: view.barcode })}
            />
          </div>
        )}

        {view && view.results.length > 0 && (
          <ul className="space-y-4">
            {view.results.map((r) => (
              <ResultCard
                key={r.id}
                result={r}
                photoUrl={r.photo_path ? photos[r.photo_path] : undefined}
                askState={asks[r.id]}
                onAsk={() => void ask(r.id, { productId: r.id })}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function statusText(search: SearchState): string {
  switch (search.kind) {
    case "idle":
      return "";
    case "searching":
      return "Searching";
    case "error":
      return search.message;
    case "done":
      if (search.results.length === 0) return COPY.noResults;
      return search.results.length === 1 ? "1 result" : `${search.results.length} results`;
  }
}

function AskButton({ state, onAsk }: { state: AskState | undefined; onAsk: () => void }) {
  if (state === "sent") {
    return (
      <p className="mt-3 text-sm font-semibold text-ink" role="status">
        {COPY.asked}
      </p>
    );
  }
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onAsk}
        disabled={state === "sending"}
        className="rounded-lg border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-60"
      >
        {state === "sending" ? COPY.asking : COPY.ask}
      </button>
      {(state === "limited" || state === "failed") && (
        <p className="mt-2 text-sm text-ink-mute" role="status">
          {state === "limited" ? COPY.askLimited : COPY.askFailed}
        </p>
      )}
    </div>
  );
}

function ResultCard({
  result: r,
  photoUrl,
  askState,
  onAsk,
}: {
  result: LookupResult;
  photoUrl: string | undefined;
  askState: AskState | undefined;
  onAsk: () => void;
}) {
  const verdict = displayVerdict(r);
  const passed = verdict === "certified" || verdict === "assessed";
  const flags = passed ? (r.flags ?? []).filter((f) => f && f.trim()) : [];
  const meta = [r.brand, r.size].filter((s) => s && s.trim()).join(" · ");
  // Taeam's own photo first; the Open Food Facts picture only when there is none.
  const offUrl = !r.photo_path || !photoUrl ? r.image_url : null;
  const imgSrc = photoUrl ?? offUrl ?? null;
  const validUntil = fmtDate(r.cert_valid_until);
  const checkedOn = fmtDate(r.checked_on);

  return (
    <li
      className={cn(
        "rounded-xl border border-cream-line border-l-4 bg-white px-4 py-4 sm:px-5",
        passed ? "border-l-green" : verdict === "not_listed" ? "border-l-red-deep" : "border-l-cream-line",
      )}
    >
      <div className="flex gap-4">
        {imgSrc && (
          <figure className="w-16 shrink-0 sm:w-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed and third-party URLs, not optimisable at build time */}
            <img
              src={imgSrc}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-lg border border-cream-line bg-cream object-contain"
            />
            {imgSrc === offUrl && (
              <figcaption className="mt-1 text-[10px] leading-tight text-ink-mute">
                {COPY.offCredit}
              </figcaption>
            )}
          </figure>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug text-ink [overflow-wrap:anywhere] sm:text-lg">
            {r.name}
          </h2>
          {meta && <p className="mt-0.5 text-sm text-ink-mute [overflow-wrap:anywhere]">{meta}</p>}

          <div className="mt-3 space-y-1 text-sm">
            {verdict === "certified" && (
              <>
                <p className="font-semibold text-ink">Certified halal by {r.certifier_name}</p>
                {validUntil && <p className="text-ink-soft">Certificate valid until {validUntil}</p>}
              </>
            )}

            {verdict === "assessed" && (
              <>
                <p className="font-semibold text-ink">Halal status assessed by Taeam Technologies Inc.</p>
                {checkedOn && <p className="text-ink-soft">Checked on {checkedOn}</p>}
                <p>
                  <a className="link-underline text-gold-deep" href="#how-we-check">
                    How we check
                  </a>
                </p>
              </>
            )}

            {verdict === "not_listed" && (
              <p className="font-semibold text-ink">
                Not listed. Contains {r.fail_ingredient}, which fails the Taeam standard.
              </p>
            )}

            {verdict === "not_checked" && <p className="font-semibold text-ink">Not checked yet</p>}
          </div>

          {flags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold uppercase tracking-[0.115em] text-ink-mute">Flagged:</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Flagged ingredients">
                {flags.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-cream-line bg-cream px-2.5 py-0.5 text-xs text-ink-soft"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 text-xs text-ink-mute">We show this so you can decide.</p>
            </div>
          )}

          {verdict === "not_checked" && <AskButton state={askState} onAsk={onAsk} />}

          {passed && r.orderable && <p className="mt-3 text-sm text-ink-soft">{COPY.orderable}</p>}

          <p className="mt-3 text-xs text-ink-mute">{COPY.checkLabel}</p>
        </div>
      </div>
    </li>
  );
}
