/**
 * Drawn art for the home page's ecosystem tiles (Arbaab, Rewards + Plus), in
 * the same style as the Grocery shelf (components/grocery/GroceryArt.tsx) and
 * the app's drawn art: flat shapes, warm muted colours, thin dark outlines, no
 * words in the picture.
 *
 * Each scene is a 300 x 230 design space drawn with "slice" scaling, so it
 * covers its tile at any shape; the important parts stay inside the middle
 * 260 x 200. The wall and table are painted well past the edges.
 *
 * A gentle loop plays when `animate` is on. Every element's resting style IS
 * the finished picture, and the loop only hides and reveals things, so with
 * reduced motion (or animate={false}) the still frame is the complete scene.
 */

const C = {
  cream: "#F6F1E7",
  paper: "#FFFFFF",
  screen: "#FFFDF8",
  kraft: "#E6D3B3",
  kraftFold: "#D8C29C",
  wood: "#D9C6A5",
  woodEdge: "#C4AE88",
  gold: "#EEA742",
  goldDeep: "#C98A2E",
  leaf: "#D6E3CF",
  green: "#2F7D55",
  bubble: "#EFE9DD",
  rice: "#F7EFD9",
  crust: "#D9A35A",
  tomato: "#C0533A",
  meat: "#9A5A34",
  ink: "#1C1C1C",
} as const;

const INK = {
  stroke: C.ink,
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

interface ArtProps {
  className?: string;
  animate?: boolean;
  /** Hide from screen readers when the tile already says what it is. */
  decorative?: boolean;
}

function Room({ tableY }: { tableY: number }) {
  return (
    <g>
      <rect x={-200} y={-200} width={700} height={tableY + 200} fill={C.cream} />
      {[-30, 30, 90, 150, 210, 270, 330].map((x) => (
        <line key={x} x1={x} y1={-200} x2={x} y2={tableY} stroke={C.ink} strokeOpacity={0.04} />
      ))}
      <rect x={-200} y={tableY} width={700} height={240} fill={C.wood} />
      <rect x={-200} y={tableY + 12} width={700} height={4} fill={C.woodEdge} />
      <line x1={-200} y1={tableY} x2={500} y2={tableY} stroke={C.ink} strokeOpacity={0.55} strokeWidth={1.2} />
    </g>
  );
}

/** A little check badge, the same green as the grocery shelf tags. */
function Check({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.4} fill={C.paper} />
      <circle cx={x} cy={y} r={r} fill={C.green} />
      <path
        d={`M${x - r * 0.43},${y + r * 0.03} L${x - r * 0.12},${y + r * 0.35} L${x + r * 0.47},${y - r * 0.32}`}
        fill="none"
        stroke={C.paper}
        strokeWidth={r * 0.27}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Lines that stand for words inside a bubble (never real text). */
function TextLines({ x, y, widths, color, gap = 6 }: { x: number; y: number; widths: number[]; color: string; gap?: number }) {
  return (
    <g>
      {widths.map((w, i) => (
        <line key={i} x1={x} y1={y + i * gap} x2={x + w} y2={y + i * gap} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      ))}
    </g>
  );
}

// ─── Arbaab ──────────────────────────────────────────────────────────────────

/** Arbaab's real icon (public/takinator_avatar.png) in a gold circle, as in the app. */
function ArbaabAvatar({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const size = r * 1.35;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.gold} />
      <image
        href="/takinator_avatar.png"
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

function DishCard({ x, y, kind }: { x: number; y: number; kind: "wrap" | "biryani" | "kebab" }) {
  return (
    <g>
      <rect x={x} y={y} width={104} height={42} rx={7} fill={C.paper} {...INK} />
      {/* plate */}
      <circle cx={x + 21} cy={y + 21} r={14} fill={C.cream} {...INK} strokeWidth={1.2} />
      {kind === "wrap" && (
        <g>
          <path d={`M${x + 13},${y + 15} L${x + 29},${y + 15} L${x + 23},${y + 32} L${x + 19},${y + 32} Z`} fill={C.kraft} {...INK} strokeWidth={1.2} />
          <path d={`M${x + 13},${y + 15} Q${x + 21},${y + 8} ${x + 29},${y + 15}`} fill={C.crust} {...INK} strokeWidth={1.2} />
          <line x1={x + 15.5} y1={y + 21} x2={x + 26.5} y2={y + 21} stroke={C.ink} strokeWidth={1} />
          <circle cx={x + 18} cy={y + 13} r={1.5} fill={C.leaf} />
          <circle cx={x + 24} cy={y + 12.5} r={1.5} fill={C.tomato} />
        </g>
      )}
      {kind === "biryani" && (
        <g>
          <path d={`M${x + 9},${y + 19} L${x + 33},${y + 19} Q${x + 31},${y + 31} ${x + 21},${y + 31} Q${x + 11},${y + 31} ${x + 9},${y + 19} Z`} fill={C.goldDeep} {...INK} strokeWidth={1.2} />
          <path d={`M${x + 10},${y + 19} Q${x + 21},${y + 9} ${x + 32},${y + 19} Z`} fill={C.rice} {...INK} strokeWidth={1.1} />
          <ellipse cx={x + 24} cy={y + 15} rx={4} ry={2.6} fill={C.meat} />
          <circle cx={x + 16} cy={y + 15.5} r={1.1} fill={C.green} />
          <circle cx={x + 19} cy={y + 13} r={0.9} fill={C.tomato} />
        </g>
      )}
      {kind === "kebab" && (
        <g>
          {[0, 7].map((d) => (
            <g key={d}>
              <line x1={x + 9} y1={y + 26 - d} x2={x + 34} y2={y + 17 - d} stroke={C.ink} strokeWidth={1.1} strokeLinecap="round" />
              {[0, 1, 2].map((k) => (
                <rect
                  key={k}
                  x={x + 13 + k * 6.5}
                  y={y + 18.5 - d - k * 2.4}
                  width={5.5}
                  height={6}
                  rx={1.6}
                  fill={k === 1 ? C.tomato : C.meat}
                  stroke={C.ink}
                  strokeWidth={0.9}
                />
              ))}
            </g>
          ))}
        </g>
      )}
      <TextLines x={x + 42} y={y + 15} widths={[44, 30]} color={C.ink} gap={8} />
      <line x1={x + 42} y1={y + 31} x2={x + 58} y2={y + 31} stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" />
      <Check x={x + 92} y={y + 31} r={5} />
    </g>
  );
}

const ARBAAB_CSS = `
.ab-a .ab-q{animation:ab-q 10s infinite}
.ab-a .ab-dots{animation:ab-dots 10s infinite}
.ab-a .ab-dots circle{animation:ab-blink 1.1s infinite}
.ab-a .ab-dots circle:nth-child(2){animation-delay:.18s}
.ab-a .ab-dots circle:nth-child(3){animation-delay:.36s}
.ab-a .ab-r{animation:ab-r 10s infinite}
.ab-a .ab-c1{animation:ab-c1 10s infinite}
.ab-a .ab-c2{animation:ab-c2 10s infinite}
.ab-a .ab-c3{animation:ab-c3 10s infinite}
@keyframes ab-q{0%,4%{opacity:0;transform:translateY(6px)}9%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes ab-dots{0%,11%{opacity:0}13%,25%{opacity:1}27%,100%{opacity:0}}
@keyframes ab-blink{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes ab-r{0%,26%{opacity:0;transform:translateY(6px)}31%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes ab-c1{0%,34%{opacity:0;transform:translateX(-10px)}39%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes ab-c2{0%,40%{opacity:0;transform:translateX(-10px)}45%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes ab-c3{0%,46%{opacity:0;transform:translateX(-10px)}51%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@media (prefers-reduced-motion: reduce){.ab-a *{animation:none!important}.ab-a .ab-dots{opacity:0}}
.ab-s .ab-dots{opacity:0}
`;

/**
 * Arbaab: a phone on a table with a short chat (the customer asks, Arbaab
 * types, then answers in gold), and three halal dishes found for them sliding
 * in beside it, each with a green check.
 */
export function ArbaabArt({ className, animate = true, decorative = false }: ArtProps) {
  return (
    <svg
      viewBox="0 0 300 230"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "A phone showing a short chat with Arbaab, beside three halal dishes it found, each marked with a check."}
    >
      <style>{ARBAAB_CSS}</style>
      <g className={animate ? "ab-a" : "ab-s"}>
        <Room tableY={196} />
        {/* phone */}
        <rect x={34} y={20} width={112} height={186} rx={16} fill={C.ink} />
        <rect x={40} y={30} width={100} height={168} rx={11} fill={C.screen} />
        <rect x={74} y={34} width={32} height={5} rx={2.5} fill={C.ink} />
        {/* chat header */}
        <ArbaabAvatar cx={57} cy={52} r={11} />
        <line x1={73} y1={49} x2={101} y2={49} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
        <line x1={73} y1={56} x2={89} y2={56} stroke={C.ink} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
        <line x1={44} y1={66} x2={136} y2={66} stroke={C.ink} strokeOpacity={0.08} />
        {/* the customer's question */}
        <g className="ab-q">
          <path d="M82,74 h46 a6,6 0 0 1 6,6 v12 a6,6 0 0 1 -6,6 h-46 a6,6 0 0 1 -6,-6 v-12 a6,6 0 0 1 6,-6 Z" fill={C.bubble} />
          <TextLines x={84} y={82} widths={[40, 26]} color={C.ink} gap={7} />
        </g>
        {/* typing */}
        <g className="ab-dots">
          <rect x={46} y={106} width={34} height={18} rx={9} fill={C.gold} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={56 + i * 7} cy={115} r={2.2} fill={C.ink} />
          ))}
        </g>
        {/* Arbaab's answer */}
        <g className="ab-r">
          <path d="M52,106 h58 a6,6 0 0 1 6,6 v26 a6,6 0 0 1 -6,6 h-58 a6,6 0 0 1 -6,-6 v-26 a6,6 0 0 1 6,-6 Z" fill={C.gold} />
          <TextLines x={54} y={115} widths={[52, 44, 30]} color={C.ink} gap={8} />
        </g>
        {/* input bar */}
        <rect x={46} y={178} width={88} height={13} rx={6.5} fill={C.paper} stroke={C.ink} strokeOpacity={0.15} />
        <circle cx={127} cy={184.5} r={4.5} fill={C.gold} />
        {/* what it found */}
        <g className="ab-c1"><DishCard x={160} y={44} kind="wrap" /></g>
        <g className="ab-c2"><DishCard x={160} y={94} kind="biryani" /></g>
        <g className="ab-c3"><DishCard x={160} y={144} kind="kebab" /></g>
      </g>
    </svg>
  );
}

// ─── Rewards + Plus ──────────────────────────────────────────────────────────

const STAMPS = Array.from({ length: 10 }, (_, i) => ({ col: i % 5, row: Math.floor(i / 5) }));

const PLUS_CSS = `
${STAMPS.map((_, i) => {
  const on = 6 + i * 4.2;
  return `.pl-a .pl-s${i}{animation:pl-s${i} 10s infinite;transform-box:fill-box;transform-origin:center}
@keyframes pl-s${i}{0%,${on.toFixed(1)}%{opacity:0;transform:scale(.4)}${(on + 1.8).toFixed(1)}%,90%{opacity:1;transform:none}96%,100%{opacity:0}}`;
}).join("\n")}
.pl-a .pl-coin{animation:pl-coin 10s infinite}
.pl-a .pl-full{animation:pl-full 10s infinite;transform-box:fill-box;transform-origin:center}
.pl-a .pl-card{animation:pl-card 10s infinite}
@keyframes pl-coin{0%,52%{opacity:0;transform:translateY(-34px)}53%{opacity:1;transform:translateY(-34px)}58%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes pl-full{0%,50%{opacity:0;transform:scale(.4)}53%,90%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes pl-card{0%,56%{transform:none}61%,88%{transform:translateY(-5px)}94%,100%{transform:none}}
@media (prefers-reduced-motion: reduce){.pl-a *{animation:none!important}}
`;

function Coin({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 16},${y} v5 a16,5 0 0 0 32,0 v-5`} fill={C.goldDeep} {...INK} strokeWidth={1.2} />
      <ellipse cx={x} cy={y} rx={16} ry={5} fill={C.gold} {...INK} strokeWidth={1.2} />
      <ellipse cx={x} cy={y} rx={9} ry={2.6} fill="none" stroke={C.goldDeep} strokeWidth={1.1} />
    </g>
  );
}

/**
 * Rewards + Plus: a takeaway bag, a punch card filling with gold stamps one by
 * one (points on every order), a coin dropping onto the stack, and the gold
 * Plus card lifting once the card is full.
 */
export function PlusArt({ className, animate = true, decorative = false }: ArtProps) {
  return (
    <svg
      viewBox="0 0 300 230"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "A takeaway bag, a punch card filling with gold stamps, a stack of coins and the gold Taeam Plus card."}
    >
      <style>{PLUS_CSS}</style>
      <g className={animate ? "pl-a" : "pl-still"}>
        <Room tableY={192} />
        {/* takeaway bag */}
        <path d="M30,92 L94,92 L98,192 L26,192 Z" fill={C.kraft} {...INK} />
        <path d="M30,92 L36,80 L88,80 L94,92 Z" fill={C.kraftFold} {...INK} />
        <path d="M48,80 Q62,58 76,80" fill="none" {...INK} strokeWidth={2.2} />
        <circle cx={62} cy={134} r={14} fill={C.paper} {...INK} />
        <circle cx={62} cy={134} r={8.5} fill={C.gold} />
        <line x1={40} y1={178} x2={84} y2={178} stroke={C.ink} strokeWidth={1.2} />
        {/* punch card */}
        <g transform="rotate(-5 160 92)">
          <rect x={106} y={58} width={112} height={70} rx={7} fill={C.paper} {...INK} />
          <line x1={116} y1={70} x2={150} y2={70} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
          <line x1={116} y1={77} x2={136} y2={77} stroke={C.ink} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
          {STAMPS.map(({ col, row }, i) => {
            const cx = 122 + col * 20;
            const cy = 94 + row * 20;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={7} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeDasharray="2 2" />
                <g className={`pl-s${i}`}>
                  <circle cx={cx} cy={cy} r={7} fill={C.gold} {...INK} strokeWidth={1.1} />
                  <circle cx={cx} cy={cy} r={3} fill={C.goldDeep} />
                </g>
              </g>
            );
          })}
          <g className="pl-full">
            <Check x={212} y={62} r={7} />
          </g>
        </g>
        {/* coin stack */}
        <Coin x={160} y={186} />
        <Coin x={160} y={178} />
        <Coin x={160} y={170} />
        <g className="pl-coin"><Coin x={160} y={162} /></g>
        {/* the Plus card */}
        <g className="pl-card">
          <g transform="rotate(6 238 158)">
            <rect x={192} y={130} width={92} height={58} rx={7} fill={C.gold} {...INK} />
            <rect x={202} y={142} width={16} height={12} rx={2.5} fill={C.paper} stroke={C.ink} strokeWidth={1.1} />
            <line x1={202} y1={170} x2={244} y2={170} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
            <line x1={202} y1={177} x2={228} y2={177} stroke={C.ink} strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
            <circle cx={266} cy={148} r={10} fill={C.ink} />
            <path d="M266,142.5 V153.5 M260.5,148 H271.5" stroke={C.gold} strokeWidth={2.6} strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
