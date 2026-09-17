"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Pattern";
import { supabaseBrowser } from "@/lib/supabase-browser";

interface VerifyRecord {
  record_no: string;
  restaurant_legal_name: string;
  restaurant_address: string | null;
  certifying_body: string | null;
  // No certificate_number. A supplier's halal certificate number can often be
  // looked up against the body that issued it, which names the supplier, and
  // Agreement s.4.7 says Taeam does not publish that. It stays in the private
  // table and out of halal_verification_public.
  certificate_expiry: string | null;
  documents_reviewed: string | null;
  verified_on: string;
  valid_until: string;
  status: "current" | "withdrawn" | "expired";
}

/** Accepts "TV-0001", "tv 0001", "0001" — anything a person might retype. */
function normalise(raw: string): string | null {
  const digits = raw.trim().toUpperCase().replace(/^TV[\s-]*/, "").replace(/\D/g, "");
  if (digits.length < 4 || digits.length > 6) return null;
  return `TV-${digits}`;
}

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  // Parse as a plain calendar date. `new Date("2026-09-15")` is UTC midnight,
  // which renders as the previous day for anyone west of Greenwich — including
  // every reader in Edmonton.
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const STATUS = {
  current: {
    label: "This record is current",
    body: "Taeam reviewed the documents below on the date shown and this restaurant is an active partner.",
    className: "border-green/40 bg-green/10 text-green",
  },
  withdrawn: {
    label: "This record has been withdrawn",
    body: "Taeam has withdrawn this record. Any printed certificate carrying this number should no longer be on display, and you should not rely on it.",
    className: "border-red/40 bg-red/10 text-red",
  },
  expired: {
    label: "This record has lapsed",
    body: "This record passed its review date and has not been renewed. Ask the restaurant for its current certificate.",
    className: "border-gold-deep/40 bg-gold/10 text-gold-deep",
  },
} as const;

export function VerifyLookup() {
  const params = useSearchParams();
  const fromUrl = params.get("no") ?? "";

  const [input, setInput] = useState(fromUrl);
  const [record, setRecord] = useState<VerifyRecord | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "missing" | "error" | "found">("idle");

  const lookup = useCallback(async (raw: string) => {
    const recordNo = normalise(raw);
    if (!recordNo) {
      setRecord(null);
      setState(raw.trim() ? "missing" : "idle");
      return;
    }
    setState("loading");
    const { data, error } = await supabaseBrowser()
      .from("halal_verification_public")
      .select("*")
      .eq("record_no", recordNo)
      .maybeSingle();

    if (error) {
      setRecord(null);
      setState("error");
      return;
    }
    if (!data) {
      setRecord(null);
      setState("missing");
      return;
    }
    setRecord(data as VerifyRecord);
    setState("found");
  }, []);

  // A scanned QR arrives with ?no= already set; look it up without a click.
  useEffect(() => {
    if (fromUrl) void lookup(fromUrl);
  }, [fromUrl, lookup]);

  return (
    <div>
      <Eyebrow>Taeam Verified</Eyebrow>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Check a certificate
      </h1>
      <p className="mt-3 max-w-xl text-ink-mute">
        Every Taeam Verified certificate carries a record number. Enter it here
        to see what Taeam reviewed, when, and whether the record still stands.
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(input);
        }}
      >
        <label htmlFor="record-no" className="sr-only">
          Record number
        </label>
        <input
          id="record-no"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TV-0001"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border border-cream-line bg-white px-4 py-3 text-ink placeholder:text-ink-mute/60 sm:max-w-xs"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-ink px-6 py-3 font-semibold text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
        >
          {state === "loading" ? "Checking…" : "Check"}
        </button>
      </form>

      {state === "missing" && (
        <p className="mt-6 text-ink-mute">
          No record matches that number. Check the digits on the certificate, or
          email{" "}
          <a className="link-underline" href="mailto:contact@taeam.ca">
            contact@taeam.ca
          </a>{" "}
          and we will confirm it by hand.
        </p>
      )}

      {state === "error" && (
        <p className="mt-6 text-ink-mute">
          We could not reach the register just now. Try again in a moment, or
          email{" "}
          <a className="link-underline" href="mailto:contact@taeam.ca">
            contact@taeam.ca
          </a>
          .
        </p>
      )}

      {state === "found" && record && (
        <section className="mt-10">
          <div className={`rounded-xl border px-5 py-4 ${STATUS[record.status].className}`}>
            <p className="font-semibold">{STATUS[record.status].label}</p>
            <p className="mt-1 text-sm text-ink-soft">{STATUS[record.status].body}</p>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-ink">
            {record.restaurant_legal_name}
          </h2>
          {record.restaurant_address && (
            <p className="mt-1 text-ink-mute">{record.restaurant_address}</p>
          )}

          <Rule className="mt-6" />
          <dl className="divide-y divide-cream-line">
            {[
              ["Record number", record.record_no],
              ["Certifying body", record.certifying_body],
              ["Certificate expiry", fmtDate(record.certificate_expiry)],
              ["Documents reviewed", record.documents_reviewed],
              ["Date verified", fmtDate(record.verified_on)],
              ["Record valid until", fmtDate(record.valid_until)],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k as string} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <dt className="text-xs font-bold uppercase tracking-[0.115em] text-ink-mute sm:w-56 sm:shrink-0">
                    {k}
                  </dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
          </dl>

          <p className="mt-8 text-sm leading-relaxed text-ink-mute">
            <strong className="font-semibold text-ink">What this records.</strong>{" "}
            Taeam reviewed the documents listed above and recorded what they
            state, as at the date of review.{" "}
            <strong className="font-semibold text-ink">
              Taeam issues no religious ruling and does not itself certify any
              food as halal.
            </strong>{" "}
            Halal status is determined by the certifying body named above and by
            the restaurant&rsquo;s own signed attestation. Observance standards
            differ between individuals and between schools of thought, so these
            details are published for you to apply your own. The
            restaurant&rsquo;s supplier is held on file and is not published.
          </p>

          <p className="mt-4 text-sm text-ink-mute">
            More on how this works:{" "}
            <Link className="link-underline" href="/how-we-verify">
              how we verify
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  );
}
