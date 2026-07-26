'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChefHat, Cookie, Bell, CheckCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FridgePage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError('Please enter a valid email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('fridge_waitlist').insert([{ email: clean }]);
      // 23505 = unique violation → already on the list → still a success.
      // Any other error is a genuine failure; don't show the success screen
      // (silent data loss) — surface a retry prompt instead.
      if (dbError && dbError.code !== '23505') {
        console.error('fridge_waitlist insert failed:', dbError);
        setError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error('fridge_waitlist insert threw:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <main className="min-h-svh bg-cream font-sans text-ink antialiased">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-black/5 bg-cream/85 py-3.5 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(0.875rem,env(safe-area-inset-top))] backdrop-blur-md sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))]">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-ink transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {/* ── BANNER ── */}
      <section className="px-3 pt-[68px] sm:px-5 sm:pt-[76px]">
        <div className={`relative mx-auto max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative aspect-[16/9] w-full sm:aspect-[1376/676]">
            <Image
              src="/fridge-feature.jpg"
              alt="The Fridge, homemade goods from local kitchens"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright" /> Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEADING ── */}
      <section className="px-5 pb-2 pt-10 text-center sm:px-8 sm:pt-14">
        <h1 className="mx-auto max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
          The <span className="text-gold-deep">Fridge</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-mute sm:text-xl">
          Home kitchens, opened up. A place for talented home cooks and bakers to sell
          what they make, and for the rest of us to finally buy it.
        </p>
      </section>

      {/* ── TWO SIDES ── */}
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-bright/12 text-gold-deep">
              <ChefHat className="h-6 w-6" weight="bold" />
            </div>
            <h3 className="text-base font-bold">If you make it</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
              Turn your home kitchen into a small business. Sell your desserts today, and one day,
              full home-cooked meals, to your city.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-bright/12 text-gold-deep">
              <Cookie className="h-6 w-6" weight="bold" />
            </div>
            <h3 className="text-base font-bold">If you love it</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
              Real homemade goods from people near you, not factory shelves. Made by hand,
              the way it should be.
            </p>
          </div>
        </div>
      </section>

      {/* ── NOTIFY ── */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-gold-bright/30 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
          <div className="h-1.5 w-full bg-gradient-to-r from-gold-bright via-gold to-gold-bright" />
          <div className="p-7 text-center sm:p-9">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-bright/12 text-gold-deep">
              <Bell className="h-5 w-5" weight="bold" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Be first to know</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-mute">
              Whether you want to sell from your kitchen or just be first in line to order,
              leave your email and we&apos;ll reach out when The Fridge opens.
            </p>

            {submitted ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green/20 bg-green/8 p-5 text-left">
                <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green" weight="fill" />
                <div>
                  <p className="font-black text-green">You&apos;re on the list!</p>
                  <p className="mt-1 text-sm leading-relaxed text-green">
                    We&apos;ll let you know the moment The Fridge is ready.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={submitting}
                  autoComplete="email"
                  className="flex-1 rounded-xl border border-black/10 bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all placeholder:text-ink-mute focus:border-gold-bright focus:bg-white focus:ring-2 focus:ring-gold-bright/30"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? 'Joining…' : (<>Notify me <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" weight="bold" /></>)}
                </button>
              </form>
            )}

            {error && <p className="mt-3 text-sm font-semibold text-red">{error}</p>}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-colors hover:text-gold-deep"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
            Back to main page
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="py-6 text-center">
        <p className="text-xs uppercase tracking-wider text-ink-mute">© 2026 Taeam Technologies Inc.</p>
      </div>
    </main>
  );
}
