'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, Car, Clock, MapPin, CheckCircle,
  Navigation, BadgeDollarSign, ShieldCheck, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { BACKEND_URL } from '@/lib/backend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  {
    icon: <Car className="h-6 w-6" />,
    title: 'You pick your hours',
    desc: "Online when you want, off when you don't. No shifts, no minimums.",
  },
  {
    icon: <BadgeDollarSign className="h-6 w-6" />,
    title: 'Fixed pay per drop',
    desc: 'A flat rate on every delivery that climbs the further you go. No surge roulette.',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Orders you actually know',
    desc: 'North and South Edmonton to start. Familiar streets, quick runs.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Respect for your time',
    desc: 'One order at a time. No stacking three drops and making the last customer wait.',
  },
];

const STEPS = [
  'Join the waitlist below',
  'We email you the moment applications open',
  'Set up your profile and upload your documents',
  'We review your application',
  'Go online and start earning once approved',
];

const LANGUAGES = [
  { label: 'Urdu', native: 'اردو' },
  { label: 'Hindi', native: 'हिन्दी' },
  { label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { label: 'Arabic', native: 'العربية' },
];

export default function DrivePage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError('Please enter a valid email.');
      return;
    }
    setSubmitting(true);
    setError('');

    // 1) Store the signup in the site's Supabase project. A duplicate (23505)
    //    is fine (they're already on the list). Surface any *other* failure.
    let stored = true;
    try {
      const { error: dbError } = await supabase.from('driver_signups').insert([{ email: clean }]);
      if (dbError && dbError.code !== '23505') {
        console.error('driver_signups insert failed:', dbError);
        stored = false;
      }
    } catch (err) {
      console.error('driver_signups insert threw:', err);
      stored = false;
    }

    // 2) Fire the branded confirmation email via the backend. Best-effort:
    //    we read `emailed` so the success copy stays honest.
    let didEmail = false;
    try {
      const res = await fetch(`${BACKEND_URL}/api/waitlist/driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json().catch(() => ({}));
      didEmail = !!data.emailed;
    } catch (err) {
      console.error('waitlist email request failed:', err);
    }

    setSubmitting(false);

    if (!stored && !didEmail) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setEmailed(didEmail);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#F6F4EF] font-sans text-[#1A1A1A] antialiased">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-black/5 bg-[#F6F4EF]/85 px-5 py-3.5 backdrop-blur-md sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-[#1A1A1A] transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {/* ── BANNER ── */}
      <section className="px-3 pt-[68px] sm:px-5 sm:pt-[76px]">
        <div className={`relative mx-auto max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative aspect-[1376/676] w-full">
            <Image
              src="/driver-hero.jpg"
              alt="Deliver with Taeam in Edmonton"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EAB308]" /> Edmonton · Soft launch
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEADING ── */}
      <section className="px-5 pb-4 pt-10 text-center sm:px-8 sm:pt-14">
        <h1 className="mx-auto max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
          Drive with <span className="text-[#B7791F]">Taeam</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#52504A] sm:text-xl">
          The big apps aren&apos;t taking new drivers right now. We are. And we&apos;re building
          a delivery experience that treats drivers like partners.
        </p>
      </section>

      {/* ── SIGNUP (primary, near top) ── */}
      <section className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="animate-on-scroll mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#EAB308]/30 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
          {/* gold cap */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#EAB308] via-[#F4C843] to-[#EAB308]" />
          <div className="p-7 sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#EAB308]/12 px-3.5 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#B7791F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#B7791F]">
                Applications opening soon · Limited spots
              </span>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Become a Taeam driver
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#52504A] sm:text-base">
              We&apos;re onboarding a limited number of drivers for our Edmonton soft launch.
              Join the waitlist and you&apos;ll get a confirmation email right away. Then we&apos;ll
              reach out the moment applications open. <span className="font-semibold text-[#1A1A1A]">Early sign-ups get priority.</span>
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={submitting}
                  autoComplete="email"
                  className="flex-1 rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3.5 text-base text-[#1A1A1A] outline-none transition-all placeholder:text-[#9A988F] focus:border-[#EAB308] focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? 'Joining…' : (
                    <>Join the waitlist <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#1E8A3F]/20 bg-[#1E8A3F]/8 p-5">
                <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#1E8A3F]" />
                <div>
                  <p className="font-black text-[#166534]">You&apos;re on the list!</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#3F6B4A]">
                    {emailed
                      ? 'Check your inbox for the confirmation we just sent. We\'ll be in touch the moment driver applications open.'
                      : 'We saved your spot. We\'ll be in touch the moment driver applications open.'}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm font-semibold text-[#C0392B]">{error}</p>
            )}

            <p className="mt-5 flex items-center gap-1.5 text-xs text-[#8A8880]">
              <ShieldCheck className="h-3.5 w-3.5" /> No spam. One email when applications open, that&apos;s it.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY NOW (context) ── */}
      <section className="px-5 py-6 sm:px-8">
        <div className="animate-on-scroll mx-auto max-w-2xl rounded-2xl border border-black/5 bg-[#FBFAF7] p-6 text-center sm:p-7">
          <p className="leading-relaxed text-[#52504A]">
            Other delivery platforms have paused driver signups in Edmonton. Their waitlists
            stretch for months, if they have one at all. We&apos;re launching fresh and we need
            drivers who want to be part of something real from day one.
          </p>
          <p className="mt-3 text-sm font-bold text-[#B7791F]">
            Early drivers get priority placement once we go live.
          </p>
        </div>
      </section>

      {/* ── HOW PAY WORKS ── */}
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="animate-on-scroll mb-10 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#B7791F]">The pay</p>
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Fixed per drop. Farther pays more.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#52504A]">
              No surge games, no mystery math. Every delivery pays a flat base, and the rate
              steps up as the distance grows. You always know what a run is worth before you accept it.
            </p>
          </div>

          {/* distance → pay tiers (illustrative) */}
          <div className="animate-on-scroll grid gap-4 sm:grid-cols-3">
            {[
              { range: 'Short hops', sub: 'Close-by drops', tier: 'Base rate' },
              { range: 'Mid-range', sub: 'Across the zone', tier: 'Base + distance' },
              { range: 'Long runs', sub: 'Edge of the zone', tier: 'Highest payout' },
            ].map((t, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4 flex items-center gap-2">
                  {Array.from({ length: i + 1 }).map((_, k) => (
                    <span key={k} className="h-2 w-2 rounded-full bg-[#EAB308]" />
                  ))}
                  {Array.from({ length: 2 - i }).map((_, k) => (
                    <span key={k} className="h-2 w-2 rounded-full bg-black/10" />
                  ))}
                </div>
                <p className="text-lg font-black">{t.range}</p>
                <p className="text-sm text-[#8A8880]">{t.sub}</p>
                <p className="mt-4 inline-block rounded-full bg-[#EAB308]/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B7791F]">
                  {t.tier}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-[#9A988F]">
            Exact rates shared when applications open. Tips are always 100% yours.
          </p>
        </div>
      </section>

      {/* ── WE'RE BRINGING CHANGE: in-app navigation in your language ── */}
      <section className="bg-[#141414] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Copy */}
          <div className="animate-on-scroll order-2 md:order-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-3.5 py-1.5">
              <Navigation className="h-3.5 w-3.5 text-[#EAB308]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#EAB308]">We&apos;re bringing change</span>
            </div>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Navigation that <span className="text-[#EAB308]">speaks your language</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              Turn-by-turn navigation is built right into the Taeam driver app, so there&apos;s no
              jumping between apps. And it talks to you in the language you actually think in.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-sm">
              {LANGUAGES.map((l) => (
                <div
                  key={l.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[#EAB308]/40"
                >
                  <span className="text-sm font-bold text-white/90">{l.label}</span>
                  <span className="text-lg text-[#EAB308]">{l.native}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/50">
              <Sparkles className="h-4 w-4 text-[#EAB308]" /> More languages on the way.
            </p>
          </div>

          {/* Phone screenshot */}
          <div className="animate-on-scroll order-1 flex justify-center md:order-2">
            <div className="relative w-[230px] overflow-hidden rounded-[2rem] border-[6px] border-[#262626] bg-[#262626] shadow-2xl sm:w-[260px]">
              <Image
                src="/driver-app-home.png"
                alt="Taeam driver app with built-in navigation"
                width={387}
                height={867}
                className="h-auto w-full rounded-[1.6rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DRIVE WITH US ── */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="animate-on-scroll mb-10 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Why drive with us</h2>
            <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-[#EAB308]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PERKS.map((perk, i) => (
              <div
                key={i}
                className={`animate-on-scroll stagger-${i + 1} group rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)] transition-all hover:border-[#EAB308]/30`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAB308]/12 text-[#B7791F] transition-colors group-hover:bg-[#EAB308] group-hover:text-black">
                  {perk.icon}
                </div>
                <h3 className="text-base font-bold">{perk.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B6963]">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="animate-on-scroll mb-8 text-center text-2xl font-black uppercase tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`animate-on-scroll stagger-${i + 1} flex items-center gap-4 rounded-xl border border-black/5 bg-white px-5 py-4`}
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#EAB308]">
                  <span className="text-xs font-black text-black">{i + 1}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#3A3833]">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#8A8880] transition-colors hover:text-[#B7791F]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to main page
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="py-6 text-center">
        <p className="text-xs uppercase tracking-wider text-[#A8A69E]">© 2026 Taeam Technologies Inc.</p>
      </div>
    </main>
  );
}
