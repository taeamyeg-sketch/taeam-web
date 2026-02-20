'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShoppingBag, ChefHat, Flame, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function FridgePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [fridgeStatus, setFridgeStatus] = useState<'restocking' | 'countdown' | 'live'>('restocking');

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

    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      setCurrentTime(`${displayHour}:${min} ${ampm}`);

      if (hour >= 17 && hour < 22) setFridgeStatus('live');
      else if (hour >= 15 && hour < 17) setFridgeStatus('countdown');
      else setFridgeStatus('restocking');
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => { clearInterval(interval); observer.disconnect(); };
  }, []);

  const howItWorks = [
    {
      time: '3:00 PM',
      icon: <Clock className="w-5 h-5" />,
      label: 'Upload Deadline',
      desc: 'Chefs upload their fresh batches before this cutoff. After 3 PM, no new listings.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20',
    },
    {
      time: '5:00 PM',
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'The Fridge Opens',
      desc: "The Fridge goes live. Customers can browse and order everything that's been listed that day.",
      color: 'text-[#EAB308]',
      bg: 'bg-[#EAB308]/10',
      border: 'border-[#EAB308]/20',
    },
    {
      time: '10:00 PM',
      icon: <Flame className="w-5 h-5" />,
      label: 'Zero Carry-Over',
      desc: 'The Fridge closes and every unsold item is cleared. Nothing carries over to tomorrow. Ever.',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/20',
    },
  ];

  const categories = [
    { emoji: '🥐', label: 'Pastries' },
    { emoji: '🧁', label: 'Cupcakes' },
    { emoji: '🍪', label: 'Cookies' },
    { emoji: '🥧', label: 'Pies & Tarts' },
    { emoji: '🍰', label: 'Cakes' },
    { emoji: '🍡', label: 'Sweets' },
    { emoji: '🍮', label: 'Baklava' },
    { emoji: '🍫', label: 'Brownies' },
  ];

  const chefRequirements = [
    'Pass our food safety quiz (covers Alberta Health Services requirements for home kitchens)',
    'Submit your application with photos of your kitchen and a sample of your work',
    'Complete a quick identity verification',
    'Get approved by our team. We review every application personally.',
    'Start listing your fresh batches. We handle payments, delivery, and customers.',
  ];

  const statusConfig = {
    live: { label: 'OPEN NOW', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', dot: 'bg-green-400' },
    countdown: { label: 'OPENS SOON', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
    restocking: { label: 'CLOSED', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30', dot: 'bg-gray-400' },
  };

  const status = statusConfig[fridgeStatus];

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
      <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EAB308]/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />

        <div className={`relative z-10 text-center max-w-3xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>

          {/* Live status badge */}
          {mounted && (
            <div className={`inline-flex items-center gap-2 ${status.bg} border ${status.border} rounded-full px-4 py-2 mb-6`}>
              <div className={`w-2 h-2 ${status.dot} rounded-full ${fridgeStatus === 'live' ? 'animate-pulse' : ''}`} />
              <span className={`${status.color} text-xs font-bold uppercase tracking-widest`}>
                {status.label}
                {currentTime && ` · ${currentTime}`}
              </span>
            </div>
          )}

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            The <span className="text-gradient">Fridge</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Edmonton&apos;s homemade dessert marketplace. Baked fresh that day. When it&apos;s gone, it&apos;s gone.
          </p>
        </div>
      </section>

      {/* What is it */}
      <section className="px-5 sm:px-8 pb-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="animate-on-scroll bg-[#141414] border border-white/5 rounded-2xl p-7">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              What is The Fridge?
            </h2>
            <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
              <p>
                The Fridge is where Edmonton&apos;s home bakers sell their fresh-baked goods: baklava, brownies, kunafa, macarons, cookies, pies, and more.
              </p>
              <p>
                Every item is <span className="text-white font-semibold">made that same day</span> by a verified local chef. When a batch sells out, it&apos;s gone. The next batch comes tomorrow.
              </p>
              <p>
                No factory goods. No week-old pastries. Just real home cooking from real people in your city.
              </p>
            </div>
          </div>

          <div className="animate-on-scroll stagger-2 bg-[#141414] border border-white/5 rounded-2xl p-7">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              Why It&apos;s Different
            </h2>
            <div className="space-y-3">
              {[
                '100% halal. Every chef is vetted.',
                'Camera-verified freshness. No old photos.',
                'Limited batches per chef per day',
                'Same-day only. Zero carry-over.',
                'AHS-compliant home kitchen requirements',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works — timeline */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-8 text-center animate-on-scroll">
            Every Single Day
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#EAB308]/40 via-[#EAB308]/20 to-transparent" />

            <div className="space-y-6">
              {howItWorks.map((step, i) => (
                <div
                  key={i}
                  className={`animate-on-scroll stagger-${i + 1} relative flex items-start gap-5 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className={`absolute left-[17px] sm:left-1/2 w-3 h-3 rounded-full ${step.bg.replace('/10', '')} border-2 border-[#0f0f0f] -translate-x-[5px] mt-4 flex-shrink-0 z-10`}
                    style={{ backgroundColor: step.color.replace('text-', '') === 'text-[#EAB308]' ? '#EAB308' : undefined }}
                  />

                  {/* Content */}
                  <div className={`ml-10 sm:ml-0 sm:w-[45%] ${i % 2 === 0 ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <div className={`${step.bg} border ${step.border} rounded-2xl p-5`}>
                      <div className={`flex items-center gap-2 ${step.color} mb-2`}>
                        {step.icon}
                        <span className="font-black text-sm uppercase tracking-wider">{step.time}</span>
                        <span className="font-bold text-xs opacity-70">· {step.label}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16 animate-on-scroll">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6 text-center">
            What You&apos;ll Find
          </h2>
          <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`animate-on-scroll stagger-${(i % 6) + 1} flex flex-col items-center gap-2 bg-[#141414] border border-white/5 hover:border-[#EAB308]/20 rounded-xl p-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.05)] cursor-default`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wide text-center leading-tight">{cat.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs mt-4">And much more, whatever chefs list that day</p>
        </div>

        {/* For Chefs / Home Bakers */}
        <div className="animate-on-scroll max-w-2xl mx-auto">
          <div className="bg-[#1a1a1a] border border-[#EAB308]/15 rounded-3xl p-7 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#EAB308] flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Want to Sell Your Baking?
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              If you bake at home and want to turn it into income, The Fridge is built for you.
              We handle the orders, payments, and delivery. You just bake what you love.
            </p>

            <div className="space-y-3 mb-6">
              {chefRequirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#EAB308] text-[9px] font-black">{i + 1}</span>
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed">{req}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-orange-400/10 border border-orange-400/20 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <p className="text-orange-300/80 text-xs leading-relaxed">
                Chef applications open when The Fridge launches. Join the main waitlist to get notified first.
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-12 animate-on-scroll">
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
        <p className="text-gray-700 text-xs tracking-wider uppercase">© 2026 Taeam Inc.</p>
      </div>
    </main>
  );
}
