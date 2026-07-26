'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, Calendar, Phone,
  ShieldCheck, UtensilsCrossed, Image as ImageIcon, MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { BACKEND_URL } from '@/lib/backend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  label: string | null;
  capacity: number;
  spotsLeft: number;
  isFull: boolean;
};
type Day = { date: string; slots: Slot[] };
type Confirmed = { date: string; startTime: string; endTime: string; label?: string | null };

// ── timezone-safe formatters ────────────────────────────────────────────────
// slot_date / start_time / end_time arrive as raw wall-clock strings for
// Edmonton ("2026-06-23", "13:30:00"). We format by component math only, never
// through Date.parse of the ISO string (which would treat it as UTC and shift
// the clock). The guest sees the exact time we stored.
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function fmtDate(d: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || '');
  if (!m) return d || '';
  const y = +m[1], mo = +m[2], day = +m[3];
  const weekday = WEEKDAYS[new Date(y, mo - 1, day).getDay()]; // local midnight, weekday only
  return `${weekday}, ${MONTHS[mo - 1]} ${day}`;
}
function fmtTime(t: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(t || '');
  if (!m) return t || '';
  let h = +m[1];
  const min = m[2];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${min} ${ampm}`;
}
function fmtRange(s: string, e: string): string {
  return `${fmtTime(s)} to ${fmtTime(e)}`;
}

// Guest-facing "how this works" steps. Plain language, matches the email recap.
const STEPS = [
  'Pick a time window that still has space.',
  'Add your name, email, and phone, then confirm.',
  'You get a confirmation email right away.',
  'Before your window, we send you the app download link.',
  'You install the app and order from Pitavibe.',
  'We bring it to your door.',
];

export default function ReservePage() {
  const [mounted, setMounted] = useState(false);

  const [days, setDays] = useState<Day[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState('');

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const [emailed, setEmailed] = useState(false);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSlotsError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/reserve/slots`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'failed');
      setDays(Array.isArray(data.days) ? data.days : []);
    } catch {
      setDays([]);
      setSlotsError('We could not load the windows just now. Please refresh and try again.');
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
    loadSlots();
  }, [loadSlots]);

  // Re-register the scroll observer when content changes (slots load async,
  // confirmed view swaps in). animate-on-scroll starts hidden, so anything
  // rendered after the first pass needs to be observed again.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    }, 80);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, [mounted, days, confirmed]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(t);
  }, [error]);

  // Find the selected slot + its day, for the form summary.
  let selectedSlot: Slot | null = null;
  let selectedDate = '';
  if (selectedSlotId && days) {
    for (const d of days) {
      const s = d.slots.find((x) => x.id === selectedSlotId);
      if (s) { selectedSlot = s; selectedDate = d.date; break; }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) { setError('Pick a time window above first.'); return; }
    const cName = name.trim();
    const cEmail = email.trim().toLowerCase();
    const cPhone = phone.trim();
    if (!cName) { setError('Please add your name.'); return; }
    if (!EMAIL_RE.test(cEmail)) { setError('Please enter a valid email.'); return; }
    if (cPhone.replace(/\D/g, '').length < 7) { setError('Please add a phone number we can reach you at.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cName, email: cEmail, phone: cPhone, slotId: selectedSlotId }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setConfirmed(data.slot as Confirmed);
        setEmailed(!!data.emailed);
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        return;
      }

      if (data.error === 'slot_full' || data.error === 'slot_unavailable') {
        setError('Sorry, that window just filled up. Please pick another one.');
        setSelectedSlotId(null);
        loadSlots();
      } else if (data.error === 'slot_not_found') {
        setError('That window is no longer available. Please pick another one.');
        setSelectedSlotId(null);
        loadSlots();
      } else if (data.error === 'invalid_phone') {
        setError('Please add a phone number we can reach you at.');
      } else if (data.error === 'invalid_email') {
        setError('Please enter a valid email.');
      } else if (data.error === 'invalid_name') {
        setError('Please add your name.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-svh bg-[#F6F4EF] font-sans text-[#1A1A1A] antialiased">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-black/5 bg-[#F6F4EF]/85 py-3.5 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(0.875rem,env(safe-area-inset-top))] backdrop-blur-md sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))]">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-[#1A1A1A] transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {confirmed ? (
        /* ───────────────────────── CONFIRMED STATE ───────────────────────── */
        <section className="px-5 pb-20 pt-[96px] sm:px-8 sm:pt-[120px]">
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-3xl border border-[#1E8A3F]/25 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1E8A3F] via-[#36A85A] to-[#1E8A3F]" />
              <div className="p-7 text-center sm:p-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E8A3F]/10">
                  <CheckCircle className="h-9 w-9 text-[#1E8A3F]" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">You&apos;re booked!</h1>

                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#EAB308]/30 bg-[#FFF6E5] p-5 text-left">
                  <p className="text-xs font-black uppercase tracking-widest text-[#B7791F]">Your window</p>
                  <p className="mt-1.5 text-xl font-black">{fmtDate(confirmed.date)}</p>
                  <p className="mt-0.5 text-base font-semibold text-[#52504A]">
                    {fmtRange(confirmed.startTime, confirmed.endTime)}, Edmonton time
                  </p>
                </div>

                <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[#52504A]">
                  {emailed
                    ? 'Check your inbox for the confirmation we just sent.'
                    : 'Your spot is saved.'}{' '}
                  Before your window we&apos;ll send you the link to download the app. Then you order from
                  Pitavibe and we bring it to your door.
                </p>

                <p className="mt-3 text-[15px] font-semibold text-[#1A1A1A]">
                  Thanks for being one of the first to try Taeam. Looking forward to seeing you.
                </p>

                <Link
                  href="/"
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98]"
                >
                  Back to Taeam
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ───────────────────────── PITAVIBE INTRO ───────────────────────── */}
          <section className="px-3 pt-[68px] sm:px-5 sm:pt-[76px]">
            <div className={`relative mx-auto max-w-4xl ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              {/* PLACEHOLDER hero. Founder: drop a real <Image src="/pitavibe-hero.jpg" .../>
                  here later (images are unoptimized in this static export). */}
              <div className="relative flex aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#EAB308]/20 bg-gradient-to-br from-[#FFF6E5] via-[#F6F4EF] to-[#F1E7CE] sm:aspect-[1376/620] sm:rounded-3xl">
                <span className="inline-flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-[#EAB308]/30 bg-white/70 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-widest text-[#B7791F] backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EAB308]" /> Edmonton · Invite-only soft launch
                </span>
                <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#1A1A1A] min-[400px]:text-5xl sm:text-7xl">Pitavibe</h1>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#A8895A]">
                  <ImageIcon className="h-3.5 w-3.5" /> Photo coming soon
                </p>
              </div>
            </div>
          </section>

          <section className="px-5 pb-2 pt-8 text-center sm:px-8 sm:pt-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Reserve your <span className="text-[#B7791F]">Pitavibe</span> window
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#52504A]">
              Pitavibe makes fresh halal pitas and bowls in Edmonton. Warm bread, good spice, the
              kind of food you want on a weeknight.
            </p>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#6B6963]">
              We&apos;re opening to a small group first. Pick a time below and we&apos;ll bring it to your door.
            </p>
          </section>

          {/* a couple of photo placeholders — founder swaps these for real shots */}
          <section className="px-5 pt-6 sm:px-8">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {['The pitas', 'The bowls', 'The spot'].map((cap, i) => (
                <div
                  key={i}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl border border-black/5 bg-white text-[#C7BFA8] ${i === 2 ? 'hidden sm:flex' : ''}`}
                >
                  <UtensilsCrossed className="h-6 w-6" />
                  <span className="mt-2 text-[11px] font-bold uppercase tracking-widest">{cap}</span>
                  <span className="text-[10px] text-[#C7BFA8]">Photo coming soon</span>
                </div>
              ))}
            </div>
          </section>

          {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
          <section className="px-5 py-14 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-2xl">
              <div className="animate-on-scroll mb-8 text-center">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#B7791F]">The plan</p>
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">How this works</h2>
              </div>
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className="animate-on-scroll flex items-center gap-4 rounded-xl border border-black/5 bg-white px-5 py-4"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#EAB308]">
                      <span className="text-xs font-black text-black">{i + 1}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#3A3833]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───────────────────────── SLOT PICKER ───────────────────────── */}
          <section className="px-5 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="animate-on-scroll mb-8 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">Pick your window</h2>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-[#52504A]">
                  Each window holds one delivery. When a window fills up it closes on its own.
                </p>
              </div>

              {loadingSlots ? (
                <div className="space-y-6">
                  {[0, 1].map((d) => (
                    <div key={d}>
                      <div className="mb-3 h-4 w-40 animate-pulse rounded bg-black/10" />
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {[0, 1, 2].map((s) => (
                          <div key={s} className="h-[88px] animate-pulse rounded-2xl bg-black/[0.06]" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : slotsError ? (
                <div className="rounded-2xl border border-[#C0392B]/20 bg-[#C0392B]/5 p-6 text-center">
                  <p className="text-sm font-semibold text-[#C0392B]">{slotsError}</p>
                  <button
                    onClick={loadSlots}
                    className="mt-4 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98]"
                  >
                    Try again
                  </button>
                </div>
              ) : days && days.length > 0 ? (
                <div className="space-y-7">
                  {days.map((day) => (
                    <div key={day.date}>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#1A1A1A]">
                        <Calendar className="h-4 w-4 text-[#B7791F]" />
                        {fmtDate(day.date)}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {day.slots.map((slot) => {
                          const selected = slot.id === selectedSlotId;
                          if (slot.isFull) {
                            return (
                              <div
                                key={slot.id}
                                aria-disabled
                                className="cursor-not-allowed rounded-2xl border border-black/5 bg-[#F1EFE9] px-4 py-4 opacity-80"
                              >
                                <p className="flex items-center gap-1.5 text-sm font-bold text-[#A8A69E] line-through">
                                  <Clock className="h-3.5 w-3.5" />
                                  {fmtRange(slot.startTime, slot.endTime)}
                                </p>
                                {slot.label && (
                                  <p className="mt-1 text-xs text-[#B8B5AC]">{slot.label}</p>
                                )}
                                <p className="mt-2 inline-block rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#A8A69E]">
                                  Full
                                </p>
                              </div>
                            );
                          }
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => { setSelectedSlotId(slot.id); setError(''); }}
                              className={`rounded-2xl border px-4 py-4 text-left transition-all active:scale-[0.98] ${
                                selected
                                  ? 'border-[#EAB308] bg-[#EAB308]/10 ring-2 ring-[#EAB308]/30'
                                  : 'border-black/10 bg-white hover:border-[#EAB308]/50 hover:shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]'
                              }`}
                            >
                              <p className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A]">
                                <Clock className={`h-3.5 w-3.5 ${selected ? 'text-[#B7791F]' : 'text-[#9A988F]'}`} />
                                {fmtRange(slot.startTime, slot.endTime)}
                              </p>
                              {slot.label && (
                                <p className="mt-1 text-xs text-[#8A8880]">{slot.label}</p>
                              )}
                              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1E8A3F]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1E8A3F]" />
                                {slot.capacity > 1 ? `${slot.spotsLeft} spot${slot.spotsLeft === 1 ? '' : 's'} left` : 'Open'}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
                  <p className="text-[15px] leading-relaxed text-[#52504A]">
                    All the windows are spoken for right now. Follow{' '}
                    <a href="https://instagram.com/taeam.ca" target="_blank" rel="noreferrer noopener" className="font-bold text-[#B7791F] underline underline-offset-2">@taeam.ca</a>{' '}
                    and we&apos;ll post when more open up.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ───────────────────────── FORM ───────────────────────── */}
          <section className="px-5 py-14 sm:px-8 sm:py-16">
            <div className="animate-on-scroll mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#EAB308]/30 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#EAB308] via-[#F4C843] to-[#EAB308]" />
              <div className="p-7 sm:p-10">
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">Your details</h2>

                {/* selected window summary */}
                <div className="mt-4 rounded-2xl border border-black/5 bg-[#FBFAF7] px-5 py-4">
                  {selectedSlot ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-widest text-[#B7791F]">Your window</p>
                      <p className="mt-1 text-base font-bold text-[#1A1A1A]">
                        {fmtDate(selectedDate)}, {fmtRange(selectedSlot.startTime, selectedSlot.endTime)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-[#8A8880]">Pick a window above to continue.</p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={submitting}
                    autoComplete="name"
                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3.5 text-base text-[#1A1A1A] outline-none transition-all placeholder:text-[#9A988F] focus:border-[#EAB308] focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    disabled={submitting}
                    autoComplete="email"
                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3.5 text-base text-[#1A1A1A] outline-none transition-all placeholder:text-[#9A988F] focus:border-[#EAB308] focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    disabled={submitting}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3.5 text-base text-[#1A1A1A] outline-none transition-all placeholder:text-[#9A988F] focus:border-[#EAB308] focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30"
                  />

                  <button
                    type="submit"
                    disabled={submitting || !selectedSlotId}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'Booking…' : (
                      <>Confirm my window <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </button>
                </form>

                {error && <p className="mt-3 text-sm font-semibold text-[#C0392B]">{error}</p>}

                <p className="mt-5 flex items-center gap-1.5 text-xs text-[#8A8880]">
                  <Phone className="h-3.5 w-3.5" /> We only use your phone to coordinate the delivery.
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#8A8880]">
                  <ShieldCheck className="h-3.5 w-3.5" /> No spam. One confirmation now, then your download link before your window.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#8A8880] transition-colors hover:text-[#B7791F]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to main page
              </Link>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="flex items-center justify-center gap-1.5 py-6">
        <MapPin className="h-3 w-3 text-[#A8A69E]" />
        <p className="text-xs uppercase tracking-wider text-[#A8A69E]">Edmonton, Alberta · © 2026 Taeam Technologies Inc.</p>
      </div>
    </main>
  );
}
