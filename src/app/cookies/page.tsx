import type { Metadata } from "next";
import Link from "next/link";
import { CookieChoicesButton } from "@/components/CookieConsent";
import { LegalMail, LegalSection, LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Cookies & Storage",
  description: "What Taeam stores in your browser, and why.",
  robots: { index: true, follow: true },
};

const linkClass =
  "font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 hover:decoration-gold-deep";

export default function CookiesPage() {
  return (
    <LegalShell
      current="/cookies"
      title="Cookies & Storage"
      updated="September 28, 2026"
      intro={
        <>
          The short version: taeam.ca stores a handful of things in your browser
          so the site works. Your sign-in, your address, your cart. One
          advertising tool runs alongside them, the Meta pixel, so we can tell
          which ads bring people here, and you can switch it off. Here&apos;s
          the full list.
        </>
      }
    >
      <LegalSection id="what-we-store" title="What we store, and why">
        <p>
          These live in your browser&apos;s local storage and exist purely so
          the site functions:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Your session:</strong>{" "}
            an authentication token so you stay signed in between visits.
          </li>
          <li>
            <strong className="font-semibold text-ink">Your delivery address:</strong>{" "}
            the address you picked, so you don&apos;t re-enter it every time
            you open the site.
          </li>
          <li>
            <strong className="font-semibold text-ink">Your cart:</strong> what
            you&apos;ve added, so it survives a page refresh.
          </li>
          <li>
            <strong className="font-semibold text-ink">Your delivery code:</strong>{" "}
            the code for an order you placed, so the tracking page can show it
            to you.
          </li>
          <li>
            <strong className="font-semibold text-ink">Waitlist:</strong> a
            note that this browser already joined the launch or driver
            waitlist, so we greet you as already in. It doesn&apos;t hold your
            email.
          </li>
          <li>
            <strong className="font-semibold text-ink">Your cookie choice:</strong>{" "}
            whether you pressed OK or No ad tracking on the cookie notice, so
            we don&apos;t ask again.
          </li>
          <li>
            <strong className="font-semibold text-ink">Small preferences:</strong>{" "}
            things like a banner you dismissed, so we don&apos;t show it
            again.
          </li>
        </ul>
        <p>
          All of it stays on your device until you sign out, clear it, or it
          expires. None of it is used to profile you or follow you around the
          web.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="Third parties">
        <p>
          Six outside services touch your browser, each for one job:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Stripe:</strong> our
            payment processor. During checkout, Stripe may set cookies of its
            own for fraud prevention. That&apos;s standard for card payments and
            it&apos;s covered by Stripe&apos;s privacy policy.
          </li>
          <li>
            <strong className="font-semibold text-ink">Google:</strong> powers
            the address search and sign-in-with-Google. Google&apos;s services
            only load when you use those features.
          </li>
          <li>
            <strong className="font-semibold text-ink">Supabase:</strong> hosts
            our database and authentication; your session token comes from
            here.
          </li>
          <li>
            <strong className="font-semibold text-ink">CARTO:</strong> supplies
            the map images, like the Edmonton map on the home page. Your
            browser downloads them straight from CARTO, so CARTO receives your
            IP address with each request.
          </li>
          <li>
            <strong className="font-semibold text-ink">Aladhan:</strong> works
            out the prayer times shown on ordering pages. Your browser sends it
            the map coordinates of your delivery address, and your IP address
            comes with the request.
          </li>
          <li>
            <strong className="font-semibold text-ink">Meta:</strong> the Meta
            pixel loads on every page and sets Meta&apos;s own cookies, unless
            you choose No ad tracking. It tells us which of our ads led to a
            page view or a waitlist signup. It never receives your email, your
            name, or anything you type.
          </li>
        </ul>
        <p>
          The Meta pixel is the only advertising or analytics tool on the site.
        </p>
      </LegalSection>

      <LegalSection id="choice" title="Your choice">
        <p>
          The Meta pixel runs unless you turn it off. The cookie notice at the
          bottom of the page gives you two buttons:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">OK:</strong> the pixel
            keeps running as described above.
          </li>
          <li>
            <strong className="font-semibold text-ink">No ad tracking:</strong>{" "}
            the pixel stops reporting page views and signups to Meta from this
            browser, and we delete the Meta cookies it already set. Everything
            else on the site works the same.
          </li>
        </ul>
        <p>
          Your answer is saved in this browser only. Another browser or device,
          or clearing your site data, brings the notice back. To change your
          answer, use{" "}
          <CookieChoicesButton className={linkClass}>
            Cookie choices
          </CookieChoicesButton>{" "}
          here or in the site footer.
        </p>
        <p>
          Any tracker blocker, or Meta&apos;s own{" "}
          <a
            href="https://www.facebook.com/help/568137493302217"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            ad settings
          </a>
          , also stops the pixel. Nothing on the site breaks when it is
          blocked.
        </p>
      </LegalSection>

      <LegalSection id="control" title="Clearing it">
        <p>
          You can clear everything Taeam stores through your browser&apos;s
          site-data settings (usually under Privacy → Site data → taeam.ca).
          Signing out removes your session; clearing site data removes the
          rest, including your cookie choice. The site keeps working either
          way. You&apos;ll just need to sign in, set your address and answer
          the cookie notice again.
        </p>
      </LegalSection>

      <LegalSection id="more" title="Questions">
        <p>
          How we handle the data behind the account itself is in the{" "}
          <Link href="/privacy-policy" className={linkClass}>
            Privacy Policy
          </Link>
          . Anything else: <LegalMail />.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
