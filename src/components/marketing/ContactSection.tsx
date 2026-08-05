import Image from "next/image";
import { InstagramLogo, EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

/**
 * Contact band. Mirrors the live taeam.ca "Get In Touch / Contact Us" section
 * (Instagram + email, no form), redressed in the new site's design system so it
 * sits in the alternating light/dark rhythm right before the footer. Carries
 * id="contact" for the logo-menu / footer anchor.
 */
const CHANNELS = [
  {
    label: "Instagram",
    value: "@taeam.ca",
    href: "https://instagram.com/taeam.ca",
    external: true,
    icon: InstagramLogo,
  },
  {
    label: "Email",
    value: "contact@taeam.ca",
    href: "mailto:contact@taeam.ca",
    external: false,
    icon: EnvelopeSimple,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      {/* The table after everyone's gone home — the quiet end of the page,
          right before the footer. */}
      <Reveal>
        <div className="relative mb-14 aspect-[21/9] overflow-hidden rounded-3xl">
          <Image
            src="/contact-band.webp"
            alt="A restaurant table after a shared meal has ended, plates pushed together under a single warm pendant"
            fill
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      </Reveal>
      <Reveal>
        <Eyebrow>Get in touch</Eyebrow>
        <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
          Contact us
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-ink-mute">
          Questions, press, or a kitchen that wants on Taeam? Reach out and we&apos;ll
          get back to you.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.label} delay={(i % 2) * 90}>
            <a
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl border border-cream-line bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:border-gold-bright/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-bright/12 text-gold-deep transition-colors group-hover:bg-gold-bright group-hover:text-noir">
                <c.icon className="h-6 w-6" weight="bold" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-ink-mute">
                  {c.label}
                </span>
                <span className="block truncate text-lg font-black tracking-tight text-ink">
                  {c.value}
                </span>
              </span>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-ink-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-deep"
                weight="bold"
                aria-hidden
              />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
