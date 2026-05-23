import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Taeam',
  description: 'How Taeam handles your information.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans">
      <nav className="px-5 sm:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Taeam
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-8 pb-24">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-sm text-amber-400 font-medium">Last updated: May 2026</p>
        </header>

        <section className="space-y-6">
          <p className="text-base leading-relaxed text-gray-300">
            This is the plain-English version of how Taeam handles your info. We tried to keep it
            short. The short version: we only collect what we need to run your account and get your
            food to you, we don&apos;t sell your data, and you can email us any time at{' '}
            <a href="mailto:contact@taeam.ca" className="text-amber-400 hover:underline">
              contact@taeam.ca
            </a>{' '}
            to see, fix, or delete what we have on you.
          </p>

          <Section title="What we collect">
            <p>
              We collect the information we need to run your account and get your orders to you.
              That includes your name, phone number, email, and (if you sign in with Google or
              Apple) the basic profile info those sign-in providers share with us.
            </p>
            <p>
              When you place an order we keep a record of what you ordered, where it was delivered,
              and how you paid. If you let us use your location, we use it to show nearby
              restaurants and to track delivery; we don&apos;t track you when the app is closed.
            </p>
            <p>
              We also collect basic technical details — device type, OS version, app version, crash
              reports — so we can fix bugs.
            </p>
          </Section>

          <Section title="What we do with it">
            <p>
              Your info is used to place and deliver orders, send order updates by push, SMS or
              email, run customer support, prevent fraud, and improve the app. If you opt in, we
              may also send you promos and reward updates. You can turn those off at any time in
              Notification Settings without losing the rest of the account.
            </p>
          </Section>

          <Section title="Who we share it with">
            <p>
              Restaurants get your name, order, and delivery instructions so they can prepare your
              food. Drivers get the delivery address and a way to reach you during the drop-off.
              Stripe processes the payment — we never see or store your full card number. We use
              Supabase to host the database and FCM to deliver push notifications.
            </p>
            <p>We don&apos;t sell your data, and we don&apos;t share it with advertisers.</p>
          </Section>

          <Section title="How we keep it safe">
            <p>
              All traffic between the app and our servers is encrypted with TLS. Passwords
              aren&apos;t stored — auth is handled by Supabase. Payment cards aren&apos;t stored
              either — Stripe holds those. Inside the company, only the people who need access to
              do their job have it.
            </p>
            <p>
              Nothing online is bulletproof. If something does go wrong with your data, we&apos;ll
              tell you.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              Under Canadian privacy law (PIPEDA) and Alberta&apos;s PIPA, you can ask us for a
              copy of the info we have on you, ask us to correct anything that&apos;s wrong, or ask
              us to delete your account. You can also opt out of marketing messages without losing
              the account.
            </p>
            <p>
              To do any of these, email{' '}
              <a href="mailto:contact@taeam.ca" className="text-amber-400 hover:underline">
                contact@taeam.ca
              </a>{' '}
              from the address on your account. We&apos;ll get back to you within 30 days.
            </p>
          </Section>

          <Section title="Arbaab (the in-app AI assistant)">
            <p>
              Arbaab is an optional AI helper that can search restaurants, build a cart, and pull
              up your past orders so you can reorder faster. It&apos;s off by default until you
              turn it on.
            </p>
            <p>
              When you chat with it, your message text and the restaurant data it needs to answer
              get sent to OpenAI for processing. We don&apos;t send your name, phone number,
              address, or payment info. Chats aren&apos;t kept on OpenAI&apos;s side after the
              response is generated. We do keep an audit log of any actions it takes inside the app
              (like adding items to a cart) for security reasons — that&apos;s the action, not the
              chat.
            </p>
            <p>
              Arbaab never places or pays for an order on its own. Checkout always needs your tap.
              You can turn it off any time in Settings, and the rest of the app works exactly the
              same.
            </p>
          </Section>

          <Section title="Cookies and tracking">
            <p>
              The app stores small bits of data on your device to remember you&apos;re signed in
              and to remember your preferences (theme, language, default address). We don&apos;t
              use third-party advertising cookies. Basic crash and usage analytics help us spot
              bugs and slow screens.
            </p>
          </Section>

          <Section title="Kids">
            <p>
              Taeam isn&apos;t for anyone under 13. We don&apos;t knowingly collect data from kids
              that age. If you think a child has signed up, email us and we&apos;ll remove the
              account.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change something meaningful in here, we&apos;ll update the date at the top and
              let you know in the app before the change takes effect.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Privacy questions, data requests, or anything else:{' '}
              <a href="mailto:contact@taeam.ca" className="text-amber-400 hover:underline">
                contact@taeam.ca
              </a>
              .
            </p>
            <p className="mt-2">
              Taeam Inc.
              <br />
              Edmonton, Alberta, Canada
            </p>
          </Section>
        </section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-gray-300">{children}</div>
    </div>
  );
}
