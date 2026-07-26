import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Delete your account',
  description:
    'How to request deletion of your Taeam or Tawsil account and the data we hold on you.',
  robots: { index: true, follow: true },
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-svh bg-cream text-ink">
      <nav className="px-5 sm:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-mute hover:text-ink transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Taeam
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-8 pb-24">
        <header className="mb-10">
          <h1 className="font-black uppercase tracking-tight text-3xl sm:text-4xl text-ink mb-3">Delete Your Account</h1>
          <p className="text-sm text-gold-deep font-medium">Last updated: May 2026</p>
          <p className="mt-4 text-base leading-relaxed text-ink-mute">
            This page covers account deletion for both the <strong className="text-ink">Taeam</strong>{' '}
            customer app and the <strong className="text-ink">Tawsil</strong> driver app. You can
            delete your account from inside the app, or email us if you can&apos;t.
          </p>
        </header>

        <section className="space-y-6">
          <Section title="Option 1: Delete from inside the app (fastest)">
            <p>
              <strong className="text-ink">Taeam customer app:</strong> open the app → Profile →
              Account → <em>Delete account</em>. Confirm. Your account is closed immediately.
            </p>
            <p>
              <strong className="text-ink">Tawsil driver app:</strong> open the app → Profile →
              Account settings → <em>Delete account</em>. Confirm. Your account is closed
              immediately.
            </p>
            <p>
              You&apos;ll be signed out and the account will no longer appear on the platform.
            </p>
          </Section>

          <Section title="Option 2: Email us">
            <p>
              If you can&apos;t access the app, for example you&apos;ve lost your phone or your
              account is locked, send an email to{' '}
              <a href="mailto:contact@taeam.ca" className="text-gold-deep hover:underline">
                contact@taeam.ca
              </a>{' '}
              from the email address on your account. Include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The phone number on your account</li>
              <li>Which app (Taeam or Tawsil)</li>
              <li>A short note confirming you want the account deleted</li>
            </ul>
            <p>
              We&apos;ll verify it&apos;s you, then process the deletion. You&apos;ll get a
              confirmation email within 30 days (usually within a few business days).
            </p>
          </Section>

          <Section title="What gets deleted">
            <p>When you delete your account, the following is removed from active systems:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your name, email, phone number, and profile photo</li>
              <li>Your saved addresses and delivery preferences (Taeam)</li>
              <li>Your driver&apos;s license number, vehicle documents, and bank info (Tawsil)</li>
              <li>Your chat history with restaurants and drivers</li>
              <li>Your push notification token (you&apos;ll stop receiving notifications)</li>
              <li>Your sign-in credentials (Google/Apple links and your PIN)</li>
            </ul>
            <p>
              Stripe deletes your saved payment cards on their side; we never had your full card
              number to begin with.
            </p>
          </Section>

          <Section title="What we have to keep (and for how long)">
            <p>
              Canadian tax and consumer-protection law requires us to keep certain records even
              after you delete your account. These are kept in a restricted system, used only for
              the legal purposes below, and are not associated with an active account:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-ink">Order and earnings records</strong>, kept for{' '}
                <strong className="text-ink">7 years</strong> to meet Canada Revenue Agency tax
                record requirements
              </li>
              <li>
                <strong className="text-ink">Payment receipts and refund records</strong>, kept
                for <strong className="text-ink">7 years</strong> for tax and dispute purposes
              </li>
              <li>
                <strong className="text-ink">Fraud and safety records</strong>: if your account
                was flagged for fraud, abuse, or a safety incident, the relevant records are
                retained to prevent re-registration and to comply with law-enforcement requests
              </li>
            </ul>
            <p>
              After the retention period above, these records are permanently deleted or fully
              anonymized.
            </p>
          </Section>

          <Section title="Aggregate analytics">
            <p>
              We may keep anonymized, aggregated data (for example: &quot;1,200 orders were
              delivered in Edmonton last month&quot;) that can no longer be tied to you. This
              isn&apos;t personal data and isn&apos;t deleted.
            </p>
          </Section>

          <Section title="Changing your mind">
            <p>
              Deletion is permanent. Once processed, we can&apos;t restore your account, your order
              history, your points balance, or your driver onboarding documents. If you sign up
              again with the same phone or email, it&apos;ll be a brand-new account.
            </p>
          </Section>

          <Section title="Just want to stop notifications, not delete?">
            <p>
              You don&apos;t need to delete the account to stop hearing from us. Open the app →
              Settings → Notifications and turn off whichever channels you don&apos;t want. Or reply
              STOP to any SMS to opt out of texts.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about deletion or anything else:{' '}
              <a href="mailto:contact@taeam.ca" className="text-gold-deep hover:underline">
                contact@taeam.ca
              </a>
              .
            </p>
            <p className="mt-2">
              Taeam Technologies Inc.
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
    <div className="bg-white/60 border border-cream-line rounded-2xl shadow-card p-6">
      <h2 className="font-black uppercase tracking-tight text-lg text-ink mb-4">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-ink-mute">{children}</div>
    </div>
  );
}
