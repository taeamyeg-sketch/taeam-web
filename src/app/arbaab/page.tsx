'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sun, Search, ShoppingCart, RotateCcw, Star, Navigation } from 'lucide-react';
import Link from 'next/link';

type DemoMessage = {
  role: 'user' | 'arbaab';
  text: string;
  delay?: number;
};

const DEMO_SEQUENCES: Record<string, DemoMessage[]> = {
  theme: [
    { role: 'user', text: 'Switch to light mode' },
    { role: 'arbaab', text: "Done. Switching to light mode for you.", delay: 900 },
  ],
  search: [
    { role: 'user', text: 'Find me something spicy' },
    { role: 'arbaab', text: "Found 3 restaurants with spicy options nearby. Al-Salam has a jalapeño shawarma that customers keep coming back for. Want me to open it?", delay: 1100 },
  ],
  reorder: [
    { role: 'user', text: 'Reorder my last meal' },
    { role: 'arbaab', text: "Your last order was a Chicken Shawarma Platter from Al-Salam Kitchen, $16.99. Want me to add it to your cart?", delay: 1000 },
  ],
  rewards: [
    { role: 'user', text: 'What are my rewards?' },
    { role: 'arbaab', text: "You have 1,240 Taeam Points (worth about $6.20 in credit). You're 260 points away from Silver tier. Keep it up.", delay: 950 },
  ],
  fridge: [
    { role: 'user', text: 'Is The Fridge open?' },
    { role: 'arbaab', text: "The Fridge opens at 5:00 PM and closes at 10:00 PM daily. It's currently restocking. New batches go live in a few hours. Want me to notify you when it opens?", delay: 1050 },
  ],
};

const DEMO_CHIPS = [
  { key: 'theme', label: 'Switch to light mode', icon: <Sun className="w-3.5 h-3.5" /> },
  { key: 'search', label: 'Find me something spicy', icon: <Search className="w-3.5 h-3.5" /> },
  { key: 'reorder', label: 'Reorder my last meal', icon: <RotateCcw className="w-3.5 h-3.5" /> },
  { key: 'rewards', label: 'What are my rewards?', icon: <Star className="w-3.5 h-3.5" /> },
  { key: 'fridge', label: 'Is The Fridge open?', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
];

export default function ArbaabPage() {
  const [mounted, setMounted] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('Switch to light mode');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setMounted(true);
    // Show all elements immediately — arbaab page is short, all content is above fold
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
    }, 80);
  }, []);

  // Re-apply in-view after isLightMode changes because React's reconciler
  // overwrites className (removing the DOM-added 'in-view' class) when conditional
  // Tailwind classes change due to the isLightMode state update.
  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
    }, 50);
  }, [isLightMode, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const runDemo = async (key: string) => {
    if (isTyping) return;
    const sequence = DEMO_SEQUENCES[key];
    if (!sequence) return;

    setActiveDemo(key);
    setMessages([]);
    setIsTyping(false);

    // Add user message
    const userMsg = sequence[0];
    setMessages([userMsg]);

    // Show typing
    await new Promise(r => setTimeout(r, 300));
    setIsTyping(true);

    // Wait for Arbaab "typing"
    await new Promise(r => setTimeout(r, sequence[1]?.delay ?? 1000));
    setIsTyping(false);

    // Add Arbaab response
    setMessages([userMsg, sequence[1]]);

    // If theme demo, toggle light mode
    if (key === 'theme') {
      await new Promise(r => setTimeout(r, 400));
      setIsLightMode(true);
      await new Promise(r => setTimeout(r, 3000));
      setIsLightMode(false);
    }
  };

  const handleSend = () => {
    const chip = DEMO_CHIPS.find(c => c.label.toLowerCase() === inputText.toLowerCase().trim());
    if (chip) {
      runDemo(chip.key);
    } else {
      runDemo('theme'); // default
    }
  };

  const capabilities = [
    { icon: <Search className="w-5 h-5" />, title: 'Search food & menus', desc: 'Describe a craving and Arbaab searches every restaurant for you.' },
    { icon: <ShoppingCart className="w-5 h-5" />, title: 'Add to cart', desc: 'Just say what you want. It finds it and drops it in your cart.' },
    { icon: <RotateCcw className="w-5 h-5" />, title: 'Reorder in one tap', desc: 'Remembers your past orders and can prep a reorder instantly.' },
    { icon: <Navigation className="w-5 h-5" />, title: 'Navigate the whole app', desc: 'Open any screen by asking: settings, fridge, orders, profile.' },
    { icon: <Sun className="w-5 h-5" />, title: 'Control your settings', desc: 'Change theme, language, and notification preferences through chat.' },
    { icon: <Star className="w-5 h-5" />, title: 'Track your rewards', desc: 'Check points, tier status, and redeem rewards without leaving the chat.' },
  ];

  return (
    <main
      className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ${isLightMode ? 'bg-[#f5f0e8]' : 'bg-[#0f0f0f]'}`}
    >
      {/* Light mode overlay animation */}
      {isLightMode && (
        <div className="fixed inset-0 z-[150] pointer-events-none animate-fade-in"
          style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.15) 0%, transparent 70%)' }}
        />
      )}

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 py-5 flex items-center justify-between transition-colors duration-700 ${isLightMode ? 'bg-[#f5f0e8]/90 backdrop-blur-sm' : ''}`}>
        <Link
          href="/"
          className={`flex items-center gap-2 font-bold text-sm hover:opacity-70 transition-all duration-300 group ${isLightMode ? 'text-[#b8860b]' : 'text-[#EAB308]'}`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="w-10 h-10 rounded-full" />
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 pt-32 pb-12 overflow-hidden">
        {!isLightMode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EAB308]/6 rounded-full blur-[150px] pointer-events-none" />
        )}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent transition-opacity duration-700 ${isLightMode ? 'opacity-0' : ''}`} />

        <div className={`relative z-10 text-center max-w-3xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-full px-4 py-2 mb-6">
            <img src="/takinator_avatar.png" className="w-3.5 h-3.5 object-contain" alt="Arbaab" />
            <span className="text-[#EAB308] text-xs font-bold uppercase tracking-widest">AI Food Assistant</span>
          </div>

          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 transition-colors duration-700 ${isLightMode ? 'text-[#1a1a1a]' : 'text-white'}`}>
            Meet <span className="text-gradient">Arbaab</span>
          </h1>

          <p className={`text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-700 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Arabic for &ldquo;boss&rdquo;. It runs errands so you don&apos;t have to.
          </p>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="px-5 sm:px-8 pb-12 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className={`animate-on-scroll stagger-${(i % 6) + 1} rounded-2xl p-5 border transition-all duration-700 ${
                isLightMode
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-[#141414] border-white/5 hover:border-[#EAB308]/20 hover:shadow-[0_0_20px_rgba(234,179,8,0.04)]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-[#EAB308] ${isLightMode ? 'bg-[#EAB308]/10' : 'bg-[#EAB308]/10'}`}>
                {cap.icon}
              </div>
              <h3 className={`font-bold text-sm mb-1 transition-colors duration-700 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{cap.title}</h3>
              <p className={`text-xs leading-relaxed transition-colors duration-700 ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Demo */}
        <div className={`rounded-3xl border overflow-hidden transition-all duration-700 max-w-2xl mx-auto shadow-2xl ${
          isLightMode
            ? 'bg-white border-gray-200'
            : 'bg-[#111111] border-[#EAB308]/20 shadow-[0_0_60px_rgba(234,179,8,0.08)]'
        }`}>

          {/* Demo header */}
          <div className={`px-5 py-4 border-b flex items-center gap-3 transition-colors duration-700 ${isLightMode ? 'border-gray-100 bg-gray-50' : 'border-white/5 bg-[#0d0d0d]'}`}>
            <div className="w-8 h-8 rounded-xl bg-[#EAB308] flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <img src="/takinator_avatar.png" className="w-4 h-4 object-contain" alt="Arbaab" />
            </div>
            <div>
              <p className={`font-bold text-sm transition-colors duration-700 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Arbaab</p>
              <p className={`text-xs transition-colors duration-700 ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Personal Food Boss</p>
            </div>
            {isLightMode && (
              <div className="ml-auto flex items-center gap-1.5 bg-yellow-100 border border-yellow-300/50 rounded-full px-3 py-1">
                <Sun className="w-3 h-3 text-yellow-600" />
                <span className="text-yellow-700 text-xs font-bold">Light Mode Active</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="p-5 min-h-[160px] space-y-3">
            {messages.length === 0 && !isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EAB308] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src="/takinator_avatar.png" className="w-3.5 h-3.5 object-contain" alt="Arbaab" />
                </div>
                <div className={`rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] text-sm transition-colors duration-700 ${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-white/5 text-gray-300'}`}>
                  Assalamu Alaikum! Try one of the commands below and watch what happens.
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'arbaab' && (
                  <div className="w-7 h-7 rounded-lg bg-[#EAB308] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <img src="/takinator_avatar.png" className="w-3.5 h-3.5 object-contain" alt="Arbaab" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm transition-colors duration-700 ${
                  msg.role === 'user'
                    ? 'bg-[#EAB308] text-black font-medium rounded-tr-sm'
                    : isLightMode
                      ? 'bg-gray-100 text-gray-700 rounded-tl-sm'
                      : 'bg-white/5 text-gray-300 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EAB308] flex items-center justify-center flex-shrink-0">
                  <img src="/takinator_avatar.png" className="w-3.5 h-3.5 object-contain" alt="Arbaab" />
                </div>
                <div className={`rounded-2xl rounded-tl-sm px-4 py-3 transition-colors duration-700 ${isLightMode ? 'bg-gray-100' : 'bg-white/5'}`}>
                  <div className="flex gap-1.5 items-center h-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={`px-4 py-4 border-t transition-colors duration-700 ${isLightMode ? 'border-gray-100 bg-gray-50' : 'border-white/5 bg-[#0d0d0d]'}`}>
            {/* Quick chips */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {DEMO_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => {
                    setInputText(chip.label);
                    runDemo(chip.key);
                  }}
                  disabled={isTyping}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 disabled:opacity-40 ${
                    activeDemo === chip.key
                      ? 'bg-[#EAB308] text-black border-[#EAB308]'
                      : isLightMode
                        ? 'bg-white text-gray-600 border-gray-200 hover:border-[#EAB308]/50 hover:text-[#b8860b]'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-[#EAB308]/40 hover:text-[#EAB308]'
                  }`}
                >
                  {chip.icon}
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Arbaab anything..."
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none border transition-all duration-700 ${
                  isLightMode
                    ? 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#EAB308]/50'
                    : 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#EAB308]/40'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="w-10 h-10 rounded-xl bg-[#EAB308] flex items-center justify-center text-black hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className={`text-center text-xs mt-4 transition-colors duration-700 ${isLightMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This is a simulated demo. The real Arbaab is in the Taeam app.
        </p>

        {/* Privacy note */}
        <div className={`mt-10 max-w-md mx-auto text-center animate-on-scroll rounded-2xl p-5 border transition-colors duration-700 ${isLightMode ? 'bg-white border-gray-100 text-gray-600' : 'bg-[#141414] border-white/5 text-gray-500'}`}>
          <p className="text-xs leading-relaxed">
            <span className={`font-bold transition-colors duration-700 ${isLightMode ? 'text-gray-800' : 'text-white'}`}>Your data stays yours.</span>{' '}
            Arbaab only accesses what you allow: search, order history, and app navigation. No payment info, no personal details. You control every permission in Settings.
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-10 animate-on-scroll">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group ${isLightMode ? 'text-gray-400 hover:text-[#b8860b]' : 'text-gray-500 hover:text-[#EAB308]'}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to main page
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className={`h-px bg-gradient-to-r from-transparent via-[#EAB308]/10 to-transparent transition-opacity duration-700 ${isLightMode ? 'opacity-30' : ''}`} />
      <div className="text-center py-6">
        <p className={`text-xs tracking-wider uppercase transition-colors duration-700 ${isLightMode ? 'text-gray-400' : 'text-gray-700'}`}>© 2026 Taeam Technologies Inc.</p>
      </div>
    </main>
  );
}
