"use client";

import { useState, useEffect, useRef } from "react";
import { Package, Sparkles, Instagram, Box, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { AdaptiveText } from "@/components/AdaptiveText";
import SplitSection, { BRAND } from "@/components/SplitSection";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [arabicRevealed, setArabicRevealed] = useState(false);

  // Refs for scroll-triggered animations
  const ecosystemRef = useRef<HTMLElement>(null);
  const promiseRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  // Page mount animation trigger
  useEffect(() => {
    setMounted(true);
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
        if (supabaseError.code === "23505") setError("Email already registered!");
        else throw supabaseError;
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#0f0f0f] font-sans selection:bg-[#EAB308] selection:text-black overflow-x-hidden grain-overlay">
      
      {/* ------------------------------------------------------
          SECTION 1: HERO (Fixed Alignment)
      ------------------------------------------------------- */}
      <section className="relative min-h-screen w-full bg-[#EAB308] flex flex-col items-center justify-center pt-16 pb-16 md:pt-24 md:pb-24">
        
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
        
        {/* 3. LOGO (Standard Absolute Position) */}
        <div className={`absolute top-6 left-6 z-50 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <img src="/taeam-logo.jpg" alt="Taeam" className="w-24 md:w-32 drop-shadow-2xl rounded-full hover:scale-105 transition-transform duration-300 animate-float-slow" />
        </div>

        {/* --- DUAL BRANDING: TAEAM on Gold + Arabic on Black --- */}
        
        {/* TAEAM - Positioned on Gold side (top-left area) */}
        <div className={`absolute left-4 sm:left-6 md:left-16 top-[28%] sm:top-1/3 md:top-[30%] z-10 ${mounted ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <h1 className="text-[#0f0f0f] text-[11vw] sm:text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">
            TAEAM
          </h1>
          <p className="text-[#0f0f0f]/70 text-xs sm:text-sm md:text-xl font-bold tracking-tight mt-1 sm:mt-2 uppercase">
            Taste The Trust
          </p>
        </div>

        {/* Arabic "طعام" - Positioned on Black side (bottom-right area) */}
        <div className={`absolute right-4 sm:right-6 md:right-16 bottom-[38%] sm:bottom-[35%] md:bottom-[30%] z-10 text-right ${mounted ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <p className="text-[#EAB308] text-[12vw] sm:text-[14vw] md:text-[10vw] font-black leading-none select-none">
            طعام
          </p>
          <span className="text-[#EAB308]/50 text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] mt-1 sm:mt-2 inline-block">
            طعم الثقة
          </span>
        </div>

        {/* --- INPUT SECTION (Fat Pills + Clear Gap) --- */}
      {/* Positioned at bottom of viewport with breathing room */}
      <div className={`absolute bottom-6 sm:bottom-10 md:bottom-32 left-0 w-full z-50 px-3 sm:px-4 flex justify-center pointer-events-none ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="w-full max-w-5xl flex flex-col items-center text-center pointer-events-auto gap-3 sm:gap-4 md:gap-14">
              
              {!isSuccess ? (
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
                          className="group w-full md:flex-[1] bg-black text-[#EAB308] border-2 md:border-4 border-[#EAB308] font-black px-4 sm:px-6 md:px-12 rounded-full hover:bg-[#EAB308] hover:text-black transition-all duration-300 whitespace-nowrap text-xs sm:text-sm md:text-3xl uppercase tracking-wide sm:tracking-wider shadow-2xl hover:scale-105 active:scale-95 h-12 sm:h-14 md:h-24 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 animate-pulse-glow hover:shadow-[0_0_50px_rgba(234,179,8,0.5)]"
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
                       <div className="bg-black text-[#EAB308] px-6 md:px-12 py-4 md:py-8 rounded-full font-black text-lg md:text-3xl shadow-2xl flex items-center gap-2 md:gap-4 border-2 md:border-4 border-[#EAB308] animate-pulse-glow">
                          You&apos;re In! <Sparkles className="w-6 h-6 md:w-10 md:h-10 animate-pulse"/>
                      </div>
                      <a href="https://instagram.com/taeam.ca" target="_blank" className="text-white font-bold hover:opacity-70 underline underline-offset-4 flex items-center gap-2 text-sm md:text-2xl drop-shadow-md">
                           <Instagram className="w-5 h-5 md:w-8 md:h-8"/> Follow for $50 Live Draw
                      </a>
                  </div>
              )}

              {/* --- 2. THE TEXT (CLEARLY SEPARATED) --- */}
              {/* The 'gap-14' on the parent div handles the spacing now */}
              <p className="text-[#EAB308] text-[10px] sm:text-xs md:text-3xl font-black tracking-tight uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)] animate-shimmer">
                  Join for 15% off + 1000 Founding Points
              </p>

              {error && <p className="text-red-500 font-bold text-center mt-2 md:mt-4 bg-black/80 px-5 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-lg shadow-lg border border-red-500/50 animate-fade-in-up">{error}</p>}
          </div>
      </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 2: THE ECOSYSTEM (Zig-Zag Flipped)
      ------------------------------------------------------- */}
      <section ref={ecosystemRef} className="min-h-screen w-full bg-[#0f0f0f] relative flex flex-col justify-center items-center px-3 sm:px-4 md:px-10 py-10 sm:py-12 md:py-20">
        
        {/* Floating ambient particles for section 2 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-[10%] right-[10%] w-32 h-32 bg-[#EAB308]/5 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-[20%] left-[5%] w-40 h-40 bg-[#EAB308]/3 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[50%] left-[50%] w-2 h-2 bg-[#EAB308]/40 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-[30%] left-[70%] w-1.5 h-1.5 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1.2s' }} />
        </div>
        
        {/* Flipped Diagonal Overlay - Gold on Black */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundColor: BRAND.GOLD,
            clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
          }}
        />
        
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0f0f0f]/20 blur-[120px] rounded-full pointer-events-none z-[1]" />

        <div className="max-w-7xl w-full mx-auto relative z-10">
          
          {/* Section Header (Centered) */}
          <div className="text-center mb-10 sm:mb-16 md:mb-24">
             <h3 className="animate-on-scroll stagger-1 text-[#EAB308] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-4 text-xs sm:text-sm md:text-base">The Future of Food</h3>
             <h2 className="animate-on-scroll stagger-2 text-2xl sm:text-3xl md:text-7xl font-black text-white uppercase tracking-tighter">
               What&apos;s <span className="text-gradient">Coming</span>
             </h2>
          </div>

          {/* Grid Cards */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-12">
            
            {/* Card 1: The Fridge */}
            <div ref={card1Ref} className="animate-on-scroll stagger-3 group relative bg-[#141414] border border-white/10 p-5 sm:p-6 md:p-14 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[3rem] overflow-hidden hover:border-[#EAB308] transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[400px] card-shine hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-lg sm:rounded-xl md:rounded-2xl bg-[#EAB308] flex items-center justify-center mb-3 sm:mb-4 md:mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                  <Box className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-6 uppercase italic group-hover:text-[#EAB308] transition-colors duration-300">The Fridge</h3>
                <p className="text-gray-400 text-sm sm:text-base md:text-xl leading-relaxed font-medium">
                  An exclusive marketplace for the city&apos;s best home bakers. <span className="text-white">Limited batches.</span> When they&apos;re gone, they&apos;re gone.
                </p>
              </div>
            </div>

            {/* Card 2: Takinator */}
            <div ref={card2Ref} className="animate-on-scroll stagger-4 group relative bg-[#141414] border border-white/10 p-5 sm:p-6 md:p-14 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[3rem] overflow-hidden hover:border-[#EAB308] transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[400px] card-shine hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-lg sm:rounded-xl md:rounded-2xl bg-[#EAB308] flex items-center justify-center mb-3 sm:mb-4 md:mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-black group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-6 uppercase italic group-hover:text-[#EAB308] transition-colors duration-300">Takinator AI</h3>
                <p className="text-gray-400 text-sm sm:text-base md:text-xl leading-relaxed font-medium">
                  Your personal <span className="text-white">AI Food Genie</span>. Tell it your craving, and it finds the hidden halal gems instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------
          SECTION 3: OUR PROMISE (Zig-Zag Return - Same as Hero)
      ------------------------------------------------------- */}
      <section ref={promiseRef} className="min-h-screen w-full bg-[#EAB308] relative flex flex-col justify-center items-center px-3 sm:px-4 md:px-10 py-10 sm:py-12 md:py-20 overflow-hidden">
        
        {/* Floating ambient particles for section 3 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-[15%] left-[15%] w-3 h-3 bg-black/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
          <div className="absolute bottom-[35%] right-[30%] w-2.5 h-2.5 bg-black/15 rounded-full animate-float-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[60%] left-[10%] w-24 h-24 bg-black/5 rounded-full blur-2xl animate-breathe" />
        </div>
        
        {/* Diagonal Overlay - Black on Gold (Same as Hero) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundColor: BRAND.BLACK,
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
          }}
        />

        {/* Header - Positioned higher on desktop, pill badge on mobile */}
        <div className="absolute top-24 sm:top-28 md:top-16 left-0 w-full z-10 md:text-center px-4 md:px-0">
          {/* Desktop version */}
          <h2 className="hidden md:block text-7xl font-black uppercase tracking-tighter text-[#0f0f0f]">
            Our Name, Our Promise
          </h2>
          {/* Mobile version - styled pill badge */}
          <div className="md:hidden inline-flex items-center gap-2 bg-[#0f0f0f] px-6 py-3 rounded-full shadow-xl border border-[#EAB308]/30">
            <div className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
            <span className="text-[#EAB308] text-base sm:text-lg font-bold tracking-wide uppercase">
              Our Name, Our Promise
            </span>
          </div>
        </div>

        {/* DESKTOP LAYOUT - Arabic on Gold side, Meaning on Black side */}
        <div className="hidden md:block">
          {/* Arabic "طعام" - Gold side (left), BLACK text */}
          <div 
            className="absolute left-16 top-[35%] z-10 cursor-pointer group"
            onDoubleClick={() => setArabicRevealed(true)}
          >
            <p className="text-[#0f0f0f] text-[10vw] font-black leading-[1.2] select-none group-hover:scale-105 transition-transform duration-500">
              طعام
            </p>
            {/* Double click hint */}
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${arabicRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="bg-[#0f0f0f]/90 px-4 py-2 rounded-full text-[#EAB308] text-sm tracking-wide border border-[#EAB308]/40 animate-pulse whitespace-nowrap">
                Double click me
              </span>
            </div>
          </div>

          {/* Meaning Textbox - Black side (right), appears on double-click */}
          <div 
            className={`absolute right-16 bottom-[20%] z-10 max-w-md bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#EAB308]/30 shadow-2xl text-left transition-all duration-700 ease-out ${
              arabicRevealed 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
            }`}
          >
            <span className="absolute top-6 left-6 text-5xl text-[#EAB308] opacity-20 font-serif">"</span>
            
            <h3 className="text-4xl font-bold text-white mb-4">Ta&apos;am</h3>
            <div className={`w-16 h-1 bg-[#EAB308] mb-6 rounded-full transition-all duration-500 delay-300 ${arabicRevealed ? 'scale-x-100' : 'scale-x-0'} origin-left`} />
            
            <p className="text-xl text-gray-300 leading-snug font-light">
              Translates simply to <span className="text-[#EAB308] font-bold">"Food"</span>.
            </p>
            <p className="text-gray-500 text-base mt-4">
              We style it <b className="text-white">Taeam</b> — making 100% Halal accessible to everyone.
            </p>
          </div>
        </div>

        {/* MOBILE LAYOUT - Arabic on gold side */}
        <div className="md:hidden flex flex-col items-start px-1 sm:px-2 mt-28 sm:mt-36">
          {/* Arabic - positioned on gold side (left) */}
          <div 
            className="relative cursor-pointer group"
            onDoubleClick={() => setArabicRevealed(true)}
          >
            <p className="text-[#0f0f0f] text-[14vw] sm:text-[16vw] font-black leading-[1.2] select-none group-hover:scale-105 transition-transform duration-500">
              طعام
            </p>
            {/* Double tap hint */}
            <div className={`absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${arabicRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="bg-[#0f0f0f]/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[#EAB308] text-[10px] sm:text-xs tracking-wide border border-[#EAB308]/40 animate-pulse whitespace-nowrap">
                Double tap me
              </span>
            </div>
          </div>

          {/* Meaning - appears below on mobile */}
          <div 
            className={`mt-12 sm:mt-16 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-sm bg-[#1a1a1a] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#EAB308]/30 shadow-2xl text-left transition-all duration-700 ease-out ${
              arabicRevealed 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
            }`}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Ta&apos;am</h3>
            <div className={`w-8 sm:w-10 h-1 bg-[#EAB308] mb-3 sm:mb-4 rounded-full transition-all duration-500 delay-300 ${arabicRevealed ? 'scale-x-100' : 'scale-x-0'} origin-left`} />
            
            <p className="text-sm sm:text-base text-gray-300 leading-snug font-light">
              Translates simply to <span className="text-[#EAB308] font-bold">"Food"</span>.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              We style it <b className="text-white">Taeam</b> — making 100% Halal accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER (Simple & Clean) */}
      <footer className="bg-black py-6 sm:py-8 md:py-12 text-center border-t border-white/10 relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent" />
        
        <div className="animate-on-scroll flex flex-col items-center gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4">
            <a href="https://instagram.com/taeam.ca" target="_blank" className="group flex items-center gap-1.5 sm:gap-2 md:gap-3 text-gray-400 hover:text-[#EAB308] transition-all duration-300 text-xs sm:text-sm md:text-lg">
                <div className="p-1 sm:p-1.5 md:p-2 bg-white/5 rounded-full group-hover:bg-[#EAB308] group-hover:text-black transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> 
                </div>
                <span className="font-medium tracking-wide hover-underline">Follow @taeam.ca</span>
            </a>
            <p className="text-gray-700 text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest uppercase hover:text-gray-500 transition-colors duration-300">© 2026 Taeam Inc. Edmonton.</p>
        </div>
      </footer>
    </main>
  );
}