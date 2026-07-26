"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/restaurants";

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-cream px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Image src="/logo-mark.png" alt="Taeam" width={30} height={34} className="h-9 w-auto" />
        <span className="text-3xl font-black uppercase tracking-tight text-ink">Taeam</span>
      </Link>

      <div className="w-full max-w-sm rounded-3xl bg-white/60 p-7 shadow-card sm:p-8">
        <AuthPanel next={next} onDone={() => router.push(next)} />
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  );
}
