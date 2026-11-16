import type { ReactNode } from "react";

/**
 * Taeam Grocery art, drawn as inline SVG so the pages look finished with no
 * photos. Same style as the app's drawn art: flat shapes, warm muted colours,
 * thin dark outlines, no text anywhere in the picture.
 *
 * <GroceryShelfArt> is a port of the customer app's GroceryShelfArt
 * (taeam_app/lib/screens/grocery/grocery_shelf_art.dart): same 360 x 230
 * design space, same product rects and shapes, same 11 second scanner loop.
 * If one changes, change the other so the website and the app match.
 *
 * Every scene paints its wall and floor well past its viewBox, so when a slot
 * is a different shape from the art ("meet" scaling) the extra space shows
 * more wall instead of an empty band.
 */

// Palette shared with the app's art.
const C = {
  cream: "#F6F1E7",
  paper: "#FFFFFF",
  kraft: "#E6D3B3",
  kraftFold: "#D8C29C",
  wood: "#D9C6A5",
  woodEdge: "#C4AE88",
  gold: "#EEA742",
  goldDeep: "#C98A2E",
  leaf: "#D6E3CF",
  green: "#2F7D55",
  honey: "#F2C46B",
  crust: "#D9A35A",
  crumb: "#F3D9A8",
  tomato: "#C0533A",
  cheese: "#F4D27A",
  cheeseHole: "#E2B652",
  oil: "#E6C55A",
  tin: "#E4E2DC",
  chickpea: "#E9C46A",
  date: "#7A4A24",
  ink: "#1C1C1C",
} as const;

/** The outline every drawn shape uses (about 1.5px at design size). */
const INK = {
  stroke: C.ink,
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

interface Box {
  l: number;
  t: number;
  w: number;
  h: number;
}
const R = (b: Box) => b.l + b.w;
const B = (b: Box) => b.t + b.h;
const CX = (b: Box) => b.l + b.w / 2;

// ─── Products (shapes and offsets copied from the Dart painter) ─────────────

function RiceSack({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), b = B(r), cx = CX(r);
  return (
    <g>
      <path
        d={`M${l + 14},${t + 12} Q${l + 2},${t + 30} ${l + 3},${b - 8} Q${l + 3},${b} ${l + 12},${b} L${rr - 12},${b} Q${rr - 3},${b} ${rr - 3},${b - 8} Q${rr - 2},${t + 30} ${rr - 14},${t + 12} Z`}
        fill={C.paper}
        {...INK}
      />
      <path
        d={`M${l + 16},${t + 12} L${l + 22},${t} L${cx},${t + 6} L${rr - 22},${t} L${rr - 16},${t + 12} Z`}
        fill={C.paper}
        {...INK}
      />
      <line x1={l + 17} y1={t + 13} x2={rr - 17} y2={t + 13} {...INK} strokeWidth={2.2} />
      <rect x={l + 8} y={t + 32} width={r.w - 16} height={18} rx={2} fill={C.gold} {...INK} />
      {[-9, 0, 9].map((dx) => (
        <ellipse
          key={dx}
          cx={0}
          cy={0}
          rx={1.6}
          ry={3.2}
          fill={C.ink}
          transform={`translate(${cx + dx} ${t + 41}) rotate(34.4)`}
        />
      ))}
    </g>
  );
}

function Jar({ r }: { r: Box }) {
  const l = r.l, t = r.t, b = B(r);
  return (
    <g>
      <rect x={l} y={t + 8} width={r.w} height={r.h - 8} rx={8} fill={C.honey} {...INK} />
      <rect x={l + 4} y={t} width={r.w - 8} height={9} rx={2} fill={C.goldDeep} {...INK} />
      <rect x={l + 5} y={t + 22} width={r.w - 10} height={16} fill={C.paper} {...INK} />
      <line
        x1={l + 6}
        y1={t + 14}
        x2={l + 6}
        y2={b - 6}
        stroke={C.paper}
        strokeOpacity={0.7}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Carton({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r);
  return (
    <g>
      <path d={`M${l},${t + 16} L${l + 6},${t + 4} L${rr - 6},${t + 4} L${rr},${t + 16} Z`} fill={C.paper} {...INK} />
      <rect x={l + 8} y={t} width={r.w - 16} height={4} fill={C.paper} {...INK} />
      <rect x={l} y={t + 16} width={r.w} height={r.h - 16} fill={C.paper} />
      <rect x={l} y={t + 30} width={r.w} height={16} fill={C.leaf} />
      <line x1={l} y1={t + 30} x2={rr} y2={t + 30} {...INK} />
      <line x1={l} y1={t + 46} x2={rr} y2={t + 46} {...INK} />
      <rect x={l} y={t + 16} width={r.w} height={r.h - 16} fill="none" {...INK} />
      <circle cx={CX(r)} cy={t + 38} r={4} fill={C.green} />
    </g>
  );
}

function DatesBox({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), cx = CX(r);
  return (
    <g>
      <rect x={l} y={t} width={r.w} height={r.h} rx={3} fill={C.green} {...INK} />
      <rect x={l + 8} y={t + 16} width={r.w - 16} height={26} rx={10} fill={C.cream} {...INK} />
      {[-12, 0, 12].map((dx) => (
        <ellipse key={dx} cx={cx + dx} cy={t + 29} rx={4.5} ry={7} fill={C.date} />
      ))}
      <line x1={l + 10} y1={t + 9} x2={rr - 10} y2={t + 9} stroke={C.gold} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

function OilBottle({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), b = B(r);
  return (
    <g>
      <path
        d={`M${l + 10},${t + 10} L${rr - 10},${t + 10} L${rr - 10},${t + 22} Q${rr},${t + 28} ${rr},${t + 38} L${rr},${b - 4} Q${rr},${b} ${rr - 4},${b} L${l + 4},${b} Q${l},${b} ${l},${b - 4} L${l},${t + 38} Q${l},${t + 28} ${l + 10},${t + 22} Z`}
        fill={C.oil}
        {...INK}
      />
      <rect x={l + 9} y={t} width={r.w - 18} height={11} rx={2} fill={C.ink} />
      <rect x={l + 3} y={t + 44} width={r.w - 6} height={16} fill={C.paper} {...INK} />
    </g>
  );
}

function FlourBag({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), b = B(r), cx = CX(r);
  return (
    <g>
      <rect x={l} y={t + 10} width={r.w} height={r.h - 10} fill={C.kraft} {...INK} />
      <path d={`M${l},${t + 10} L${l + 4},${t} L${rr - 4},${t} L${rr},${t + 10} Z`} fill={C.kraftFold} {...INK} />
      <circle cx={cx} cy={t + 34} r={11} fill={C.paper} {...INK} />
      <circle cx={cx} cy={t + 34} r={6} fill={C.gold} />
      <line x1={l + 10} y1={b - 10} x2={rr - 10} y2={b - 10} {...INK} />
    </g>
  );
}

function Cans({ r }: { r: Box }) {
  const can = (x: number, band: string) => (
    <g key={x}>
      <rect x={x} y={r.t} width={28} height={r.h} rx={3} fill={C.tin} />
      <rect x={x} y={r.t + 9} width={28} height={r.h - 18} fill={band} />
      <line x1={x} y1={r.t + 9} x2={x + 28} y2={r.t + 9} {...INK} />
      <line x1={x} y1={B(r) - 9} x2={x + 28} y2={B(r) - 9} {...INK} />
      <rect x={x} y={r.t} width={28} height={r.h} rx={3} fill="none" {...INK} />
      <circle cx={x + 14} cy={r.t + r.h / 2} r={5} fill={C.paper} />
    </g>
  );
  return (
    <g>
      {can(r.l, C.tomato)}
      {can(r.l + 34, C.chickpea)}
    </g>
  );
}

function CheeseWedge({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), b = B(r);
  return (
    <g>
      <path d={`M${l},${b} L${l},${t + 14} L${rr},${t} L${rr},${b} Z`} fill={C.cheese} {...INK} />
      <line x1={l} y1={t + 14} x2={rr} y2={t + 14} {...INK} />
      <circle cx={l + 14} cy={t + 26} r={4} fill={C.cheeseHole} />
      <circle cx={l + 34} cy={t + 30} r={3} fill={C.cheeseHole} />
      <circle cx={l + 44} cy={t + 21} r={2.5} fill={C.cheeseHole} />
    </g>
  );
}

function Bread({ r }: { r: Box }) {
  const l = r.l, t = r.t, rr = R(r), b = B(r);
  return (
    <g>
      <path
        d={`M${l + 4},${b} L${l + 2},${t + 16} Q${l + 2},${t} ${l + 22},${t + 2} L${rr - 22},${t + 2} Q${rr - 2},${t} ${rr - 2},${t + 16} L${rr - 4},${b} Z`}
        fill={C.crust}
        {...INK}
      />
      {[18, 34, 50].map((x) => (
        <line
          key={x}
          x1={l + x}
          y1={t + 9}
          x2={l + x + 8}
          y2={t + 20}
          stroke={C.crumb}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

// ─── Scene pieces ───────────────────────────────────────────────────────────

/** Cream wall with faint tile lines, painted well past the viewBox. */
function Wall({ w }: { w: number }) {
  const lines: number[] = [];
  for (let x = 30 - 600; x < w + 600; x += 60) lines.push(x);
  return (
    <g>
      <rect x={-600} y={-600} width={w + 1200} height={1600} fill={C.cream} />
      {lines.map((x) => (
        <line key={x} x1={x} y1={-600} x2={x} y2={1000} stroke={C.ink} strokeOpacity={0.04} strokeWidth={1} />
      ))}
    </g>
  );
}

function Plank({ y, w }: { y: number; w: number }) {
  return (
    <g>
      <rect x={-600} y={y} width={w + 1200} height={10} fill={C.wood} />
      <rect x={-600} y={y + 10} width={w + 1200} height={3} fill={C.woodEdge} />
      <line x1={-600} y1={y} x2={w + 600} y2={y} stroke={C.ink} strokeOpacity={0.55} strokeWidth={1.2} />
    </g>
  );
}

const TAG_BARS = [0, 2, 3.2, 5.6, 6.8, 9, 11.4, 12.6, 14.8, 16];

/** A white shelf tag with a little barcode. */
function Tag({ cx, shelfY }: { cx: number; shelfY: number }) {
  const left = cx - 15;
  const top = shelfY + 1.5;
  return (
    <g>
      <rect x={left} y={top} width={30} height={8.5} rx={1.5} fill={C.paper} />
      {TAG_BARS.map((dx) => (
        <line
          key={dx}
          x1={left + 3 + dx}
          y1={top + 2}
          x2={left + 3 + dx}
          y2={top + 6.5}
          stroke={C.ink}
          strokeOpacity={0.7}
          strokeWidth={0.8}
        />
      ))}
    </g>
  );
}

/** The small green check that sits on a tag's top right corner. */
function Check({ x, y, className }: { x: number; y: number; className?: string }) {
  return (
    <g className={className}>
      <circle cx={x} cy={y} r={7.4} fill={C.paper} />
      <circle cx={x} cy={y} r={6} fill={C.green} />
      <path
        d={`M${x - 2.6},${y + 0.2} L${x - 0.7},${y + 2.1} L${x + 2.8},${y - 1.9}`}
        fill="none"
        stroke={C.paper}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Gold viewfinder corners around a box (corner length 9, like the app). */
function Corners({ b, len = 9, width = 3 }: { b: Box; len?: number; width?: number }) {
  const l = b.l, t = b.t, rr = R(b), bb = B(b);
  const p = { fill: "none", stroke: C.gold, strokeWidth: width, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g>
      <path d={`M${l},${t + len} L${l},${t} L${l + len},${t}`} {...p} />
      <path d={`M${rr - len},${t} L${rr},${t} L${rr},${t + len}`} {...p} />
      <path d={`M${l},${bb - len} L${l},${bb} L${l + len},${bb}`} {...p} />
      <path d={`M${rr - len},${bb} L${rr},${bb} L${rr},${bb - len}`} {...p} />
    </g>
  );
}

/** The scan line and the soft band trailing it, drawn at y = 0. */
function ScanLine({ x1, x2 }: { x1: number; x2: number }) {
  return (
    <g>
      {[1, 2, 3].map((k) => (
        <line
          key={k}
          x1={x1}
          y1={-k * 2.5}
          x2={x2}
          y2={-k * 2.5}
          stroke={C.gold}
          strokeOpacity={0.22 - k * 0.06}
          strokeWidth={2.5}
        />
      ))}
      <line x1={x1} y1={0} x2={x2} y2={0} stroke={C.goldDeep} strokeOpacity={0.9} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

const inflate = (b: Box, d: number): Box => ({ l: b.l - d, t: b.t - d, w: b.w + 2 * d, h: b.h + 2 * d });

// ─── The shelf (hero) ───────────────────────────────────────────────────────

const SHELF_W = 360;
const SHELF_H = 230;
const SHELF1 = 104;
const SHELF2 = 204;

type Product = (props: { r: Box }) => ReactNode;

// Left to right on the top shelf, then the bottom shelf; the scanner visits
// them in this order. Rects are the Dart file's, unchanged.
const ITEMS: { r: Box; Draw: Product }[] = [
  { r: { l: 22, t: 34, w: 62, h: 70 }, Draw: RiceSack },
  { r: { l: 98, t: 52, w: 40, h: 52 }, Draw: Jar },
  { r: { l: 152, t: 38, w: 40, h: 66 }, Draw: Carton },
  { r: { l: 206, t: 44, w: 54, h: 60 }, Draw: DatesBox },
  { r: { l: 276, t: 30, w: 30, h: 74 }, Draw: OilBottle },
  { r: { l: 20, t: 142, w: 58, h: 62 }, Draw: FlourBag },
  { r: { l: 94, t: 162, w: 64, h: 42 }, Draw: Cans },
  { r: { l: 174, t: 166, w: 58, h: 38 }, Draw: CheeseWedge },
  { r: { l: 248, t: 168, w: 74, h: 36 }, Draw: Bread },
];

const tagPos = (i: number) => {
  const shelfY = i < 5 ? SHELF1 : SHELF2;
  const cx = CX(ITEMS[i].r);
  return { cx, shelfY, checkX: cx + 16, checkY: shelfY + 2.5 };
};

// The loop, in fractions of an 11 second cycle (the app's timeline): the
// frame visits each product during 0..0.84 (moving for the first 35% of a
// product's turn, then a scan line sweeps down it), everything holds checked
// to 0.94, and the checks fade for the next loop.
const LOOP_S = 11;
const SCAN_END = 0.84;
const SEG = SCAN_END / ITEMS.length;
const pct = (f: number) => `${(f * 100).toFixed(3)}%`;
const FRAMES = ITEMS.map((it) => inflate(it.r, 7));

function buildShelfCss(): string {
  const css: string[] = [];
  // Corner keyframes: each corner glides from product to product.
  const corners = {
    tl: (b: Box) => [b.l, b.t],
    tr: (b: Box) => [R(b), b.t],
    bl: (b: Box) => [b.l, B(b)],
    br: (b: Box) => [R(b), B(b)],
  } as const;
  for (const [name, at] of Object.entries(corners)) {
    const start = at({ ...FRAMES[0], l: FRAMES[0].l - 40 });
    const steps: string[] = [`0%{transform:translate(${start[0]}px,${start[1]}px)}`];
    FRAMES.forEach((f, i) => {
      const [x, y] = at(f);
      steps.push(`${pct(i * SEG + 0.35 * SEG)},${pct((i + 1) * SEG)}{transform:translate(${x}px,${y}px)}`);
    });
    const [lx, ly] = at(FRAMES[FRAMES.length - 1]);
    steps.push(`99.9%{transform:translate(${lx}px,${ly}px)}`);
    steps.push(`100%{transform:translate(${start[0]}px,${start[1]}px)}`);
    css.push(`@keyframes gs-c-${name}{${steps.join("")}}`);
    css.push(`.gs-c-${name}{animation:gs-c-${name} ${LOOP_S}s ease-in-out infinite}`);
  }
  css.push(
    `@keyframes gs-fo{0%{opacity:0}${pct(0.35 * SEG)},${pct(SCAN_END)}{opacity:1}${pct(SCAN_END + 0.04)},100%{opacity:0}}`,
    `.gs-fo{animation:gs-fo ${LOOP_S}s linear infinite}`,
  );
  // Scan line per product, and the check that pops in when it finishes.
  FRAMES.forEach((f, i) => {
    const s = i * SEG + 0.35 * SEG;
    const e = (i + 1) * SEG;
    const y0 = f.t + 4;
    const y1 = B(f) - 4;
    css.push(
      `@keyframes gs-s${i}{0%,${pct(s)}{opacity:0;transform:translateY(${y0}px)}${pct(s + 0.0001)}{opacity:1;transform:translateY(${y0}px)}${pct(e)}{opacity:1;transform:translateY(${y1}px)}${pct(e + 0.0001)},100%{opacity:0;transform:translateY(${y1}px)}}`,
      `.gs-s${i}{opacity:0;animation:gs-s${i} ${LOOP_S}s linear infinite}`,
      `@keyframes gs-k${i}{0%,${pct(e)}{transform:scale(0);animation-timing-function:cubic-bezier(.33,1,.68,1)}${pct(e + 0.025)},94%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}`,
      `.gs-k${i}{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:gs-k${i} ${LOOP_S}s linear infinite}`,
    );
  });
  // Reduced motion: the moving layer goes, the still picture shows.
  css.push(
    `.gs-still{display:none}`,
    `@media (prefers-reduced-motion: reduce){.gs-anim{display:none}.gs-still{display:inline}}`,
  );
  return css.join("\n");
}

const SHELF_CSS = buildShelfCss();

/** The product the still picture frames, and how many tags before it are checked. */
const STILL_AT = 3;

function ShelfStill() {
  const f = FRAMES[STILL_AT];
  return (
    <g>
      {ITEMS.slice(0, STILL_AT).map((_, i) => {
        const p = tagPos(i);
        return <Check key={i} x={p.checkX} y={p.checkY} />;
      })}
      <Corners b={f} />
      <g transform={`translate(0 ${f.t + 4 + (f.h - 8) * 0.55})`}>
        <ScanLine x1={f.l + 4} x2={R(f) - 4} />
      </g>
    </g>
  );
}

function ShelfAnimated() {
  const f0 = FRAMES[0];
  const len = 9;
  const p = { fill: "none", stroke: C.gold, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g className="gs-anim">
      {ITEMS.map((_, i) => {
        const t = tagPos(i);
        return <Check key={i} x={t.checkX} y={t.checkY} className={`gs-k${i}`} />;
      })}
      {FRAMES.map((f, i) => (
        <g key={i} className={`gs-s${i}`} transform={`translate(0 ${f.t + 4})`}>
          <ScanLine x1={f.l + 4} x2={R(f) - 4} />
        </g>
      ))}
      <g className="gs-fo">
        <path className="gs-c-tl" d={`M0,${len} L0,0 L${len},0`} {...p} transform={`translate(${f0.l - 40} ${f0.t})`} />
        <path className="gs-c-tr" d={`M${-len},0 L0,0 L0,${len}`} {...p} transform={`translate(${R(f0) - 40} ${f0.t})`} />
        <path className="gs-c-bl" d={`M0,${-len} L0,0 L${len},0`} {...p} transform={`translate(${f0.l - 40} ${B(f0)})`} />
        <path className="gs-c-br" d={`M${-len},0 L0,0 L0,${-len}`} {...p} transform={`translate(${R(f0) - 40} ${B(f0)})`} />
      </g>
    </g>
  );
}

/**
 * Two shelves of everyday staples with white shelf tags. Animated: a gold
 * scanner frame moves product to product and each tag gets a green check as
 * it finishes. Still (`animate={false}`, or when the visitor asks for reduced
 * motion): the frame rests on the box of dates and the first three tags are
 * checked.
 */
export function GroceryShelfArt({
  animate = true,
  decorative = false,
  className,
  label = "A drawn grocery shelf with a rice sack, a jar, a milk carton, a box of dates, a bottle of oil, a bag of flour, two cans, a wedge of cheese and a loaf of bread. Each sits above a white shelf tag, some tags carry a small green check, and a gold scanner frame surrounds one product.",
}: {
  animate?: boolean;
  /** Inside a link or card whose text already says it all: hidden from screen readers. */
  decorative?: boolean;
  className?: string;
  label?: string;
}) {
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label };
  return (
    <svg
      viewBox={`0 0 ${SHELF_W} ${SHELF_H}`}
      preserveAspectRatio="xMidYMid meet"
      {...a11y}
      className={className}
    >
      {animate && <style dangerouslySetInnerHTML={{ __html: SHELF_CSS }} />}
      <Wall w={SHELF_W} />
      {ITEMS.map(({ r, Draw }, i) => (
        <Draw key={i} r={r} />
      ))}
      <Plank y={SHELF1} w={SHELF_W} />
      <Plank y={SHELF2} w={SHELF_W} />
      {ITEMS.map((_, i) => {
        const t = tagPos(i);
        return <Tag key={i} cx={t.cx} shelfY={t.shelfY} />;
      })}
      {animate ? (
        <>
          <ShelfAnimated />
          <g className="gs-still">
            <ShelfStill />
          </g>
        </>
      ) : (
        <ShelfStill />
      )}
    </svg>
  );
}

// ─── Photo-slot stand-ins ───────────────────────────────────────────────────

/**
 * Stand-in for photo slot 1: a phone held up to a shelf, its screen framing a
 * jar in gold scanner corners, with a green check on the result. 4:3.
 */
export function ScanArt({ className }: { className?: string }) {
  const W = 320;
  const phone = { l: 168, t: 30, w: 104, h: 186 };
  const screen = { l: phone.l + 7, t: phone.t + 14, w: phone.w - 14, h: phone.h - 28 };
  const jarOnScreen = { l: screen.l + 25, t: screen.t + 26, w: 40, h: 52 };
  return (
    <svg
      viewBox={`0 0 ${W} 240`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A drawn phone held up to a grocery shelf. On its screen a jar sits inside gold scanner corners, and a green check shows the product has been checked."
      className={className}
    >
      <Wall w={W} />
      <RiceSack r={{ l: 18, t: 98, w: 62, h: 70 }} />
      <Jar r={{ l: 92, t: 116, w: 40, h: 52 }} />
      <OilBottle r={{ l: 140, t: 94, w: 30, h: 74 }} />
      <DatesBox r={{ l: 282, t: 108, w: 54, h: 60 }} />
      <Plank y={168} w={W} />
      <Tag cx={49} shelfY={168} />
      <Tag cx={112} shelfY={168} />
      <Tag cx={309} shelfY={168} />
      {/* The phone. */}
      <rect x={phone.l} y={phone.t} width={phone.w} height={phone.h} rx={12} fill={C.ink} {...INK} />
      <rect x={screen.l} y={screen.t} width={screen.w} height={screen.h} rx={6} fill={C.cream} />
      <rect x={phone.l + 40} y={phone.t + 5} width={24} height={4} rx={2} fill="#3A3A3A" />
      <Jar r={jarOnScreen} />
      <Corners b={inflate(jarOnScreen, 9)} len={10} width={3} />
      <g transform={`translate(0 ${jarOnScreen.t + 30})`}>
        <ScanLine x1={jarOnScreen.l - 5} x2={R(jarOnScreen) + 5} />
      </g>
      {/* The result card on the screen: a check and two quiet lines. */}
      <rect x={screen.l + 6} y={screen.t + 104} width={screen.w - 12} height={44} rx={5} fill={C.paper} {...INK} strokeWidth={1} />
      <Check x={screen.l + 20} y={screen.t + 118} />
      <rect x={screen.l + 32} y={screen.t + 114} width={40} height={5} rx={2.5} fill={C.ink} fillOpacity={0.75} />
      <rect x={screen.l + 14} y={screen.t + 131} width={58} height={4} rx={2} fill={C.ink} fillOpacity={0.25} />
      <rect x={screen.l + 14} y={screen.t + 139} width={44} height={4} rx={2} fill={C.ink} fillOpacity={0.25} />
    </svg>
  );
}

/**
 * Stand-in for photo slot 2: a paper grocery bag on a doormat outside a front
 * door, framed in gold camera corners (the photo the shopper takes). 3:2.
 */
export function DoorstepArt({ className }: { className?: string }) {
  const W = 360;
  const floorY = 196;
  const bag = { l: 196, t: 108, w: 78, h: 84 };
  return (
    <svg
      viewBox={`0 0 ${W} 240`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A drawn paper grocery bag with bread, greens and a milk carton, set on a doormat beside a green front door, framed by gold camera corners."
      className={className}
    >
      {/* Siding. */}
      <rect x={-600} y={-600} width={W + 1200} height={600 + floorY} fill={C.cream} />
      {Array.from({ length: 30 }, (_, k) => floorY - 12 - k * 14)
        .filter((y) => y > -600)
        .map((y) => (
          <line key={y} x1={-600} y1={y} x2={W + 600} y2={y} stroke={C.ink} strokeOpacity={0.05} strokeWidth={1} />
        ))}
      {/* Porch floor. */}
      <rect x={-600} y={floorY} width={W + 1200} height={600} fill={C.wood} />
      <line x1={-600} y1={floorY} x2={W + 600} y2={floorY} stroke={C.ink} strokeOpacity={0.55} strokeWidth={1.2} />
      <rect x={-600} y={floorY + 18} width={W + 1200} height={2} fill={C.woodEdge} />
      {/* Door. */}
      <rect x={52} y={22} width={104} height={floorY - 22} fill={C.paper} {...INK} />
      <rect x={60} y={30} width={88} height={floorY - 30} fill={C.green} {...INK} />
      <rect x={70} y={42} width={68} height={56} rx={2} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeWidth={1.2} />
      <rect x={70} y={110} width={68} height={74} rx={2} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeWidth={1.2} />
      <circle cx={134} cy={112} r={4} fill={C.gold} {...INK} strokeWidth={1.2} />
      {/* Porch light. */}
      <rect x={22} y={60} width={14} height={20} rx={3} fill={C.honey} {...INK} />
      <rect x={20} y={56} width={18} height={5} rx={1.5} fill={C.ink} />
      {/* Doormat, with the bags on it. */}
      <path d={`M${bag.l - 6},${floorY - 4} L${R(bag) + 64},${floorY - 4} L${R(bag) + 72},${floorY + 12} L${bag.l - 14},${floorY + 12} Z`} fill={C.kraftFold} {...INK} />
      {/* What pokes out of the bag: greens, bread, a carton. */}
      <path d={`M${bag.l + 10},${bag.t + 4} Q${bag.l + 4},${bag.t - 22} ${bag.l + 16},${bag.t - 30} Q${bag.l + 22},${bag.t - 14} ${bag.l + 22},${bag.t + 4} Z`} fill={C.leaf} {...INK} />
      <path d={`M${bag.l + 18},${bag.t + 4} Q${bag.l + 22},${bag.t - 26} ${bag.l + 32},${bag.t - 34} Q${bag.l + 36},${bag.t - 14} ${bag.l + 30},${bag.t + 4} Z`} fill={C.green} {...INK} />
      <path d={`M${bag.l + 34},${bag.t + 6} L${bag.l + 36},${bag.t - 16} Q${bag.l + 37},${bag.t - 24} ${bag.l + 46},${bag.t - 24} L${bag.l + 50},${bag.t - 24} Q${bag.l + 58},${bag.t - 24} ${bag.l + 58},${bag.t - 16} L${bag.l + 58},${bag.t + 6} Z`} fill={C.crust} {...INK} />
      <line x1={bag.l + 42} y1={bag.t - 18} x2={bag.l + 46} y2={bag.t - 10} stroke={C.crumb} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={bag.l + 49} y1={bag.t - 18} x2={bag.l + 53} y2={bag.t - 10} stroke={C.crumb} strokeWidth={2.2} strokeLinecap="round" />
      <path d={`M${bag.l + 56},${bag.t + 4} L${bag.l + 56},${bag.t - 8} L${bag.l + 61},${bag.t - 16} L${bag.l + 71},${bag.t - 16} L${bag.l + 76},${bag.t - 8} L${bag.l + 76},${bag.t + 4} Z`} fill={C.paper} {...INK} />
      <rect x={bag.l + 56} y={bag.t - 6} width={20} height={6} fill={C.leaf} {...INK} strokeWidth={1} />
      {/* The bag. */}
      <path d={`M${bag.l},${bag.t} L${R(bag)},${bag.t} L${R(bag) - 4},${B(bag)} L${bag.l + 4},${B(bag)} Z`} fill={C.kraft} {...INK} />
      <path d={`M${bag.l},${bag.t} L${R(bag)},${bag.t} L${R(bag) - 1},${bag.t + 10} L${bag.l + 1},${bag.t + 10} Z`} fill={C.kraftFold} {...INK} />
      <circle cx={CX(bag)} cy={bag.t + 46} r={11} fill={C.paper} {...INK} />
      <circle cx={CX(bag)} cy={bag.t + 46} r={6} fill={C.gold} />
      {/* A second, smaller bag. */}
      <path d={`M${R(bag) + 8},${B(bag) - 52} L${R(bag) + 54},${B(bag) - 52} L${R(bag) + 51},${B(bag)} L${R(bag) + 11},${B(bag)} Z`} fill={C.kraft} {...INK} />
      <path d={`M${R(bag) + 8},${B(bag) - 52} L${R(bag) + 54},${B(bag) - 52} L${R(bag) + 53},${B(bag) - 44} L${R(bag) + 9},${B(bag) - 44} Z`} fill={C.kraftFold} {...INK} />
      <circle cx={R(bag) + 21} cy={B(bag) - 58} r={7} fill={C.tomato} {...INK} />
      <circle cx={R(bag) + 36} cy={B(bag) - 57} r={7} fill={C.tomato} {...INK} />
      {/* The doorstep photo's frame. */}
      <Corners b={{ l: bag.l - 20, t: bag.t - 46, w: bag.w + 96, h: bag.h + 66 }} len={12} width={3} />
    </svg>
  );
}

/**
 * Stand-in for photo slot 3: a small halal grocer and butcher. An awning over
 * shelves of staples, and a counter of fixed-price packs on trays. 3:2.
 */
export function PartnerShopArt({ className }: { className?: string }) {
  const W = 360;
  const stripes = Array.from({ length: 12 }, (_, k) => k * 30);
  const packs = [44, 136, 228];
  return (
    <svg
      viewBox={`0 0 ${W} 240`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A drawn small grocer: a striped awning over a shelf of rice, jars, dates and oil, and a counter below holding three wrapped meat packs on trays, each with a plain white price sticker."
      className={className}
    >
      <Wall w={W} />
      {/* Awning. */}
      {stripes.map((x, k) => (
        <rect key={x} x={x} y={0} width={30} height={34} fill={k % 2 ? C.paper : C.gold} />
      ))}
      <rect x={-600} y={0} width={600} height={34} fill={C.gold} />
      <rect x={W} y={0} width={600} height={34} fill={C.paper} />
      {stripes.map((x, k) => (
        <path
          key={`s${x}`}
          d={`M${x},34 Q${x + 15},48 ${x + 30},34 Z`}
          fill={k % 2 ? C.paper : C.gold}
          {...INK}
        />
      ))}
      <line x1={-600} y1={34} x2={W + 600} y2={34} {...INK} />
      {/* Shelf of staples. */}
      <RiceSack r={{ l: 26, t: 52, w: 62, h: 70 }} />
      <Jar r={{ l: 104, t: 70, w: 40, h: 52 }} />
      <Jar r={{ l: 152, t: 70, w: 40, h: 52 }} />
      <DatesBox r={{ l: 206, t: 62, w: 54, h: 60 }} />
      <OilBottle r={{ l: 280, t: 48, w: 30, h: 74 }} />
      <Plank y={122} w={W} />
      {/* Counter. */}
      <rect x={-600} y={160} width={W + 1200} height={600} fill={C.kraft} />
      <rect x={-600} y={152} width={W + 1200} height={10} fill={C.wood} />
      <line x1={-600} y1={152} x2={W + 600} y2={152} {...INK} />
      <line x1={-600} y1={162} x2={W + 600} y2={162} {...INK} />
      {packs.map((x) => (
        <g key={x}>
          <rect x={x} y={176} width={88} height={46} rx={6} fill={C.paper} {...INK} />
          <rect x={x + 8} y={183} width={72} height={32} rx={8} fill={C.tomato} />
          <path d={`M${x + 18},${193} Q${x + 34},${186} ${x + 50},${195}`} fill="none" stroke="#E08A6E" strokeWidth={3} strokeLinecap="round" />
          <path d={`M${x + 36},${205} Q${x + 52},${198} ${x + 68},${206}`} fill="none" stroke="#E08A6E" strokeWidth={3} strokeLinecap="round" />
          <rect x={x + 8} y={183} width={72} height={32} rx={8} fill={C.paper} fillOpacity={0.18} {...INK} strokeWidth={1} />
          <rect x={x + 52} y={186} width={24} height={14} rx={1.5} fill={C.paper} {...INK} strokeWidth={1} />
          <line x1={x + 56} y1={191} x2={x + 72} y2={191} stroke={C.ink} strokeOpacity={0.6} strokeWidth={1} />
          <line x1={x + 56} y1={195} x2={x + 67} y2={195} stroke={C.ink} strokeOpacity={0.6} strokeWidth={1} />
        </g>
      ))}
    </svg>
  );
}
