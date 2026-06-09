"use client";

import { useState, useEffect } from "react";
import { Sparkles, Instagram, ArrowRight, Refrigerator, Mail, Car, MapPin, ChevronRight, X, Send } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import WaitlistModal from "@/components/WaitlistModal";
import EdmontonMap from "@/components/EdmontonMap";
import HalalTeaser from "@/components/HalalTeaser";
import ArbaabPhone from "@/components/ArbaabPhone";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [arabicRevealed, setArabicRevealed] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);


  // Page mount animation trigger + waitlist check + scroll restoration
  useEffect(() => {
    setMounted(true);

    // Restore scroll position when returning from sub-pages
    const savedY = sessionStorage.getItem('taeam_scroll_y');
    if (savedY) {
      requestAnimationFrame(() => window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' }));
      sessionStorage.removeItem('taeam_scroll_y');
    }

    const alreadyWaitlisted = localStorage.getItem('taeam_waitlisted') === 'true';
    const alreadyDismissed = sessionStorage.getItem('taeam_popup_dismissed') === 'true';
    if (alreadyWaitlisted) {
      setIsWaitlisted(true);
    } else if (!alreadyDismissed) {
      // Show modal after a short delay so the page renders first
      const timer = setTimeout(() => setShowWaitlistModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Body scroll lock when any modal is open (iOS Safari scrolls background otherwise)
  useEffect(() => {
    if (showWaitlistModal || showSuggestModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showWaitlistModal, showSuggestModal]);

  // Scroll detection for nav color change
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setScrolledPastHero(window.scrollY > heroHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const { error: supabaseError } = await supabase
        .from("waitlist")
        .insert([{ email, bonus_points: 1000 }]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          setIsSuccess(true);
          setIsWaitlisted(true);
          localStorage.setItem('taeam_waitlisted', 'true');
        } else throw supabaseError;
      } else {
        setIsSuccess(true);
        setIsWaitlisted(true);
        localStorage.setItem('taeam_waitlisted', 'true');
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestName.trim()) return;
    try {
      const { error } = await supabase.from('restaurant_suggestions').insert([{ restaurant_name: suggestName.trim() }]);
      if (error) console.error('restaurant suggestion failed:', error);
    } catch (err) {
      console.error('restaurant suggestion threw:', err);
    }
    setSuggestSubmitted(true);
  };

  return (
    <main className="bg-[#0f0f0f] font-sans selection:bg-[#EAB308] selection:text-black overflow-x-hidden grain-overlay">

      {/* ── WAITLIST MODAL ── */}
      {showWaitlistModal && (
        <WaitlistModal
          onClose={() => {
            sessionStorage.setItem('taeam_popup_dismissed', 'true');
            setShowWaitlistModal(false);
          }}
          onSuccess={() => { setShowWaitlistModal(false); setIsWaitlisted(true); }}
        />
      )}

      {/* ── SUGGEST RESTAURANT MODAL ── */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowSuggestModal(false); setSuggestSubmitted(false); setSuggestName(''); }} />
          <div className="relative w-full max-w-sm animate-pop-in">
            <div className="bg-[#111111] border border-[#EAB308]/30 rounded-3xl p-7 shadow-[0_0_60px_rgba(234,179,8,0.12)]">
              <button onClick={() => { setShowSuggestModal(false); setSuggestSubmitted(false); setSuggestName(''); }} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
              {!suggestSubmitted ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-[#EAB308] flex items-center justify-center mb-4"><MapPin className="w-5 h-5 text-black" /></div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Suggest a Restaurant</h3>
                  <p className="text-gray-500 text-xs mb-5 leading-relaxed">Know a halal spot that should be on Taeam? Tell us and we&apos;ll reach out to them.</p>
                  <form onSubmit={handleSuggestSubmit} className="space-y-3">
                    <input type="text" value={suggestName} onChange={(e) => setSuggestName(e.target.value)} placeholder="Restaurant name" className="w-full bg-white/5 border border-white/10 focus:border-[#EAB308]/50 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none text-base transition-all" />
                    <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Submit</button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-lg font-black text-white mb-1">Got it!</h3>
                  <p className="text-gray-400 text-sm">We&apos;ll reach out to them. Thanks for helping us grow.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ------------------------------------------------------
          NAVIGATION BAR
      ------------------------------------------------------- */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 md:px-10 py-3 md:py-5 flex items-center justify-between ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
        {/* Logo */}
        <div>
          <img src="/taeam-logo.jpg" alt="Taeam" className="w-10 md:w-14 drop-shadow-2xl rounded-full hover:scale-105 transition-transform duration-300" />
        </div>
        
        {/* Nav Links: pill container ensures readability at all scroll positions */}
        <div className="flex items-center gap-2 sm:gap-5 md:gap-7 bg-black/40 backdrop-blur-md px-3 sm:px-5 py-2 rounded-full border border-white/10">
          <a href="#features" className={`font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 uppercase tracking-wider hover:text-[#EAB308] ${scrolledPastHero ? 'text-[#EAB308]' : 'text-white/90'}`}>Features</a>
          <Link href="/drive" onClick={() => sessionStorage.setItem('taeam_scroll_y', String(window.scrollY))} className={`font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 uppercase tracking-wider hover:text-[#EAB308] ${scrolledPastHero ? 'text-[#EAB308]' : 'text-white/90'}`}><span className="sm:hidden">Drive</span><span className="hidden sm:inline">Drive for Us</span></Link>
          <a href="#about" className={`font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 uppercase tracking-wider hover:text-[#EAB308] ${scrolledPastHero ? 'text-[#EAB308]' : 'text-white/90'}`}>About</a>
          <a href="#contact" className={`font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 uppercase tracking-wider hover:text-[#EAB308] ${scrolledPastHero ? 'text-[#EAB308]' : 'text-white/90'}`}>Contact</a>
        </div>
      </nav>

      {/* ------------------------------------------------------
          SECTION 1: HERO (Fixed Alignment)
      ------------------------------------------------------- */}
      <section id="waitlist" className="relative min-h-screen w-full bg-[#EAB308] flex flex-col items-center justify-center pt-16 pb-16 md:pt-24 md:pb-24">
        
        {/* Floating ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-black/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[40%] right-[15%] w-3 h-3 bg-black/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-white/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[15%] right-[40%] w-4 h-4 bg-black/5 rounded-full animate-float-slow" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* --- BACKGROUNDS --- */}
        {/* 1. Gold Base (The Section bg) */}
        
        {/* 2. Black Diagonal Overlay */}
        <div 
          className="absolute inset-0 bg-[#0f0f0f] z-0 pointer-events-none"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        />

        {/* --- DUAL BRANDING: TAEAM on Gold + Arabic on Black --- */}
        
        {/* TAEAM - Positioned on Gold side (closer to diagonal split) */}
        <div className={`absolute left-[8%] sm:left-[10%] md:left-[12%] top-[28%] sm:top-1/3 md:top-[30%] z-10 ${mounted ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <h1 className="text-[#0f0f0f] text-[11vw] sm:text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">
            TAEAM
          </h1>
          <p className="text-[#0f0f0f]/70 text-xs sm:text-sm md:text-xl font-bold tracking-tight mt-1 sm:mt-2 uppercase">
            Taste The Trust
          </p>
        </div>

        {/* Arabic "طعام" - Positioned on Black side (closer to diagonal split) */}
        <div className={`absolute right-[8%] sm:right-[10%] md:right-[12%] bottom-[38%] sm:bottom-[35%] md:bottom-[30%] z-10 text-right ${mounted ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <p className="text-[#EAB308] text-[12vw] sm:text-[14vw] md:text-[10vw] font-black leading-none select-none">
            طعام
          </p>
          <span className="text-[#EAB308]/50 text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] mt-1 sm:mt-2 inline-block">
            طعم الثقة
          </span>
        </div>

        {/* --- INPUT SECTION (Fat Pills + Clear Gap) --- */}
      {/* Positioned at bottom of viewport with breathing room */}
      <div className={`absolute bottom-6 sm:bottom-10 md:bottom-16 left-0 w-full z-50 px-3 sm:px-4 flex justify-center pointer-events-none ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="w-full max-w-5xl flex flex-col items-center text-center pointer-events-auto gap-3 sm:gap-4 md:gap-14">
              
              {isWaitlisted ? (
                  <div className="flex flex-col items-center gap-4 md:gap-6 animate-fade-in-up">
                    <div className="bg-black text-[#EAB308] px-6 md:px-12 py-4 md:py-8 rounded-full font-black text-lg md:text-3xl shadow-2xl flex items-center gap-2 md:gap-4 border-2 md:border-4 border-[#EAB308]">
                      You&apos;re on the list! <Sparkles className="w-6 h-6 md:w-10 md:h-10 animate-pulse"/>
                    </div>
                    <a href="https://instagram.com/taeam.ca" target="_blank" rel="noreferrer noopener" className="text-white font-bold hover:opacity-70 underline underline-offset-4 flex items-center gap-2 text-sm md:text-2xl drop-shadow-md">
                      <Instagram className="w-5 h-5 md:w-8 md:h-8"/> Follow @taeam.ca for launch updates
                    </a>
                  </div>
              ) : !isSuccess ? (
                  /* --- 1. THE PILLS (FAT & TALL) --- */
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full">
                      
                      {/* INPUT: h-24 (Extra Tall), text-3xl (Large Text) */}
                      <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          disabled={isSubmitting}
                          className="w-full md:flex-[2] bg-white text-black placeholder-gray-500 px-4 sm:px-6 md:px-10 rounded-full outline-none border-2 md:border-4 border-transparent focus:border-[#EAB308]/50 focus:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300 text-sm sm:text-base md:text-3xl font-bold shadow-2xl h-12 sm:h-14 md:h-24 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
                      />

                      {/* BUTTON: h-24 (Extra Tall), text-3xl (Large Text) */}
                      <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group w-full md:flex-[1] bg-black text-[#EAB308] border-2 md:border-4 border-[#EAB308] font-black px-4 sm:px-6 md:px-12 rounded-full hover:bg-[#EAB308] hover:text-black transition-all duration-300 whitespace-nowrap text-xs sm:text-sm md:text-3xl uppercase tracking-wide sm:tracking-wider shadow-2xl hover:scale-105 active:scale-95 h-12 sm:h-14 md:h-24 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                      >
                          {isSubmitting ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            <>
                              JOIN WAITLIST
                              <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                      </button>
                  </form>
              ) : (
                  <div className="flex flex-col items-center gap-4 md:gap-6 animate-in fade-in zoom-in duration-500">
                       <div className="bg-black text-[#EAB308] px-6 md:px-12 py-4 md:py-8 rounded-full font-black text-lg md:text-3xl shadow-2xl flex items-center gap-2 md:gap-4 border-2 md:border-4 border-[#EAB308]">
                          You&apos;re In! <Sparkles className="w-6 h-6 md:w-10 md:h-10 animate-pulse"/>
                      </div>
                      <a href="https://instagram.com/taeam.ca" target="_blank" rel="noreferrer noopener" className="text-white font-bold hover:opacity-70 underline underline-offset-4 flex items-center gap-2 text-sm md:text-2xl drop-shadow-md">
                           <Instagram className="w-5 h-5 md:w-8 md:h-8"/> Follow for $50 Live Draw
                      </a>
                  </div>
              )}

              {/* --- 2. THE TEXT (CLEARLY SEPARATED) --- */}
              {/* The 'gap-14' on the parent div handles the spacing now */}
              <p className="text-[#EAB308] text-[10px] sm:text-xs md:text-3xl font-black tracking-tight uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                  Join for 15% off + 1000 Founding Points
              </p>

              {error && <p className="text-red-500 font-bold text-center mt-2 md:mt-4 bg-black/80 px-5 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-lg shadow-lg border border-red-500/50 animate-fade-in-up">{error}</p>}
          </div>
      </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 2: TAEAM LAUNCH
      ------------------------------------------------------- */}
      <section id="launch" className="w-full bg-[#0f0f0f] relative py-16 sm:py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />
        <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-[#EAB308]/4 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-[#EAB308]/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          <div className="text-center mb-10 sm:mb-14 md:mb-20">
            <p className="animate-on-scroll stagger-1 text-[#EAB308] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 text-[10px] sm:text-sm">Edmonton, Alberta</p>
            <h2 className="animate-on-scroll stagger-2 text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">Taeam <span className="text-gradient">Launch</span></h2>
            <p className="animate-on-scroll stagger-3 text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">Edmonton&apos;s first 100% halal delivery platform. No guessing. No compromise.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="animate-on-scroll stagger-2 space-y-6">
              <div className="space-y-4 text-gray-400 text-base sm:text-lg leading-relaxed">
                <p>We&apos;re not trying to be everything for everyone. We&apos;re building one thing and building it well: a halal food delivery app that actually earns your trust.</p>
                <p>Every restaurant on Taeam is <span className="text-white font-semibold">verified halal</span>. No alcohol on the premises. No guessing if the meat was hand-slaughtered. You order, you eat, no questions needed.</p>
                <p>We&apos;re starting in <span className="text-[#EAB308] font-semibold">North and South Edmonton</span>, growing street by street and restaurant by restaurant.</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => setShowSuggestModal(true)} className="group flex items-center gap-2 bg-[#1a1a1a] border border-[#EAB308]/20 hover:border-[#EAB308]/60 text-[#EAB308] font-bold px-5 py-3 rounded-full text-sm transition-all duration-300 hover:bg-[#EAB308]/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] active:scale-95">
                  <MapPin className="w-4 h-4" /> Suggest a Restaurant <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <Link href="/drive" onClick={() => sessionStorage.setItem('taeam_scroll_y', String(window.scrollY))} className="group flex items-center gap-2 bg-[#EAB308] text-black font-black px-5 py-3 rounded-full text-sm transition-all duration-300 hover:bg-yellow-400 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                  <Car className="w-4 h-4" /> Drive for Us <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="animate-on-scroll stagger-3">
              <EdmontonMap />
              <p className="text-center text-gray-500 text-xs mt-4 tracking-wide uppercase">Soft Launch Zones · North &amp; South Edmonton</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 2.5: HALAL TRUST GAP (teaser → /halal)
      ------------------------------------------------------- */}
      <HalalTeaser />

      {/* ------------------------------------------------------
          SECTION 3: THE FRIDGE
      ------------------------------------------------------- */}
      <section id="features" className="w-full bg-[#1a1a1a] relative py-16 sm:py-20 md:py-32">
        
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/30 to-transparent" />
        <div className="absolute top-0 right-[20%] w-64 h-64 bg-[#EAB308]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            
            {/* Left: Content */}
            <div className="animate-on-scroll stagger-1 order-2 md:order-1">
              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-[#EAB308] flex items-center justify-center mb-6 md:mb-8 shadow-lg hover:scale-110 hover:rotate-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                <Refrigerator className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
              </div>
              
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                The Fridge
              </h2>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-full px-4 py-2 mb-4 md:mb-6">
                <div className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
                <span className="text-[#EAB308] text-xs font-bold uppercase tracking-widest">Coming Soon</span>
              </div>

              {/* Headline */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#EAB308] mb-4 md:mb-6 italic">
                Home-baked, Not Store-Bought.
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed font-medium mb-6">
                Edmonton&apos;s homemade dessert marketplace is in the works. Verified local chefs. Fresh-baked daily. <span className="text-white">Launching after our core delivery goes live.</span>
              </p>
              <Link href="/fridge" onClick={() => sessionStorage.setItem('taeam_scroll_y', String(window.scrollY))} className="group inline-flex items-center gap-2 bg-[#252525] border border-[#EAB308]/30 hover:border-[#EAB308]/70 text-[#EAB308] font-bold px-5 py-3 rounded-full text-sm transition-all duration-300 hover:bg-[#EAB308]/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] active:scale-95">
                <Refrigerator className="w-4 h-4" /> Join the Fridge Waitlist <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            {/* Right: Image */}
            <div className="animate-on-scroll stagger-2 order-1 md:order-2">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#252525] border border-white/10 hover:border-[#EAB308]/50 transition-all duration-500 group">
                <Image
                  src="/fridge-feature.jpg"
                  alt="The Fridge, home-baked goods marketplace"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 4: ARBAAB AI
      ------------------------------------------------------- */}
      <section className="w-full bg-[#141414] relative py-16 sm:py-20 md:py-32">
        
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-[#EAB308]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            
            {/* Left: Arbaab phone mockup */}
            <div className="animate-on-scroll stagger-3 flex justify-center">
              <ArbaabPhone />
            </div>
            
            {/* Right: Content */}
            <div className="animate-on-scroll stagger-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-[#EAB308] flex items-center justify-center mb-6 md:mb-8 shadow-lg hover:scale-110 hover:-rotate-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                <img src="/takinator_avatar.png" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" alt="Arbaab" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                Arbaab AI
              </h2>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#EAB308] mb-4 md:mb-6 italic">
                Your Personal Food Boss.
              </h3>
              
              <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed font-medium mb-6">
                Arabic for &ldquo;boss&rdquo;. Arbaab handles the busywork so you don&apos;t have to. Tell it what you&apos;re craving and it searches every menu. Reorder a past meal, check your rewards, switch to dark mode. All through a simple chat.
              </p>

              <Link href="/arbaab" onClick={() => sessionStorage.setItem('taeam_scroll_y', String(window.scrollY))} className="group inline-flex items-center gap-2 bg-[#252525] border border-[#EAB308]/30 hover:border-[#EAB308]/70 text-[#EAB308] font-bold px-5 py-3 rounded-full text-sm transition-all duration-300 hover:bg-[#EAB308]/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] active:scale-95">
                <img src="/takinator_avatar.png" className="w-4 h-4 object-contain" alt="Arbaab" /> Try Arbaab <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 4: OUR NAME, OUR PROMISE
      ------------------------------------------------------- */}
      <section id="about" className="w-full bg-[#1a1a1a] relative flex flex-col justify-center items-center px-5 sm:px-6 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden">
        
        {/* Hurufiya / Arabic Calligraphy Background - Desktop only */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none z-[1]">
          <p className="absolute -right-20 top-1/2 -translate-y-1/2 text-[40vw] font-black text-[#EAB308]/[0.03] leading-none select-none" style={{ writingMode: 'vertical-rl' }}>
            طعام
          </p>
        </div>
        
        {/* Mobile Hurufiya - subtle centered background */}
        <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
          <p className="text-[50vw] font-black text-[#EAB308]/[0.04] leading-none select-none">
            ط
          </p>
        </div>
        
        {/* Subtle gradient accents */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />
        <div className="absolute top-[20%] left-[5%] w-32 md:w-64 h-32 md:h-64 bg-[#EAB308]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-24 md:w-48 h-24 md:h-48 bg-[#EAB308]/3 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto relative z-10">
          
          {/* Section Title - Centered */}
          <div className="text-center mb-10 sm:mb-14 md:mb-28">
            <h3 className="animate-on-scroll stagger-1 text-[#EAB308] font-black tracking-[0.12em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-4 text-[10px] sm:text-sm md:text-base">
              The Promise
            </h3>
            <h2 className="animate-on-scroll stagger-2 text-2xl sm:text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
              Our Name, <br className="sm:hidden" /><span className="text-gradient">Our Promise</span>
            </h2>
          </div>

          {/* ==================== MOBILE LAYOUT ==================== */}
          <div className="md:hidden flex flex-col gap-10">
            
            {/* Arabic Word - Centered on Mobile */}
            <div className="animate-on-scroll stagger-3 text-center">
              <div 
                className="relative inline-block cursor-pointer group"
                onDoubleClick={() => setArabicRevealed(true)}
              >
                <p className="text-[#EAB308] text-[22vw] font-black leading-[1] select-none active:scale-95 transition-transform duration-300 drop-shadow-[0_0_40px_rgba(234,179,8,0.25)]">
                  طعام
                </p>
                {/* Double tap hint */}
                <div className={`mt-3 transition-all duration-500 ${arabicRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <span className="inline-block bg-[#252525] px-4 py-2 rounded-full text-[#EAB308] text-[11px] tracking-wide border border-[#EAB308]/30 animate-pulse">
                    Double tap to reveal meaning
                  </span>
                </div>
              </div>

              {/* Meaning Card - Mobile */}
              <div 
                className={`mt-6 bg-[#252525] p-5 rounded-2xl border border-[#EAB308]/20 shadow-2xl text-left transition-all duration-700 ease-out ${
                  arabicRevealed 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-4 pointer-events-none h-0 p-0 mt-0 overflow-hidden'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-3xl text-[#EAB308] opacity-40 font-serif leading-none">"</span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ta&apos;am</h3>
                    <div className={`w-10 h-0.5 bg-[#EAB308] mb-3 rounded-full transition-all duration-500 delay-300 ${arabicRevealed ? 'scale-x-100' : 'scale-x-0'} origin-left`} />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Translates simply to <span className="text-[#EAB308] font-bold">"Food"</span>.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      We style it <b className="text-white">Taeam</b>. Our goal: making 100% Halal accessible to everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider Line - Mobile */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#EAB308]/20" />
              <div className="w-2 h-2 bg-[#EAB308]/40 rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#EAB308]/20" />
            </div>
            
            {/* Mission Section - Mobile */}
            <div className="animate-on-scroll stagger-4">
              {/* Mission Title */}
              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight text-center">
                Our Mission: <span className="text-[#EAB308]">Zero Doubt</span>
              </h3>
              
              {/* Decorative line */}
              <div className="w-12 h-0.5 bg-[#EAB308] mb-5 rounded-full mx-auto" />
              
              {/* Mission Description */}
              <div className="space-y-4 text-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                  We aren&apos;t just building a delivery app; we&apos;re building a <span className="text-white font-semibold">standard</span>.
                </p>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  No more calling restaurants to ask about alcohol. No more guessing if the meat is hand-slaughtered.
                </p>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  Taeam is a <span className="text-[#EAB308] font-semibold">100% Halal ecosystem</span> built on <span className="text-white font-semibold italic">Amanah</span> (Trust).
                </p>
                
                {/* Status Badge - Mobile */}
                <div className="pt-4">
                  <div className="inline-flex items-start gap-2.5 bg-[#252525] px-4 py-3 rounded-2xl border border-[#EAB308]/20 text-left max-w-[300px]">
                    <div className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse mt-1 flex-shrink-0" />
                    <span className="text-gray-400 text-xs leading-relaxed">
                      Currently under development. We&apos;re building the experience the <span className="text-white">Ummah</span> has been waiting for.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== DESKTOP LAYOUT ==================== */}
          <div className="hidden md:grid md:grid-cols-2 gap-32 lg:gap-40 items-start">
            
            {/* Left Side: Arabic Word + Meaning Reveal */}
            <div className="animate-on-scroll stagger-3">
              {/* Arabic Word */}
              <div 
                className="relative cursor-pointer group mb-16"
                onDoubleClick={() => setArabicRevealed(true)}
              >
                <p className="text-[#EAB308] text-[9vw] font-black leading-[1] select-none group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_60px_rgba(234,179,8,0.2)]">
                  طعام
                </p>
                {/* Double click hint */}
                <div className={`absolute -bottom-2 left-0 transition-all duration-500 ${arabicRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <span className="bg-[#252525] px-4 py-2 rounded-full text-[#EAB308] text-sm tracking-wide border border-[#EAB308]/30 animate-pulse whitespace-nowrap">
                    Double click to reveal
                  </span>
                </div>
              </div>

              {/* Meaning Card - Desktop */}
              <div 
                className={`bg-[#252525] p-10 rounded-3xl border border-[#EAB308]/20 shadow-2xl transition-all duration-700 ease-out ${
                  arabicRevealed 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                }`}
              >
                <span className="text-5xl text-[#EAB308] opacity-30 font-serif">"</span>
                
                <h3 className="text-4xl font-bold text-white mb-4 -mt-4">Ta&apos;am</h3>
                <div className={`w-16 h-1 bg-[#EAB308] mb-6 rounded-full transition-all duration-500 delay-300 ${arabicRevealed ? 'scale-x-100' : 'scale-x-0'} origin-left`} />
                
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  Translates simply to <span className="text-[#EAB308] font-bold">"Food"</span>.
                </p>
                <p className="text-gray-500 text-base mt-4">
                  We style it <b className="text-white">Taeam</b>. Our goal: making 100% Halal accessible to everyone.
                </p>
              </div>
            </div>
            
            {/* Right Side: Our Mission */}
            <div className="animate-on-scroll stagger-4 pt-8">
              {/* Mission Title */}
              <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">
                Our Mission: <span className="text-[#EAB308]">Zero Doubt</span>
              </h3>
              
              {/* Decorative line */}
              <div className="w-20 h-1 bg-[#EAB308] mb-8 rounded-full" />
              
              {/* Mission Description */}
              <div className="space-y-6">
                <p className="text-gray-300 text-xl leading-relaxed font-medium">
                  We aren&apos;t just building a delivery app; we&apos;re building a <span className="text-white font-bold">standard</span>.
                </p>
                
                <p className="text-gray-400 text-xl leading-relaxed">
                  No more calling restaurants to ask about alcohol. No more guessing if the meat is hand-slaughtered.
                </p>
                
                <p className="text-gray-300 text-xl leading-relaxed">
                  Taeam is a <span className="text-[#EAB308] font-bold">100% Halal ecosystem</span> built on <span className="text-white font-bold italic">Amanah</span> (Trust).
                </p>
                
                <div className="pt-6">
                  <div className="inline-flex items-center gap-3 bg-[#252525] px-6 py-4 rounded-full border border-[#EAB308]/20">
                    <div className="w-2.5 h-2.5 bg-[#EAB308] rounded-full animate-pulse" />
                    <span className="text-gray-400 text-base font-medium">
                      Currently under development. We&apos;re building the experience the <span className="text-white">Ummah</span> has been waiting for.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 5: CONTACT US
      ------------------------------------------------------- */}
      <section id="contact" className="w-full bg-[#0f0f0f] relative py-16 sm:py-20 md:py-28 overflow-hidden">
        
        {/* Subtle gradient accents */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/20 to-transparent" />
        <div className="absolute top-[30%] left-[10%] w-32 md:w-48 h-32 md:h-48 bg-[#EAB308]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-24 md:w-40 h-24 md:h-40 bg-[#EAB308]/3 rounded-full blur-[60px] pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto px-5 sm:px-6 md:px-10 relative z-10">
          
          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h3 className="animate-on-scroll stagger-1 text-[#EAB308] font-black tracking-[0.12em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3 text-[10px] sm:text-sm md:text-base">
              Get In Touch
            </h3>
            <h2 className="animate-on-scroll stagger-2 text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Contact <span className="text-gradient">Us</span>
            </h2>
          </div>

          {/* Contact Cards */}
          <div className="animate-on-scroll stagger-3 grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-16">
            
            {/* Instagram Card */}
            <a 
              href="https://instagram.com/taeam.ca" 
              target="_blank"
              rel="noreferrer noopener"
              className="group bg-[#1a1a1a] p-5 sm:p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#EAB308]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 md:mb-4">
                <div className="p-2.5 sm:p-3 bg-[#EAB308]/10 rounded-xl group-hover:bg-[#EAB308] transition-all duration-300">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308] group-hover:text-black transition-colors duration-300" />
                </div>
                <span className="text-white font-bold text-base sm:text-lg md:text-xl">Instagram</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base group-hover:text-[#EAB308] transition-colors duration-300">
                @taeam.ca
              </p>
            </a>
            
            {/* Email Card */}
            <a 
              href="mailto:contact@taeam.ca" 
              className="group bg-[#1a1a1a] p-5 sm:p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#EAB308]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 md:mb-4">
                <div className="p-2.5 sm:p-3 bg-[#EAB308]/10 rounded-xl group-hover:bg-[#EAB308] transition-all duration-300">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308] group-hover:text-black transition-colors duration-300" />
                </div>
                <span className="text-white font-bold text-base sm:text-lg md:text-xl">Email</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base group-hover:text-[#EAB308] transition-colors duration-300">
                contact@taeam.ca
              </p>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1.5 h-1.5 bg-[#EAB308]/50 rounded-full" />
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Footer Info */}
          <div className="animate-on-scroll stagger-4 text-center space-y-3 sm:space-y-4">
            <p className="text-gray-500 text-xs sm:text-sm">
              Based in <span className="text-white">Edmonton, Alberta, Canada</span>
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs tracking-wider uppercase">
              © 2026 Taeam Technologies Inc. All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}