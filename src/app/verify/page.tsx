import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VerifyLookup } from "@/components/verify/VerifyLookup";

/**
 * The page a printed Taeam Verified certificate points at.
 *
 * The certificate carries a record number and a QR to /verify?no=TV-0001. Until
 * this existed the template said "scan to confirm current status" and there was
 * nothing to scan to, so the QR was taken off it — a wall certificate nobody can
 * check is worth less than none, because a withdrawn one stays up forever.
 *
 * Everything shown here is already printed on the certificate, so the lookup is
 * public and needs no sign-in. The supplier is deliberately not part of the
 * record (see migration 20260915_02).
 */
export const metadata: Metadata = {
  title: "Check a Taeam Verified record",
  description:
    "Enter the record number printed on a Taeam Verified certificate to see whether it is still current, what it recorded, and when it was checked.",
};

export default function VerifyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:pt-16">
        {/* useSearchParams needs a Suspense boundary to prerender statically. */}
        <Suspense fallback={null}>
          <VerifyLookup />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
