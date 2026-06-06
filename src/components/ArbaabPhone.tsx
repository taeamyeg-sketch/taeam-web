'use client';

import { Sun, Search, Star, Send } from 'lucide-react';

/**
 * Static showcase of the Arbaab chat inside an iPhone frame — the same mockup
 * used on /arbaab, but non-interactive (a product shot, not a live demo).
 * Used on the homepage Arbaab section.
 */
export default function ArbaabPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* soft glow behind the phone */}
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[#EAB308]/10 blur-3xl" />

      {/* bezel — iPhone 17 Pro "Cosmic Orange" titanium */}
      <div className="relative rounded-[3rem] border border-[#7e3f1d] bg-gradient-to-b from-[#e3884c] via-[#c0612f] to-[#974823] p-[10px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
        {/* side buttons */}
        <span className="absolute -left-[2.5px] top-[120px] h-8 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
        <span className="absolute -left-[2.5px] top-[172px] h-12 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
        <span className="absolute -left-[2.5px] top-[232px] h-12 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
        <span className="absolute -right-[2.5px] top-[185px] h-16 w-[3px] rounded-r-sm bg-[#7e3f1d]" />
        {/* screen (light, like the real app default) */}
        <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[2.4rem] bg-white ring-2 ring-black">
          {/* dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* chat header */}
          <div className="flex items-center gap-3 border-b border-black/5 bg-[#FAFAF8] px-4 pb-3 pt-9">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAB308] shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <img src="/takinator_avatar.png" className="h-4 w-4 object-contain" alt="Arbaab" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1A1A1A]">Arbaab</p>
              <p className="text-[11px] text-[#9A988F]">Your personal food boss</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#1E8A3F]/12 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1E8A3F]" />
              <span className="text-[10px] font-bold text-[#1E8A3F]">Online</span>
            </span>
          </div>

          {/* messages */}
          <div className="flex-1 space-y-3 overflow-hidden px-4 py-4">
            <Bubble role="arbaab">Assalamu Alaikum! What are you craving?</Bubble>
            <Bubble role="user">Find me something spicy</Bubble>
            <Bubble role="arbaab">
              Taeam&apos;s Donair has a jalape&ntilde;o shawarma people keep coming back for. Want me to open it?
            </Bubble>
            <Bubble role="user">Yes, add it 🌶️</Bubble>
          </div>

          {/* input */}
          <div className="border-t border-black/5 bg-[#FAFAF8] px-3 py-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              <Chip icon={<Sun className="h-3.5 w-3.5" />} label="Switch to dark mode" />
              <Chip icon={<Search className="h-3.5 w-3.5" />} label="Find me something spicy" />
              <Chip icon={<Star className="h-3.5 w-3.5" />} label="My rewards" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] text-[#9A988F]">
                Ask Arbaab anything…
              </div>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAB308] text-black">
                <Send className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'arbaab'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAB308]">
          <img src="/takinator_avatar.png" className="h-3.5 w-3.5 object-contain" alt="Arbaab" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-[#EAB308] font-medium text-black'
            : 'rounded-tl-sm bg-[#F1EFE9] text-[#52504A]'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6B6963]">
      {icon}
      {label}
    </div>
  );
}
