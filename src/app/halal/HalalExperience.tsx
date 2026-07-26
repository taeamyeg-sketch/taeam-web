'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Fraunces, Newsreader, Aref_Ruqaa } from 'next/font/google';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import Reveal from '@/components/halal/Reveal';
import CountUp from '@/components/halal/CountUp';
import Figure from '@/components/halal/Figure';

// Editorial display + reading body, plus a calligraphic Arabic for the motif.
const display = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600', '900'], style: ['normal', 'italic'], display: 'swap' });
const body = Newsreader({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], display: 'swap' });
const calligraphy = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' });

/* ── Inline reference marker ── */
function Cite({ n }: { n: number }) {
  return (
    <a href={`#ref-${n}`} className="-m-1 ml-0.5 inline-block p-1 align-super text-[0.6em] font-semibold text-[#B8860B] no-underline hover:underline">
      {n}
    </a>
  );
}

/* ── Pull quote ── */
function Pull({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <Reveal>
      <figure className="my-12 border-l-2 border-[#EAB308] pl-6 sm:my-16 sm:pl-8">
        <blockquote className={`${display.className} text-2xl font-medium italic leading-snug text-[#1a1714] sm:text-4xl`}>
          {children}
        </blockquote>
        {cite && <figcaption className="mt-4 text-xs uppercase tracking-[0.15em] text-[#8a8178]">{cite}</figcaption>}
      </figure>
    </Reveal>
  );
}

/* ── "How Taeam helps" aside ── */
function Aside({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <aside className="my-10 rounded-r-lg border-l-2 border-[#1a1714] bg-black/[0.03] py-5 pl-6 pr-5">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1714]">How Taeam helps</p>
        <p className="text-lg leading-relaxed text-[#4a443d]">{children}</p>
      </aside>
    </Reveal>
  );
}

/* ── Narrow-column chapter ── */
function Chapter({ num, kicker, title, children }: { num: string; kicker: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[44rem] px-6 py-16 sm:py-20">
      <Reveal className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">{num} · {kicker}</span>
        <h2 className={`${display.className} mt-3 text-3xl font-semibold leading-[1.1] text-[#1a1714] sm:text-5xl`}>{title}</h2>
      </Reveal>
      <div className="space-y-6 text-lg leading-[1.75] text-[#3a342d] sm:text-xl">{children}</div>
    </section>
  );
}

export default function HalalExperience() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return (
    // reducedMotion="user" turns every framer-motion reveal/parallax on this
    // page into a no-op for prefers-reduced-motion users.
    <MotionConfig reducedMotion="user">
    <main className={`${body.className} relative min-h-svh overflow-x-clip bg-[#FAF7F0] antialiased selection:bg-[#EAB308] selection:text-black`} style={{ color: '#3a342d' }}>
      {/* Reading progress */}
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[#EAB308]" style={{ scaleX: progress }} />

      {/* Nav */}
      <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-[#1a1714] transition-opacity hover:opacity-60">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {/* ── MASTHEAD ── */}
      <header className="px-6 pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[48rem] text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B]">Taeam Research · Fact-checked 2026</span>
            <p className={`${calligraphy.className} mt-6 text-6xl leading-none text-[#B8860B] sm:text-7xl`}>طعام</p>
            <h1 className={`${display.className} mx-auto mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] text-[#1a1714] sm:text-7xl`}>
              The Halal <span className="italic">Trust Gap</span>
            </h1>
            <p className={`${display.className} mx-auto mt-7 max-w-2xl text-xl font-light leading-snug text-[#5a534a] sm:text-2xl`}>
              Almost two million Muslims in Canada still walk out of restaurants unsure the food is really halal. Here is why it happens, and how we close it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-[#8a8178]">
              <span>Edmonton</span>
              <span className="h-1 w-1 rounded-full bg-[#c9bfb2]" />
              <span>6 min read</span>
              <span className="h-1 w-1 rounded-full bg-[#c9bfb2]" />
              <span>Primary sources</span>
            </div>
          </Reveal>
          <div className="mx-auto mt-12 flex justify-center text-[#c9bfb2]">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </header>

      {/* ── LEDE ── */}
      <section className="mx-auto max-w-[44rem] px-6 pb-12 pt-6">
        <Reveal>
          <p className={`text-xl leading-[1.75] text-[#2b2620] sm:text-2xl [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-1 [&::first-letter]:text-7xl [&::first-letter]:font-semibold [&::first-letter]:leading-[0.7] [&::first-letter]:text-[#1a1714] sm:[&::first-letter]:text-8xl ${display.className}`}>
            Almost all of us have done it. You stand in a restaurant, you look at the halal sign in the window, and you still feel unsure enough to walk out. That instinct is not paranoia. It is earned.
          </p>
        </Reveal>
      </section>

      {/* ── FULL-BLEED IMAGE (scrolls in, then the story continues) ── */}
      <Reveal>
        <Figure
          src="/halal/scene-table.jpg"
          alt="A shared meal at an Edmonton table"
          sizeClass="h-[58svh] sm:h-[72vh]"
          rounded={false}
          className="my-6"
        />
      </Reveal>

      {/* ── CHAPTER 1 ── */}
      <Chapter num="01" kicker="The trust gap" title={<>Eating out when you can&apos;t verify</>}>
        <p>When even trusted Muslim food reviewers cannot get straight answers from big-name chains, the doubt is earned. A 2024 CBC Marketplace investigation went undercover at ten locations of major fast-food chains across the Greater Toronto Area. Many of them could not answer basic questions about the halal food they serve, or back up their certification claims.<Cite n={2} /></p>
        <Pull cite="CBC Marketplace, 2024">
          Four of the ten locations either could not say, or got it wrong, when asked whether the meat was hand or machine slaughtered.
        </Pull>
        <p>For a Muslim this carries real weight. One imam told CBC that being fed machine-cut meat presented as hand-slaughtered is a serious violation of trust, and that it touches a person&apos;s relationship with God. That feeling follows you to every meal out.</p>
        <Aside>
          Instead of trusting a window sign, Taeam shows each restaurant&apos;s real halal details: zabihah or not, hand or machine, stunned or not. It opens as a breakdown on the listing, with a verification tier so you know how it was confirmed. You see it before you order.
        </Aside>
      </Chapter>

      {/* ── CHAPTER 2 ── */}
      <Chapter num="02" kicker="No single standard" title={<>A dozen certifiers, zero referees</>}>
        <p>People assume halal certified means one clear, consistent thing. In Canada it does not. There are more than a dozen certifiers, each with its own rules, and nobody regulates the certifiers themselves.<Cite n={3} /> Reputable bodies disagree on the basics. Some accept only hand slaughter and reject machine-slaughtered poultry. Others consider it acceptable.<Cite n={4} /></p>
        <Pull cite="Salima Jivraj, via CBC News, 2016">
          Anyone can become a certifier. There is no accreditation. That is really the missing link.
        </Pull>
        <p>When two respected bodies cannot agree on whether your chicken is halal, the burden lands on you. You end up doing detective work before dinner, and the label on its own stops being enough to set your heart at ease.</p>
        <Aside>
          Taeam does not ask you to decode competing logos. It shows the facts underneath: zabihah or not, hand or machine, stunned or not. You decide by your own standard.
        </Aside>
      </Chapter>

      {/* ── CHAPTER 3 (with inset figure inside the column) ── */}
      <Chapter num="03" kicker="Fake halal" title={<>Fraud, mislabeling, weak oversight</>}>
        <p>Where demand is high and oversight is weak, fraud follows. Canada has real cases of non-halal meat sold as halal. The Halal Monitoring Authority was founded in 2004, after community investigations found a distributor putting fake halal labels on non-halal meat that reached grocery shelves across the GTA.<Cite n={5} /></p>
        <Reveal>
          <Figure
            src="/halal/label-closeup.jpg"
            alt="A close-up of a halal label on packaged meat"
            caption="A sticker can be printed by anyone. Sourcing is harder to fake."
            sizeClass="aspect-[16/10]"
            className="my-10"
          />
        </Reveal>
        <p>Fraud turns an act of worship into a gamble. You can read the label, look for the certification, do everything right, and still be deceived through no fault of your own.</p>
        <Aside>
          Taeam traces halal status back toward the source, the supplier and its certifier, instead of a sticker that can be faked. Every listing carries a verification tier, which removes one of the places fraud likes to hide.
        </Aside>
      </Chapter>

      {/* ── DARK INTERLUDE (calligraphy, clean) ── */}
      <section className="relative overflow-hidden bg-[#14100c] py-28 sm:py-40">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(115% 75% at 50% 45%, transparent 45%, rgba(0,0,0,0.6))' }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className={`${calligraphy.className} text-[26vw] leading-none text-[#EAB308] sm:text-[12rem]`}>أمانة</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/40">Amanah · trust</p>
            <p className={`${display.className} mx-auto mt-10 max-w-2xl text-3xl font-medium leading-tight text-[#FAF7F0] sm:text-5xl`}>
              Being served haram meat unknowingly breaks something sacred.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CHAPTER 4 (wide, side-by-side image) ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">04 · The hybrid problem</span>
              <h2 className={`${display.className} mt-3 text-3xl font-semibold leading-[1.1] text-[#1a1714] sm:text-5xl`}>&ldquo;Only the chicken is halal&rdquo;</h2>
            </Reveal>
            <div className="space-y-6 text-lg leading-[1.75] text-[#3a342d] sm:text-xl">
              <p>Plenty of restaurants are only partly halal. The chicken might be halal while the beef is not, or halal and non-halal share the same fryer. A vague halal options line hides all of it. CBC found chains using a supplier&apos;s certificate to suggest the whole restaurant was certified. It happened at six of the ten locations they visited.<Cite n={2} /></p>
              <Pull cite="CBC Marketplace, 2024">
                A whole restaurant is only truly certified when every ingredient it uses has been checked.
              </Pull>
              <p>Partly halal quietly moves all the risk onto you, asking you to question staff about every item. Most people will not, so they either avoid the place or eat with a knot in their stomach.</p>
              <Aside>
                Taeam shows the full breakdown, every protein and every method, so &ldquo;only the chicken is halal&rdquo; has nowhere to hide behind a vague label.
              </Aside>
            </div>
          </div>
          <Reveal y={50} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:sticky lg:top-24">
            <Figure
              src="/halal/mixed-grill.jpg"
              alt="A grill with both halal and non-halal items"
              sizeClass="aspect-[4/5]"
            />
          </Reveal>
        </div>
      </section>

      {/* ── CHAPTER 5 ── */}
      <Chapter num="05" kicker="Access" title={<>Halal food deserts outside the metros</>}>
        <p>In big cities you have plenty of choice. Drive an hour out and the picture changes quickly. Outside the major centres, families often travel long distances to reach halal food they trust.<Cite n={6} /> Access should not depend on your postal code.</p>
        <Aside>
          Today Taeam runs in Edmonton, where it directly improves verified access in its home market. Closing the rural and small-town gap across the country is honest future work as we grow. We will not pretend it is solved everywhere yet.
        </Aside>
      </Chapter>

      {/* ── CHAPTER 6 ── */}
      <Chapter num="06" kicker="Delivery apps" title={<>Convenience without trust</>}>
        <p>The big delivery apps treat halal as a search tag you can apply yourself, not a fact that anyone verified. When an order goes wrong, support can feel like a wall. Halal shoppers moved online faster than most: 72 percent shop online, against 53 percent of the general public.<Cite n={7} /> They got the convenience. The trust did not follow.</p>
        <Aside>
          Taeam pairs verified halal listings with real human support and an honest refund process, built deliberately as the opposite of a faceless app.
        </Aside>
      </Chapter>

      {/* ── FULL-BLEED IMAGE #2 ── */}
      <Reveal>
        <Figure
          src="/halal/community.jpg"
          alt="The Muslim community in Edmonton"
          sizeClass="h-[50svh] sm:h-[64vh]"
          rounded={false}
          className="my-6"
        />
      </Reveal>

      {/* ── BY THE NUMBERS ── */}
      <section className="mx-auto max-w-[52rem] px-6 py-20">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">By the numbers</span>
          <h2 className={`${display.className} mt-3 text-3xl font-semibold text-[#1a1714] sm:text-5xl`}>A large, underserved community</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { node: <CountUp to={1775715} />, label: 'Muslims in Canada in 2021, more than double the 2001 figure', ref: 1 },
            { node: <>4<span className="text-xl"> in </span>10</>, label: 'fast-food spots that could not verify their halal slaughter method', ref: 2 },
            { node: <CountUp to={8.3} decimals={1} suffix="%" />, label: 'of Edmonton is Muslim, about 83,015 people', ref: 1 },
            { node: <><span className="text-2xl align-top">$</span><CountUp to={1} suffix="B+" /></>, label: 'estimated Canadian halal market, growing around 13% a year', ref: 8 },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="text-center">
              <div className={`${display.className} text-3xl font-semibold tracking-tight text-[#1a1714] sm:text-4xl xl:text-5xl`}>{s.node}</div>
              <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-[#6b6560]">
                {s.label}<Cite n={s.ref} />
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="mx-auto max-w-[44rem] px-6 py-16">
        <div className="space-y-6 text-lg leading-[1.75] text-[#3a342d] sm:text-xl">
          <Reveal>
            <p>The community behind these numbers is young, with a median age of just 30, and it is growing fast. North America&apos;s Muslim consumer market on its own is worth about US$186 billion, and most of it rates Islamic values as very or extremely important to how they eat.<Cite n={11} /> Even so, study after study finds them underserved. A majority say grocers and major food companies do not meet their needs.<Cite n={9} /></p>
          </Reveal>
          <Reveal>
            <p>This is the gap a transparency-first halal platform is built to close. Convenience is already everywhere. Trust is the part that has been missing.</p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA (dark, calligraphy backdrop) ── */}
      <section className="relative overflow-hidden bg-[#14100c] px-6 py-24 text-center sm:py-32">
        <p className={`${calligraphy.className} pointer-events-none absolute inset-0 flex items-center justify-center text-[40vw] leading-none text-[#EAB308]/[0.05] sm:text-[18rem]`}>
          طعام
        </p>
        <Reveal className="relative mx-auto max-w-2xl">
          <h2 className={`${display.className} text-4xl font-semibold leading-tight text-[#FAF7F0] sm:text-6xl`}>
            We built Taeam to <span className="italic text-[#EAB308]">end the guessing.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/55">
            Know exactly what you are eating, every protein and every method, before you order.
          </p>
          <Link href="/" className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-7 py-4 text-sm font-bold uppercase tracking-wide text-black transition-transform hover:scale-[1.03]">
            Get Taeam <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* ── REFERENCES ── */}
      <section className="border-t border-black/10 bg-[#F3EEE4] px-6 py-16">
        <div className="mx-auto max-w-[44rem]">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#8a8178]">References</h3>
          <ol className="space-y-3 text-sm leading-relaxed text-[#6b6560]">
            {[
              ['A snapshot of the Muslim population in Canada', 'Statistics Canada, 2022', 'https://www.statcan.gc.ca/o1/en/plus/7639-snapshot-muslim-population-canada'],
              ['Fast-food chains serving up halal food with a side of misinformation', 'CBC Marketplace, 2024', 'https://www.cbc.ca/news/marketplace/marketplace-halal-1.7352621'],
              ['Halal labelling rules kick in, but certifying organizations remain unregulated', 'CBC News, 2016', 'https://www.cbc.ca/news/canada/halal-certification-1.3519910'],
              ['New rule for halal labelling leaves industry open to deception', 'The Globe and Mail, 2016', 'https://www.theglobeandmail.com/news/national/new-rule-for-halal-labelling-leaves-industry-open-to-deception-critics-say/article29254281/'],
              ['Muslim community cracking down on fake Halal foods', 'Global News, 2014', 'https://globalnews.ca/news/1376913/muslim-community-cracking-down-on-fake-halal-foods/'],
              ['Fragmented landscape dents Canada’s promising halal food space', 'Salaam Gateway, 2024', 'https://salaamgateway.com/story/the-state-of-halal-food-industry-in-canada'],
              ['2022 Halal Shopper Study (72% shop online)', 'Nourish Food Marketing, 2022', 'https://www.nourish.marketing/news/2022-halal-shopper-study-have-two-years-of-pandemic-changed-behaviours-in-this-demographic'],
              ['How grocers can meet the needs of halal shoppers ($1B / 13%)', 'Canadian Grocer, 2024', 'https://canadiangrocer.com/how-grocers-can-meet-needs-halal-shoppers'],
              ['Is there a gap in how halal consumers are served? (57% / 62%)', 'Strategy, 2018', 'https://strategyonline.ca/2018/10/10/is-there-a-gap-in-how-halal-consumers-are-served/'],
              ['State of the Global Islamic Economy Report 2024/25', 'DinarStandard', 'https://www.dinarstandard.com/insights/sgier-2024-25'],
              ['Thrive 2025, North America Muslim Market Report (US$186B)', 'DinarStandard, 2025', 'https://www.dinarstandard.com/insights/thrive25'],
            ].map(([title, source, href], i) => (
              <li key={i} id={`ref-${i + 1}`} className="flex gap-3 scroll-mt-24">
                <span className="font-semibold text-[#B8860B]">{i + 1}.</span>
                <span>
                  {title}. <span className="italic">{source}.</span>{' '}
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#B8860B] underline-offset-2 hover:underline">Link</a>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center text-[11px] uppercase tracking-wider text-[#a89f92]">&copy; 2026 Taeam Technologies Inc.</p>
        </div>
      </section>
    </main>
    </MotionConfig>
  );
}
