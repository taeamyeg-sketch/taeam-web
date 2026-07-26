"use client";

import { useEffect, useRef, useState } from "react";

/* ── The live numbers behind the calculator ──
   Mirrors the backend exactly (backend/routes/api/rewards.js):
   10 pts per $1 of subtotal, 20 on Taeam Plus, floor-rounded, credited on
   delivery. The daily stack: +5 check-in, +10 trivia, 5 reward videos × 7. */
const PTS_PER_DOLLAR = 10;
const PLUS_MULTIPLIER = 2;
const DAILY_STACK_PTS = 5 + 10 + 5 * 7; // 50
const PTS_PER_DOLLAR_VALUE = 1000; // 1,000 pts = $1.00
const MAX_REDEEM_PTS = 5000; // max points on a single order

/** Number that eases toward its target instead of snapping — the whole
    "calculator feels alive" trick. Honors prefers-reduced-motion. */
function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString("en-CA"),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = value;
      setDisplay(value);
      return;
    }
    const from = shown.current;
    if (from === value) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (value - from) * eased;
      shown.current = next;
      setDisplay(next);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <>{format(display)}</>;
}

const money = (n: number) =>
  n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });

export function PointsCalculator() {
  const [subtotal, setSubtotal] = useState(35);
  const [ordersPerMonth, setOrdersPerMonth] = useState(6);
  const [plus, setPlus] = useState(false);
  const [dailyStack, setDailyStack] = useState(true);

  const ptsPerOrder = Math.floor(
    subtotal * PTS_PER_DOLLAR * (plus ? PLUS_MULTIPLIER : 1),
  );
  const monthlyPts =
    ptsPerOrder * ordersPerMonth + (dailyStack ? DAILY_STACK_PTS * 30 : 0);
  const monthlyValue = monthlyPts / PTS_PER_DOLLAR_VALUE;
  const maxRedeemShare = Math.min(1, monthlyPts / MAX_REDEEM_PTS);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* ── Controls ── */}
      <div className="rounded-3xl border border-noir-line bg-noir-soft p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="calc-subtotal"
            className="text-sm font-semibold text-white/80"
          >
            A typical order
          </label>
          <span className="text-lg font-black text-gold-bright">
            {money(subtotal)}
          </span>
        </div>
        <input
          id="calc-subtotal"
          type="range"
          min={10}
          max={100}
          step={1}
          value={subtotal}
          onChange={(e) => setSubtotal(Number(e.target.value))}
          className="mt-3 h-11 w-full cursor-pointer accent-gold-bright"
        />

        <div className="mt-7 flex items-center justify-between gap-4">
          <label
            htmlFor="calc-orders"
            className="text-sm font-semibold text-white/80"
          >
            Orders a month
          </label>
          <span className="text-lg font-black text-gold-bright">
            {ordersPerMonth}
          </span>
        </div>
        <input
          id="calc-orders"
          type="range"
          min={1}
          max={20}
          step={1}
          value={ordersPerMonth}
          onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
          className="mt-3 h-11 w-full cursor-pointer accent-gold-bright"
        />

        {/* Standard vs Plus */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
            Earning rate
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.06] p-1.5">
            {([
              [false, "Standard", "10 pts / $1"],
              [true, "Taeam Plus", "20 pts / $1"],
            ] as const).map(([isPlus, label, rate]) => (
              <button
                key={label}
                type="button"
                onClick={() => setPlus(isPlus)}
                aria-pressed={plus === isPlus}
                className={`rounded-xl px-3 py-2.5 text-center transition-colors ${
                  plus === isPlus
                    ? "bg-gold-bright text-noir"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="block text-sm font-black uppercase tracking-wide">
                  {label}
                </span>
                <span
                  className={`block text-[11px] font-semibold ${
                    plus === isPlus ? "text-noir/70" : "text-white/40"
                  }`}
                >
                  {rate}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily stack */}
        <button
          type="button"
          onClick={() => setDailyStack((v) => !v)}
          aria-pressed={dailyStack}
          className={`mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
            dailyStack
              ? "border-gold-bright/60 bg-gold-bright/10"
              : "border-noir-line bg-white/[0.04] hover:border-white/20"
          }`}
        >
          <span>
            <span className="block text-sm font-bold text-white">
              I do the daily stack
            </span>
            <span className="block text-[11px] text-white/50">
              Check-in +5 · trivia +10 · 5 reward videos ×7 = 50 pts a day
            </span>
          </span>
          <span
            aria-hidden
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              dailyStack ? "bg-gold-bright" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left] duration-300 ${
                dailyStack ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col justify-between rounded-3xl bg-gold-bright p-6 text-noir sm:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-noir/60">
            You&apos;d earn
          </p>
          <p className="mt-2 text-5xl font-black tracking-tight sm:text-6xl">
            <AnimatedNumber value={monthlyPts} />
            <span className="ml-2 text-lg font-black uppercase tracking-wide text-noir/60">
              pts / mo
            </span>
          </p>
          <p className="mt-1.5 text-sm font-semibold text-noir/70">
            <AnimatedNumber value={ptsPerOrder} /> pts per order, landing when
            it&apos;s delivered.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <div className="rounded-2xl bg-noir/10 px-4 py-3.5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-noir/60">
                Off your food
              </p>
              <p className="mt-1 text-xl font-black min-[400px]:text-2xl">
                <AnimatedNumber value={monthlyValue} format={money} />
                <span className="text-sm font-bold text-noir/60"> / mo</span>
              </p>
            </div>
            <div className="rounded-2xl bg-noir/10 px-4 py-3.5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-noir/60">
                A year of this
              </p>
              <p className="mt-1 text-xl font-black min-[400px]:text-2xl">
                <AnimatedNumber value={monthlyValue * 12} format={money} />
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-noir/60">
            <span>Toward a max redemption</span>
            <span>5,000 pts = $5 on one order</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-noir/15">
            <div
              className="h-full rounded-full bg-noir transition-[width] duration-500 ease-out"
              style={{ width: `${maxRedeemShare * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
