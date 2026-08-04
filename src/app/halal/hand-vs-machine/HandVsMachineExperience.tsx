'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Fraunces, Newsreader, Amiri } from 'next/font/google';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import Reveal from '@/components/halal/Reveal';
import CountUp from '@/components/halal/CountUp';
import Figure from '@/components/halal/Figure';

// Same editorial system as /halal: display serif, reading serif, calligraphy.
const display = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600', '900'], style: ['normal', 'italic'], display: 'swap' });
const body = Newsreader({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], display: 'swap' });
const calligraphy = Amiri({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' });

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

export default function HandVsMachineExperience() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <main className={`${body.className} relative min-h-svh overflow-x-clip bg-[#FAF7F0] antialiased selection:bg-[#EAB308] selection:text-black`} style={{ color: '#3a342d' }}>
      {/* Reading progress */}
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[#EAB308]" style={{ scaleX: progress }} />

      {/* Nav */}
      <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/halal" className="group flex items-center gap-2 text-sm font-semibold text-[#1a1714] transition-opacity hover:opacity-60">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          The Halal Trust Gap
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      {/* ── MASTHEAD ── */}
      <header className="px-6 pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[48rem] text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B]">Taeam Research · Fact-checked 2026</span>
            <p className={`${calligraphy.className} mt-6 text-6xl leading-none text-[#B8860B] sm:text-7xl`}>ذبيحة</p>
            <h1 className={`${display.className} mx-auto mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] text-[#1a1714] sm:text-7xl`}>
              Hand or <span className="italic">Machine</span>
            </h1>
            <p className={`${display.className} mx-auto mt-7 max-w-2xl text-xl font-light leading-snug text-[#5a534a] sm:text-2xl`}>
              Two very different things are both sold as halal chicken in Canada. Here is what actually happens on each line, what scholars say, and how to know which one is on your plate.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-[#8a8178]">
              <span>Canada</span>
              <span className="h-1 w-1 rounded-full bg-[#c9bfb2]" />
              <span>8 min read</span>
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
            There are two ways a halal chicken is slaughtered in Canada. In one, a Muslim holds the bird, says the blessing over that exact animal, and cuts by hand. In the other, a machine does the cutting. Both carry a halal label. Most of us were never told there was a difference.
          </p>
        </Reveal>
      </section>

      {/* ── FULL-BLEED IMAGE ── */}
      <Reveal>
        <Figure
          src="/halal/methods/knife-and-steel.jpg"
          alt="A halal slaughterman hones his knife before work"
          sizeClass="h-[58svh] sm:h-[72vh]"
          rounded={false}
          className="my-6"
        />
      </Reveal>

      {/* ── CHAPTER 1 ── */}
      <Chapter num="01" kicker="The baseline" title={<>How commercial chicken works, halal or not</>}>
        <p>Every large poultry plant runs on the same bones. Live birds are hung on a moving line of shackles, pass through an electrified water bath, and reach a rotating blade that cuts the neck. Then scalding, plucking, and processing. A single line can run 140 birds a minute and more, which is thousands of birds an hour, and Canadian plants are among the fastest anywhere.<Cite n={2} /><Cite n={15} /></p>
        <p>On a conventional line, the kind behind an ordinary fast-food order, that is the whole story. No blessing is said. No Muslim is present in any religious role. Nobody checks each bird against any standard except food safety. This is the baseline the rest of this article measures against.</p>
        <p>So is machine-slaughtered halal just that, with a sticker? No. But you have to look closely to see where the difference lives.</p>
      </Chapter>

      {/* ── CHAPTER 2 ── */}
      <Chapter num="02" kicker="Machine halal" title={<>The same blade, under rules</>}>
        <p>Machine-slaughtered halal uses the same hardware and adds a layer of religious control on top. The standards that permit it are specific about what that layer must contain. A practising Muslim, not just anyone, switches the blade on and recites the tasmiyah, the invocation of God&apos;s name. Muslim workers stand at the blade reciting over the birds as they pass. Any bird the blade misses must be slaughtered by hand, with its own blessing. The cut must sever the right vessels without taking the head off, and a bird that dies before reaching the blade is pulled out and never enters the halal stream.<Cite n={3} /><Cite n={4} /></p>
        <Reveal>
          <Figure
            src="/halal/methods/plant-floor.jpg"
            alt="Inside a modern poultry processing plant"
            caption="The hardware is identical on every line. The rules around it are not."
            sizeClass="aspect-[16/10]"
            className="my-10"
          />
        </Reveal>
        <p>This is not a fringe workaround. The International Islamic Fiqh Academy, the OIC&apos;s scholarly body, resolved in 1997 that slaughter should in principle be done by hand, but that mechanical slaughter of poultry is not prohibited when the conditions are met, and that one tasmiyah can cover a continuous, uninterrupted run of birds.<Cite n={5} /> Egypt&apos;s Dar al-Ifta has ruled similarly.<Cite n={14} /></p>
        <p>Canada&apos;s biggest example describes itself openly. Zabiha Halal, the Maple Lodge Farms brand, publishes in its own FAQ that an automatic rotary blade makes the cut while more than 25 Muslim blessers rotate through stations reciting the tasmiyah as each bird passes, certified by CHFCA and HMO.<Cite n={6} /> Whatever position you take on the method, that level of published detail is exactly the disclosure the whole industry should be giving you.</p>
        <Aside>
          On Taeam, this category is labelled machine-slaughtered with its certifier named, right in the restaurant&apos;s halal breakdown. It is never hidden behind a plain halal badge, and never dressed up as hand-slaughtered.
        </Aside>
      </Chapter>

      {/* ── CHAPTER 3 ── */}
      <Chapter num="03" kicker="Hand slaughter" title={<>One bird, one blessing, one knife</>}>
        <p>Hand slaughter, often called zabihah by hand, is the method the classical books describe. The slaughterman takes hold of the animal, recites the tasmiyah over that specific bird, and makes the cut himself with a sharp knife. In the classical schools of law, the blessing belongs to the person doing the cutting, said over that animal, with no long gap between the two. Hanafi, Maliki, and Hanbali jurists hold that meat is unlawful if the tasmiyah is deliberately left off. The Shafi&apos;i school is more lenient on omission, but still expects the invocation as the norm.<Cite n={11} /></p>
        <Pull cite="Sheikh Younus Kathrada, on the launch of machine-slaughtered halal in Canada, 2003">
          Each and every chicken has to have the tasmiyah recited over it.
        </Pull>
        <p>That sentence is the entire case for hand slaughter. For bodies like Canada&apos;s Halal Monitoring Authority, founded in 2004 by the Canadian Council of Muslim Theologians, a blessing attached to a button press, or spread across a line of thousands, cannot stand in for the act itself. HMA rejects rotating mechanical blades outright, requires the tasmiyah on every animal, and does not allow stunning before the cut.<Cite n={8} /></p>
        <p>And hand slaughter is not a small-farm romance. It exists at supermarket scale in Canada. Mina Halal, the Maple Leaf Foods brand, states that its chicken is strictly zabeeha by hand, each bird individually blessed, verified by HMA.<Cite n={7} /></p>
      </Chapter>

      {/* ── CHAPTER 4 ── */}
      <Chapter num="04" kicker="Stunning" title={<>The question inside the question</>}>
        <p>Before the blade, hand or mechanical, most commercial birds pass through electrified water. At low current the shock knocks the bird unconscious and wears off within minutes. At higher current it can kill.<Cite n={2} /> That difference is everything, because every halal standard agrees on one thing: the animal must be alive at the moment of the cut. An animal that died in the water bath is carrion, and no blessing makes it halal.</p>
        <p>From that shared starting point, the standards split. Some accept reversible stunning for poultry under tight, measured conditions, with any bird that dies from the stun removed from the halal stream. The International Islamic Fiqh Academy accepts electric stunning for livestock but rejects it for poultry precisely because too many birds die from it. Bodies like HMA in Canada and HMC in the United Kingdom reject pre-slaughter stunning in any form.<Cite n={5} /><Cite n={8} /><Cite n={18} /></p>
        <p>Canadian law sits underneath all of this. Federal regulations require stunning before slaughter, with an explicit exemption for religious slaughter, which carries its own welfare conditions: a single continuous cut severing both carotid arteries and both jugular veins, and rapid loss of consciousness.<Cite n={9} /><Cite n={10} /> Unstunned halal slaughter is fully legal in Canada. It is also its own question, separate from hand versus machine. A hand-cut bird can still have been stunned first, which is why the two facts have to be shown separately.</p>
        <Aside>
          This is exactly why the Taeam breakdown shows stunning as its own field, next to slaughter method and certifier, instead of folding everything into one halal badge.
        </Aside>
      </Chapter>

      {/* ── DARK INTERLUDE ── */}
      <section className="relative overflow-hidden bg-[#14100c] py-28 sm:py-40">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(115% 75% at 50% 45%, transparent 45%, rgba(0,0,0,0.6))' }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p dir="rtl" className={`${calligraphy.className} text-[17vw] leading-[1.6] text-[#EAB308] sm:text-[8rem]`}>بسم الله</p>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/40">Tasmiyah · in the name of God</p>
            <p className={`${display.className} mx-auto mt-10 max-w-2xl text-3xl font-medium leading-tight text-[#FAF7F0] sm:text-5xl`}>
              Almost the entire debate comes down to one sentence. Who says it, over what, and when.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CHAPTER 5 ── */}
      <Chapter num="05" kicker="The ruling" title={<>Where scholars actually stand</>}>
        <p>This is a genuine disagreement between serious scholars, not a case of one side being fooled. On the permitting side stand the International Islamic Fiqh Academy, Egypt&apos;s Dar al-Ifta, and the certification model run by IFANCA and its Canadian affiliate.<Cite n={5} /><Cite n={14} /><Cite n={4} /> When machine-slaughtered halal launched in Canada in 2003, ISNA Canada&apos;s director general said that Islamically there is no difference between hand and machine slaughtered chicken.<Cite n={16} /></p>
        <p>On the other side, Hanafi scholarly bodies in North America have ruled that a tasmiyah attached to a button press cannot be the act of slaughter for the thousands of birds that follow it, and that meat produced this way is not halal.<Cite n={11} /><Cite n={12} /> HMA built its entire certification system on that position.<Cite n={8} /> Canada&apos;s certifiers openly disagree with each other on this exact point, and have for years.<Cite n={17} /></p>
        <p>Taeam does not referee that dispute, and never will. Both camps include scholars people rightly trust. What we can do is make sure you never have to guess which method you are getting.</p>
        <Aside>
          We verify and display the facts: hand or machine, stunned or not, certified by whom. You decide what to do with them, with your own scholar. That rule is written into <Link href="/how-we-verify" className="font-semibold text-[#B8860B] underline-offset-2 hover:underline">how we verify</Link>, and we hold ourselves to it.
        </Aside>
      </Chapter>

      {/* ── CHAPTER 6 (wide, side-by-side image) ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">06 · In the wild</span>
              <h2 className={`${display.className} mt-3 text-3xl font-semibold leading-[1.1] text-[#1a1714] sm:text-5xl`}>What Canada actually sells</h2>
            </Reveal>
            <div className="space-y-6 text-lg leading-[1.75] text-[#3a342d] sm:text-xl">
              <p>The two biggest halal chicken brands in the country sit on opposite sides of this line, and both publish where they stand. Zabiha Halal is machine-slaughtered with Muslim blessers on the line.<Cite n={6} /> Mina Halal is hand-slaughtered under HMA.<Cite n={7} /> If you shop retail, the information exists.</p>
              <p>Restaurants are where it dies. When CBC Marketplace asked ten fast-food locations across the GTA whether their halal meat was hand or machine slaughtered, four could not say or got it wrong. One location even claimed its meat was machine-slaughtered when the supplier and HMA both confirmed it was actually cut by hand.<Cite n={1} /> The fact survives the supplier and the certifier, then evaporates at the counter.</p>
              <p>One more thing worth knowing: this whole debate is about chicken. There is no commercial machine for slaughtering cattle, sheep, or goats, so halal beef and lamb are cut by hand as a matter of course. The live question for red meat is stunning, not machinery.<Cite n={2} /><Cite n={8} /></p>
              <Aside>
                Taeam&apos;s per-protein breakdown carries the method, the stunning status, and the certifier from the supplier level to your screen, so what the producer published stops evaporating on the way to your order.
              </Aside>
            </div>
          </div>
          <Reveal y={50} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:sticky lg:top-24">
            <Figure
              src="/halal/methods/label-shelf.jpg"
              alt="Reading a halal label in the grocery cooler"
              sizeClass="aspect-[4/5]"
            />
          </Reveal>
        </div>
      </section>

      {/* ── FULL-BLEED IMAGE #2 ── */}
      <Reveal>
        <Figure
          src="/halal/methods/butcher-portrait.jpg"
          alt="A halal butcher at his counter"
          sizeClass="h-[50svh] sm:h-[64vh]"
          rounded={false}
          className="my-6"
        />
      </Reveal>

      {/* ── BY THE NUMBERS ── */}
      <section className="mx-auto max-w-[52rem] px-6 py-20">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">By the numbers</span>
          <h2 className={`${display.className} mt-3 text-3xl font-semibold text-[#1a1714] sm:text-5xl`}>The scale of the question</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { node: <CountUp to={140} />, label: 'birds per minute and up on a single mechanical slaughter line', ref: 15 },
            { node: <>4<span className="text-xl"> in </span>10</>, label: 'restaurant locations that could not answer hand or machine when CBC asked', ref: 1 },
            { node: <CountUp to={25} suffix="+" />, label: 'Muslim blessers Zabiha Halal says rotate through its machine line', ref: 6 },
            { node: <CountUp to={2004} />, label: 'the year Canada got a certifier built entirely on per-bird hand slaughter', ref: 8 },
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

      {/* ── CHAPTER 7 ── */}
      <Chapter num="07" kicker="At the counter" title={<>Three questions that settle it</>}>
        <p>Everything in this article folds down to three questions. Is the meat hand or machine slaughtered? Was the animal stunned before the cut? Who certifies it? Any restaurant that knows its own supply can answer all three in ten seconds. Most, as CBC showed, cannot.<Cite n={1} /></p>
        <p>You should not need a journalism degree to eat dinner. Ask the three questions anywhere you eat. And where Taeam operates, you will not have to ask, because the answers are already on the listing.</p>
      </Chapter>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#14100c] px-6 py-24 text-center sm:py-32">
        <p className={`${calligraphy.className} pointer-events-none absolute inset-0 flex items-center justify-center text-[40vw] leading-none text-[#EAB308]/[0.05] sm:text-[18rem]`}>
          طعام
        </p>
        <Reveal className="relative mx-auto max-w-2xl">
          <h2 className={`${display.className} text-4xl font-semibold leading-tight text-[#FAF7F0] sm:text-6xl`}>
            Know the method <span className="italic text-[#EAB308]">before you order.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/55">
            Hand or machine, stunned or not, certified by whom. Every restaurant, every protein, on the listing.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <Link href="/" className="group inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-7 py-4 text-sm font-bold uppercase tracking-wide text-black transition-transform hover:scale-[1.03]">
              Get Taeam <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/halal" className="group inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition-colors hover:text-[#EAB308]">
              Read the Halal Trust Gap
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── REFERENCES ── */}
      <section className="border-t border-black/10 bg-[#F3EEE4] px-6 py-16">
        <div className="mx-auto max-w-[44rem]">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#8a8178]">References</h3>
          <ol className="space-y-3 text-sm leading-relaxed text-[#6b6560]">
            {[
              ['Fast-food chains serving up halal food with a side of misinformation', 'CBC Marketplace, 2024', 'https://www.cbc.ca/news/marketplace/marketplace-halal-1.7352621'],
              ['Halal slaughter of livestock: animal welfare science, halal science and jurisprudence (mechanical slaughter and stunning review)', 'Animals, peer-reviewed, 2019', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6718994/'],
              ['Mechanical Slaughtering Guidelines', 'Australian National Imams Council', 'https://anichalal.org.au/guidelines/mechanical-slaughtering/'],
              ['Unique Five-Star Halal Identification System', 'IFANCA', 'https://ifanca.org/unique-five-star-halal-identification-system/'],
              ['Resolution 95 (3/10) concerning Slaughtered Animals', 'International Islamic Fiqh Academy, 1997', 'https://iifa-aifi.org/en/32542.html'],
              ['Zabiha Halal, Frequently Asked Questions', 'Maple Lodge Farms', 'https://zabihahalal.com/faqs/'],
              ['About Us, strictly Zabeeha by Hand', 'Mina Halal, Maple Leaf Foods', 'https://www.minahalal.com/about-us/'],
              ['What is Halal (slaughter and stunning requirements)', 'Halal Monitoring Authority Canada', 'https://hmacanada.org/what-is-halal/'],
              ['Guidelines for ritual slaughter of food animals without pre-slaughter stunning', 'Canadian Food Inspection Agency', 'https://inspection.canada.ca/en/food-guidance-commodity/meat-products-and-food-animals/guidelines-ritual-slaughter-food-animals-wi'],
              ['Humane Slaughter of Farm Animals, position statement', 'Canadian Veterinary Medical Association', 'https://www.canadianveterinarians.net/policy-and-outreach/position-statements/statements/humane-slaughter-of-farm-animals/'],
              ['The Fiqh of Machine Slaughter', 'Halal Food Standards Alliance of America', 'https://www.hfsaa.org/articles/machine-slaughter'],
              ['Fatwa on machine slaughter and button-press tasmiyah', 'Darul Iftaa Canada, Fatwa.ca, 2023', 'https://fatwa.ca/chfca-halal-certification-machine-slaughter-kirkland-chicken-and-maple-lodge-zabiha-halal/'],
              ['Maple Lodge Farms Zabiha Halal announcement (HMO certification)', 'Muslim Link, 2018', 'https://muslimlink.ca/news/maple-lodge-farms-zabiha-halal-announcement-from-sayyid-muhammad-rizvi'],
              ['Permissibility of eating machine-slaughtered poultry', 'Dar al-Ifta al-Misriyyah, Egypt', 'https://www.dar-alifta.org/en/fatwa/details/9405/permissibility-of-eating-machine-slaughtered-poultry'],
              ['The Need for Speed: Poultry Line Speeds, executive briefing', 'United States International Trade Commission', 'https://www.usitc.gov/publications/332/executive_briefings/ebot_the_need_for_speed_poultry_line_speeds.pdf'],
              ['Maple Lodge Farms launches halal chicken (2003 launch coverage and scholar reactions)', 'Shariah Program', 'http://www.shariahprogram.ca/articles/Maple-Lodge.shtml'],
              ['New rule for halal labelling leaves industry open to deception', 'The Globe and Mail, 2016', 'https://www.theglobeandmail.com/news/national/new-rule-for-halal-labelling-leaves-industry-open-to-deception-critics-say/article29254281/'],
              ['Issues of Mechanical Slaughter and Stunning', 'Halal Monitoring Committee, UK', 'https://halalhmc.org/resources/issues-of-mechanical-slaughter-and-stunning/'],
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
