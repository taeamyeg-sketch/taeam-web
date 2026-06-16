import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taeam",
  robots: { index: false, follow: false },
};

/**
 * /banner — a stripped-down, screenshot-ready version of the homepage hero.
 * Just the diagonal gold/black split with TAEAM + طعام and their slogans.
 * No nav, no waitlist, no buttons, no scroll. Built for clean banner screenshots.
 */
export default function Banner() {
  return (
    <main className="fixed inset-0 w-full h-full bg-[#EAB308] overflow-hidden font-sans select-none">
      {/* Black diagonal overlay (bottom-left triangle) */}
      <div
        className="absolute inset-0 bg-[#0f0f0f] z-0 pointer-events-none"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />

      {/* TAEAM — on the gold side */}
      <div className="absolute left-[8%] sm:left-[10%] md:left-[12%] top-[28%] sm:top-1/3 md:top-[30%] z-10">
        <h1 className="text-[#0f0f0f] text-[11vw] sm:text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">
          TAEAM
        </h1>
        <p className="text-[#0f0f0f]/70 text-xs sm:text-sm md:text-xl font-bold tracking-tight mt-1 sm:mt-2 uppercase">
          Taste The Trust
        </p>
      </div>

      {/* طعام — on the black side */}
      <div className="absolute right-[8%] sm:right-[10%] md:right-[12%] bottom-[38%] sm:bottom-[35%] md:bottom-[30%] z-10 text-right">
        <p className="text-[#EAB308] text-[12vw] sm:text-[14vw] md:text-[10vw] font-black leading-none">
          طعام
        </p>
        <span className="text-[#EAB308]/50 text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] mt-1 sm:mt-2 inline-block">
          طعم الثقة
        </span>
      </div>
    </main>
  );
}
