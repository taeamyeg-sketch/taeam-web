'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Refrigerator, ChefHat, Sparkles, Bell } from 'lucide-react';
import Link from 'next/link';

export default function FridgePage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const highlights = [
    { icon: <ChefHat className="w-5 h-5" />, title: 'Vetted Home Chefs', desc: 'Identity-verified, food-safety-quizzed, AHS-compliant home bakers from Edmonton.' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Fresh-Baked Daily', desc: 'Every item is made that same day. Camera-verified freshness. No factory goods.' },
    { icon: <Refrigerator className="w-5 h-5" />, title: 'Limited Batches', desc: 'When a batch sells out, it\'s gone. The next one comes tomorrow.' },
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
      <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 pt-32 pb-16 overflow-hidden min-h-[70vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EAB308]/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />

        <div className={`relative z-10 text-center max-w-3xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>

          {/* Coming Soon badge */}
          <div className="inline-flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
            <span className="text-[#EAB308] text-xs font-bold uppercase tracking-widest">
              Coming Soon
            </span>
          </div>

          {/* Fridge icon */}
          <div className="w-24 h-24 rounded-3xl bg-[#EAB308] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#EAB308]/20">
            <Refrigerator className="w-12 h-12 text-black" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            The <span className="text-gradient">Fridge</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-4">
            Edmonton&apos;s homemade dessert marketplace. Baked fresh by verified local chefs. Delivered to your door.
          </p>
          <p className="text-gray-500 text-base font-medium max-w-xl mx-auto leading-relaxed">
            We&apos;re building something special. The Fridge will launch after our core delivery platform is live and running.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-5 sm:px-8 pb-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {highlights.map((item, i) => (
            <div
              key={i}
              className={`${mounted ? 'animate-fade-in-up' : 'opacity-0'} bg-[#141414] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#EAB308]/20`}
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center text-[#EAB308] mb-4">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-sm uppercase tracking-tight mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div className="max-w-lg mx-auto">
          <div className="bg-[#1a1a1a] border border-[#EAB308]/15 rounded-3xl p-7 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center mx-auto mb-5">
              <Bell className="w-5 h-5 text-[#EAB308]" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
              Get Notified at Launch
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Be the first to know when The Fridge opens. Whether you want to buy or sell homemade desserts, drop your email below.
            </p>

            {submitted ? (
              <div className="bg-green-400/10 border border-green-400/20 rounded-xl px-5 py-4">
                <p className="text-green-400 text-sm font-semibold">You&apos;re on the list! We&apos;ll let you know when The Fridge is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#EAB308]/40 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#EAB308] text-black font-bold px-5 py-3 rounded-xl text-sm transition-all duration-300 hover:bg-yellow-400 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#EAB308] text-sm font-medium transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to main page
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#EAB308]/10 to-transparent" />
      <div className="text-center py-6">
        <p className="text-gray-700 text-xs tracking-wider uppercase">&copy; 2026 Taeam Technologies Inc.</p>
      </div>
    </main>
  );
}
