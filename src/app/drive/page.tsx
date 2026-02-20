'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Car, DollarSign, Clock, MapPin, CheckCircle, ChevronRight, Bell } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function DrivePage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }, 100);
    return () => observer.disconnect();
  }, []);

  const perks = [
    {
      icon: <Car className="w-6 h-6" />,
      title: "You pick your hours",
      desc: "Online when you want. Off when you don't. No shifts, no minimums.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Competitive pay per delivery",
      desc: "We don't nickel-and-dime. We want drivers who stick around, so we pay fairly.",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Orders you actually know",
      desc: "North and South Edmonton to start. Familiar streets, quick deliveries.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Respect for your time",
      desc: "One order at a time. No stacking three deliveries and making the last customer wait an hour.",
    },
  ];

  const steps = [
    "Download the Taeam Driver app",
    "Set up your profile and upload your documents",
    "Get approved by our team — usually within 48 hours",
    "Go online whenever you're ready to earn",
  ];

  return (
    <main className="bg-[#0f0f0f] min-h-screen font-sans overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#EAB308] font-bold text-sm hover:opacity-70 transition-opacity duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="w-10 h-10 rounded-full" />
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-5 sm:px-8 pt-28 pb-16 overflow-hidden">

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#EAB308]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />

        <div className={`relative z-10 text-center max-w-3xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
            <span className="text-[#EAB308] text-xs font-bold uppercase tracking-widest">Now Accepting Drivers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            Drive for <span className="text-gradient">Taeam</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            The big apps aren&apos;t taking new drivers right now. We are.
          </p>
        </div>
      </section>

      {/* Why Taeam */}
      <section className="px-5 sm:px-8 pb-20 max-w-5xl mx-auto">

        <div className={`text-center mb-12 ${mounted ? 'animate-on-scroll in-view' : 'animate-on-scroll'}`}>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
            Why Drive With Us
          </h2>
          <div className="w-12 h-0.5 bg-[#EAB308] mx-auto rounded-full" />
        </div>

        {/* Context blurb */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 mb-10 max-w-2xl mx-auto text-center animate-on-scroll">
          <p className="text-gray-300 leading-relaxed">
            Other delivery platforms have paused driver signups in Edmonton. Their waitlists stretch for months, if they even have one at all.
            We&apos;re launching fresh and we need drivers who want to be part of something real from the start.
          </p>
          <p className="text-[#EAB308] font-semibold mt-3 text-sm">
            Early drivers get priority placement once we go live.
          </p>
        </div>

        {/* Perks grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {perks.map((perk, i) => (
            <div
              key={i}
              className={`animate-on-scroll stagger-${i + 1} bg-[#141414] border border-white/5 hover:border-[#EAB308]/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.05)] group`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#EAB308]/10 flex items-center justify-center mb-4 text-[#EAB308] group-hover:bg-[#EAB308]/20 transition-colors duration-300">
                {perk.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{perk.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-8 text-center animate-on-scroll">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`animate-on-scroll stagger-${i + 1} flex items-start gap-4 bg-[#141414] border border-white/5 rounded-xl px-5 py-4`}
              >
                <div className="w-7 h-7 rounded-full bg-[#EAB308] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-black text-xs">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">{step}</p>
                <CheckCircle className="w-4 h-4 text-[#EAB308]/30 ml-auto flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon + notify */}
        <div className="text-center animate-on-scroll">
          <div className="inline-block bg-[#1a1a1a] border border-[#EAB308]/20 rounded-3xl p-8 sm:p-10 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#EAB308] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              <Bell className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              Driver Signups Opening Soon
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Leave your email and we&apos;ll reach out the moment driver applications open.
              First in, first priority.
            </p>

            {!submitted ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.includes('@')) return;
                  try {
                    await supabase.from('driver_signups').insert([{ email: email.trim() }]);
                  } catch (_) { /* silent — still show success */ }
                  setSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/10 focus:border-[#EAB308]/50 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none text-sm transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-[#EAB308] text-black font-black px-4 py-3 rounded-xl hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-1 text-sm w-full sm:w-auto"
                >
                  Notify Me <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[#EAB308] font-bold">
                <CheckCircle className="w-5 h-5" />
                Got it — we&apos;ll be in touch.
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#EAB308] text-sm font-medium transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to main page
            </Link>
          </div>
        </div>
      </section>

      {/* Footer line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#EAB308]/10 to-transparent" />
      <div className="text-center py-6">
        <p className="text-gray-700 text-xs tracking-wider uppercase">© 2026 Taeam Inc.</p>
      </div>
    </main>
  );
}
