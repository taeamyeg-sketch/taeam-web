'use client';

import Link from 'next/link';
import { Aref_Ruqaa } from 'next/font/google';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/halal/Reveal';

const calligraphy = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' });

const DETAILS = [
  {
    stat: '4 in 10',
    desc: 'fast-food spots could not say how their “halal” meat was slaughtered.',
    src: 'CBC Marketplace, 2024',
  },
  {
    stat: '12+',
    desc: 'halal certifiers in Canada. Nobody regulates the certifiers themselves.',
    src: 'CBC News, 2016',
  },
  {
    stat: 'Every protein',
    desc: 'Taeam shows the full breakdown. Hand or machine, stunned or not, before you order.',
    src: 'Taeam',
  },
];

export default function HalalTeaser() {
  return (
    <section id="halal" className="relative w-full overflow-hidden bg-[#0a0a0a] py-20 sm:py-28 md:py-36">
      {/* top hairline */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/30 to-transparent" />

      {/* faint calligraphy watermark */}
      <p
        className={`${calligraphy.className} pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[48vw] leading-none text-[#EAB308]/[0.045] md:text-[26rem]`}
      >
        أمانة
      </p>
      {/* subtle ambient accent (matches homepage treatment) */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#EAB308]/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        {/* Header */}
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#EAB308] sm:text-xs">
            The Halal Trust Gap
          </p>
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl">
            Is it <span className="text-gradient">really halal?</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Almost two million Muslims in Canada still walk out of restaurants unsure. Here is the gap, and how we close it.
          </p>
        </Reveal>

        {/* Scroll-revealed detail cards */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {DETAILS.map((d, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/5 bg-[#141414] p-6 transition-all duration-300 hover:border-[#EAB308]/30 hover:bg-[#171717]">
                <div className="text-2xl font-black tracking-tight text-[#EAB308] sm:text-3xl">{d.stat}</div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">{d.desc}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-600">{d.src}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.15} className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <p className={`${calligraphy.className} text-3xl text-[#EAB308]/80 sm:text-4xl`}>طعم الثقة</p>
          <Link
            href="/halal"
            onClick={() => sessionStorage.setItem('taeam_scroll_y', String(window.scrollY))}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#EAB308] px-7 py-4 text-sm font-black uppercase tracking-wide text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95"
          >
            <ShieldCheck className="h-4 w-4" />
            Read the research
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
