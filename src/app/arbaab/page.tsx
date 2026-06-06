'use client';

import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowLeft, Send, Sun, Moon, Search, ShoppingCart, RotateCcw, Star, Navigation,
} from 'lucide-react';
import Link from 'next/link';

type DemoMessage = { role: 'user' | 'arbaab'; text: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// iOS-style appearance swap. Uses the View Transitions API to cross-dissolve
// the whole page; falls back to an instant swap where it isn't supported.
function applyAppearance(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

// Static (non-theme) demos. The theme demo is handled specially so it can
// toggle the whole page.
const DEMO_SEQUENCES: Record<string, { user: string; reply: string; delay: number }> = {
  search: {
    user: 'Find me something spicy',
    reply: "Taeam's Donair has a jalapeño shawarma people keep coming back for. Want me to open it?",
    delay: 1100,
  },
  reorder: {
    user: 'Reorder my last meal',
    reply: "Your last order was a Chicken Shawarma Platter from Taeam's Donair, $16.99. Add it to your cart?",
    delay: 1000,
  },
  rewards: {
    user: 'What are my rewards?',
    reply: "You've got 1,240 Taeam Points. Your daily check-in and 5 reward videos just refreshed, ready to watch and claim.",
    delay: 950,
  },
};

const CAPABILITIES = [
  { icon: <Search className="h-5 w-5" />, title: 'Search food & menus', desc: 'Describe a craving and Arbaab searches every restaurant for you.' },
  { icon: <ShoppingCart className="h-5 w-5" />, title: 'Add to cart', desc: 'Say what you want and it finds it, then drops it in your cart.' },
  { icon: <RotateCcw className="h-5 w-5" />, title: 'Reorder in one tap', desc: 'Remembers past orders and preps a reorder instantly.' },
  { icon: <Navigation className="h-5 w-5" />, title: 'Navigate the app', desc: 'Open any screen by asking: settings, orders, profile.' },
  { icon: <Sun className="h-5 w-5" />, title: 'Control settings', desc: 'Change theme, language and notifications through chat.' },
  { icon: <Star className="h-5 w-5" />, title: 'Track rewards', desc: 'Check points and redeem without leaving the chat.' },
];

export default function ArbaabPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);          // page is LIGHT by default
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('Switch to dark mode');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  const runDemo = async (key: string) => {
    if (isTyping) return;
    setActiveDemo(key);

    if (key === 'theme') {
      const goingDark = !isDark;
      const userText = goingDark ? 'Switch to dark mode' : 'Switch to light mode';
      const reply = goingDark
        ? 'Done. Lights off, switching to dark mode. 🌙'
        : 'Done. Bringing the lights back up. ☀️';
      setMessages([{ role: 'user', text: userText }]);
      await wait(320);
      setIsTyping(true);
      await wait(900);
      setIsTyping(false);
      setMessages([{ role: 'user', text: userText }, { role: 'arbaab', text: reply }]);
      await wait(420);
      // iOS-style cross-dissolve of the whole page (View Transitions API).
      applyAppearance(() => {
        setIsDark(goingDark);
        setInputText(goingDark ? 'Switch to light mode' : 'Switch to dark mode');
      });
      return;
    }

    const seq = DEMO_SEQUENCES[key];
    if (!seq) return;
    setMessages([{ role: 'user', text: seq.user }]);
    await wait(320);
    setIsTyping(true);
    await wait(seq.delay);
    setIsTyping(false);
    setMessages([{ role: 'user', text: seq.user }, { role: 'arbaab', text: seq.reply }]);
  };

  const handleSend = () => {
    const t = inputText.toLowerCase().trim();
    if (t.includes('dark') || t.includes('light') || t.includes('mode')) return runDemo('theme');
    if (t.includes('spicy') || t.includes('find')) return runDemo('search');
    if (t.includes('reorder') || t.includes('again')) return runDemo('reorder');
    if (t.includes('reward') || t.includes('point')) return runDemo('rewards');
    return runDemo('theme');
  };

  const themeChip = {
    key: 'theme',
    label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
    icon: isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />,
  };
  const chips = [
    themeChip,
    { key: 'search', label: 'Find me something spicy', icon: <Search className="h-3.5 w-3.5" /> },
    { key: 'reorder', label: 'Reorder my last meal', icon: <RotateCcw className="h-3.5 w-3.5" /> },
    { key: 'rewards', label: 'My rewards', icon: <Star className="h-3.5 w-3.5" /> },
  ];

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden font-sans antialiased transition-colors duration-300 ${
        isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#F6F4EF] text-[#1A1A1A]'
      }`}
    >
      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b px-5 py-3.5 backdrop-blur-md transition-colors duration-300 sm:px-8 ${
          isDark ? 'border-white/5 bg-[#0f0f0f]/85' : 'border-black/5 bg-[#F6F4EF]/85'
        }`}
      >
        <Link
          href="/"
          className={`group flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-60 ${
            isDark ? 'text-[#EAB308]' : 'text-[#1A1A1A]'
          }`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {/* ── HERO ── */}
      <section className="px-5 pt-28 text-center sm:px-8 sm:pt-32">
        <div className={`mx-auto max-w-3xl ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-3.5 py-1.5">
            <img src="/takinator_avatar.png" className="h-3.5 w-3.5 object-contain" alt="Arbaab" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7791F]">AI Food Assistant</span>
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
            Meet <span className="text-[#B7791F]">Arbaab</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed sm:text-xl ${isDark ? 'text-white/60' : 'text-[#52504A]'}`}>
            Arabic for &ldquo;boss&rdquo;. It runs the errands so you don&apos;t have to.
            Tap a command below and watch it work.
          </p>
        </div>
      </section>

      {/* ── DEMO + CAPABILITIES ── */}
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-14">

          {/* iPhone mockup */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[310px]">
              {/* bezel — iPhone 17 Pro "Cosmic Orange" titanium */}
              <div className="relative rounded-[3rem] border border-[#7e3f1d] bg-gradient-to-b from-[#e3884c] via-[#c0612f] to-[#974823] p-[10px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)]">
                {/* side buttons */}
                <span className="absolute -left-[2.5px] top-[130px] h-8 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
                <span className="absolute -left-[2.5px] top-[182px] h-12 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
                <span className="absolute -left-[2.5px] top-[242px] h-12 w-[3px] rounded-l-sm bg-[#7e3f1d]" />
                <span className="absolute -right-[2.5px] top-[195px] h-16 w-[3px] rounded-r-sm bg-[#7e3f1d]" />
                {/* screen */}
                <div
                  className={`relative flex h-[600px] flex-col overflow-hidden rounded-[2.4rem] ring-2 ring-black transition-colors duration-300 ${
                    isDark ? 'bg-[#0f0f0f]' : 'bg-white'
                  }`}
                >
                  {/* dynamic island */}
                  <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

                  {/* chat header */}
                  <div
                    className={`flex items-center gap-3 border-b px-4 pb-3 pt-9 transition-colors duration-300 ${
                      isDark ? 'border-white/5 bg-[#0d0d0d]' : 'border-black/5 bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAB308] shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                      <img src="/takinator_avatar.png" className="h-4 w-4 object-contain" alt="Arbaab" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Arbaab</p>
                      <p className={`text-[11px] ${isDark ? 'text-white/40' : 'text-[#9A988F]'}`}>Your personal food boss</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#1E8A3F]/12 px-2 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1E8A3F]" />
                      <span className="text-[10px] font-bold text-[#1E8A3F]">Online</span>
                    </span>
                  </div>

                  {/* messages */}
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                    {messages.length === 0 && !isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAB308]">
                          <img src="/takinator_avatar.png" className="h-3.5 w-3.5 object-contain" alt="Arbaab" />
                        </div>
                        <div className={`max-w-[78%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] leading-relaxed ${isDark ? 'bg-white/5 text-white/80' : 'bg-[#F1EFE9] text-[#52504A]'}`}>
                          Assalamu Alaikum! Tap a command below and watch what happens.
                        </div>
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {msg.role === 'arbaab' && (
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAB308]">
                            <img src="/takinator_avatar.png" className="h-3.5 w-3.5 object-contain" alt="Arbaab" />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                            msg.role === 'user'
                              ? 'rounded-tr-sm bg-[#EAB308] font-medium text-black'
                              : isDark
                                ? 'rounded-tl-sm bg-white/5 text-white/80'
                                : 'rounded-tl-sm bg-[#F1EFE9] text-[#52504A]'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAB308]">
                          <img src="/takinator_avatar.png" className="h-3.5 w-3.5 object-contain" alt="Arbaab" />
                        </div>
                        <div className={`rounded-2xl rounded-tl-sm px-3.5 py-3 ${isDark ? 'bg-white/5' : 'bg-[#F1EFE9]'}`}>
                          <div className="flex h-3 items-center gap-1.5">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EAB308]" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EAB308]" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EAB308]" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* input */}
                  <div className={`border-t px-3 py-3 transition-colors duration-300 ${isDark ? 'border-white/5 bg-[#0d0d0d]' : 'border-black/5 bg-[#FAFAF8]'}`}>
                    <div className="mb-2.5 flex flex-wrap gap-1.5">
                      {chips.map((chip) => (
                        <button
                          key={chip.key}
                          onClick={() => { setInputText(chip.label); runDemo(chip.key); }}
                          disabled={isTyping}
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all disabled:opacity-40 ${
                            activeDemo === chip.key
                              ? 'border-[#EAB308] bg-[#EAB308] text-black'
                              : isDark
                                ? 'border-white/10 bg-white/5 text-white/60 hover:border-[#EAB308]/40 hover:text-[#EAB308]'
                                : 'border-black/10 bg-white text-[#6B6963] hover:border-[#EAB308]/50 hover:text-[#B7791F]'
                          }`}
                        >
                          {chip.icon}
                          {chip.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask Arbaab anything…"
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-all ${
                          isDark
                            ? 'border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#EAB308]/40'
                            : 'border-black/10 bg-white text-[#1A1A1A] placeholder-[#9A988F] focus:border-[#EAB308]/60'
                        }`}
                      />
                      <button
                        onClick={handleSend}
                        disabled={isTyping}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAB308] text-black transition-colors hover:bg-yellow-400 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className={`mt-4 text-center text-xs ${isDark ? 'text-white/40' : 'text-[#9A988F]'}`}>
                Simulated demo. The real Arbaab lives in the Taeam app.
              </p>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              One chat. <span className="text-[#B7791F]">Runs the whole app.</span>
            </h2>
            <p className={`mt-3 text-[15px] leading-relaxed ${isDark ? 'text-white/55' : 'text-[#52504A]'}`}>
              Try &ldquo;Switch to dark mode&rdquo; in the phone and Arbaab changes the theme
              for real. That&apos;s the idea: talk to it, and it does the work.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 transition-colors duration-300 ${
                    isDark ? 'border-white/5 bg-[#141414]' : 'border-black/5 bg-white shadow-[0_8px_24px_-20px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAB308]/12 text-[#B7791F]">
                    {cap.icon}
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{cap.title}</h3>
                  <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-white/45' : 'text-[#6B6963]'}`}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <div
          className={`mx-auto mt-12 max-w-xl rounded-2xl border p-5 text-center transition-colors duration-300 ${
            isDark ? 'border-white/5 bg-[#141414] text-white/55' : 'border-black/5 bg-white text-[#6B6963]'
          }`}
        >
          <p className="text-xs leading-relaxed">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Your data stays yours.</span>{' '}
            Arbaab only accesses what you allow: search, order history and app navigation.
            No payment info, no personal details. You control every permission in Settings.
          </p>
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className={`group inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark ? 'text-white/40 hover:text-[#EAB308]' : 'text-[#8A8880] hover:text-[#B7791F]'
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to main page
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#EAB308]/15 to-transparent" />
      <div className="py-6 text-center">
        <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-[#A8A69E]'}`}>
          © 2026 Taeam Technologies Inc.
        </p>
      </div>
    </main>
  );
}
