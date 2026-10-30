import type { Metadata } from "next";
import Link from "next/link";
import { LegalMail, LegalSection, LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Taeam handles your information.",
  robots: { index: true, follow: true },
};

const linkClass =
  "font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 hover:decoration-gold-deep";

/**
 * Kept in step with the app's privacy policy, which is the governing text.
 *
 * Legal exposure audit 2026-09-03, blocker 7. This page used to say "The one
 * advertising platform that sees anything is Meta", which was wrong in the
 * direction that matters: the app ships Google AdMob rewarded video and asks
 * for Apple's tracking permission, and Google receives the device advertising
 * identifier when an ad plays. It also named three processors out of sixteen,
 * never said the database sits in Ohio, and set the age floor at 13 while the
 * Terms set it at 18.
 *
 * 2026-10-12: Arbaab moved to Anthropic (Claude) with OpenAI as fallback and
 * Lite, Gemini removed, review grading on Anthropic, optional Brave web
 * search. Mirrors privacy policy version 2026-10.2 in the app.
 *
 * 2026-10-12 (later): Arbaab's order timeline, prayer times, halal facts,
 * "What Arbaab knows", App Check and confirm-before-cart. Mirrors privacy
 * policy version 2026-10.3 in the app.
 *
 * 2026-10-13: Taeam Feed (the "Fresh from the kitchen" dish videos). What you
 * watch and react to picks what you see and becomes name-free totals for
 * restaurants; watch records go after 90 days; copyright contact. Mirrors
 * privacy policy version 2026-10.4 in the app.
 *
 * The section ids are load-bearing: they are the anchors this page has always
 * published, so /privacy-policy#sharing and #cookies still resolve.
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      current="/privacy-policy"
      title="Privacy Policy"
      updated="October 13, 2026"
      intro={
        <>
          This is the plain-English version of how Taeam handles your info. We
          tried to keep it short and to say what actually happens, including
          the parts that are less flattering. The short version: we collect
          what we need to run your account and get your food to you, we
          don&apos;t sell your data, some of it is handled by companies outside
          Canada, the app shows ads if you choose to watch one, and you can
          email us any time at <LegalMail /> to see, fix, or delete what we
          have on you.
        </>
      }
    >
      <LegalSection id="what-we-collect" title="What we collect">
        <p>
          We collect the information we need to run your account and get your
          orders to you. That includes your name, phone number, email, and (if
          you sign in with Google or Apple) the basic profile info those
          sign-in providers share with us.
        </p>
        <p>
          When you place an order we keep a record of what you ordered, where
          it was delivered, and how you paid. If you let us use your location,
          we use it to show nearby restaurants and to track delivery. We
          don&apos;t track your location when the app is closed.
        </p>
        <p>
          If you send us a photo, we keep it. That happens in two places:
          evidence you attach to a support claim, and the picture of your
          delivery bag if you use Scan &amp; Earn.
        </p>
        <p>
          We also collect basic technical details: device type, OS version, app
          version, crash reports, and your IP address. Your IP address is used
          to name the city in a &quot;new sign-in&quot; email so you can spot
          an account takeover. Your phone also carries an advertising
          identifier, and the{" "}
          <Link href="/privacy-policy#ads" className={linkClass}>
            Ads and tracking
          </Link>{" "}
          section explains when that is used.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-it" title="What we do with it">
        <p>
          Your info is used to place and deliver orders, send order updates by
          push, SMS or email, run customer support, prevent fraud, and improve
          the app. If you opt in, we may also send you promos and reward
          updates. You can turn those off at any time in Notification Settings
          without losing the rest of the account.
        </p>
        <p>
          A few things are done by automated systems rather than by a person.
          Review text is scored by Anthropic&apos;s AI for sentiment, so we can
          spot a restaurant going downhill, and the same check rates whether a
          written review is detailed enough to earn the extra review points. A
          support claim with a photo is analysed by OpenAI&apos;s AI before a
          human looks at it. Apart from those review points, neither one
          decides anything on its own: a refund, a suspension or an account
          closure is always a decision a person makes.
        </p>
        <p>
          We use what you watch and react to in the feed to choose what you
          see and to give restaurants totals that never name you.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Who we share it with">
        <p>
          Restaurants get your name, the order itself, and any delivery or
          allergy instructions you wrote, so they can prepare your food. They
          do not get your address, your phone number, or your orders from
          anywhere else.
        </p>
        <p>
          Drivers get the delivery address, your name, and a way to reach you
          while they are delivering. Voice calls happen inside the app, so a
          driver does not get your account phone number. The one exception is
          deliberate: if you entered a separate number for whoever is receiving
          the order, the driver is shown that number at the door, because they
          may need to call it to hand the food over.
        </p>
        <p>
          Beyond that, your information goes only to the companies listed in{" "}
          <Link href="/privacy-policy#processors" className={linkClass}>
            the next section
          </Link>
          , which handle it on our behalf and under contract.
        </p>
        <p>
          We do not sell your personal information, and we do not hand it to
          data brokers. We do show ads, and the{" "}
          <Link href="/privacy-policy#ads" className={linkClass}>
            Ads and tracking
          </Link>{" "}
          section says exactly what each ad platform receives.
        </p>
      </LegalSection>

      <LegalSection
        id="processors"
        title="The companies that handle data for us"
      >
        <p>
          These are the service providers Taeam actually uses today, what each
          one receives, and why. If we add one that receives personal
          information, this list changes with it.
        </p>
        <ul className="ms-5 list-disc space-y-1.5">
          <li>
            <strong>Supabase</strong> (United States): the database and sign-in
            system. Holds your account, your addresses and your order history.
          </li>
          <li>
            <strong>Railway</strong> (United States): runs our servers.
          </li>
          <li>
            <strong>Cloudflare</strong>: serves this website and filters
            malicious traffic.
          </li>
          <li>
            <strong>Stripe</strong>: takes payments. Stripe sees your card
            details; we never receive or store your full card number.
          </li>
          <li>
            <strong>Google Firebase</strong>: delivers push notifications,
            collects crash and usage analytics, and checks that Arbaab requests
            come from the genuine Taeam app (App Check, see the Arbaab section).
          </li>
          <li>
            <strong>Google Maps and Places</strong>: address search, map
            display and delivery routing.
          </li>
          <li>
            <strong>CARTO</strong>: the map images on this website. Your
            browser downloads them straight from CARTO, so CARTO receives your
            IP address.
          </li>
          <li>
            <strong>Aladhan</strong>: calculates the prayer times we show.
            Receives the location the times are for.
          </li>
          <li>
            <strong>Google AdMob</strong> (United States): the rewarded video
            ads in Watch &amp; Earn.
          </li>
          <li>
            <strong>Google Sign-In and Apple Sign in</strong>: only if you use
            them to sign in.
          </li>
          <li>
            <strong>Anthropic</strong> (United States): the AI that normally
            answers Arbaab. Receives your Arbaab messages and the context
            described in the{" "}
            <Link href="/privacy-policy#arbaab" className={linkClass}>
              Arbaab
            </Link>{" "}
            section. It also reads the text of reviews you write, including a
            review you give by chatting with Arbaab, to score them. Taeam&apos;s
            management also uses it for an internal operations assistant that
            can look up order records.
          </li>
          <li>
            <strong>OpenAI</strong> (United States): answers Arbaab when
            Anthropic is unavailable and in Arbaab&apos;s Lite mode, and then
            receives the same things Anthropic would. It also processes your
            support live chat messages with the details of your own recent
            orders, the text of a support claim, and any photo or screenshot
            you send us for a support claim, for Scan &amp; Earn, or to claim
            the social share bonus.
          </li>
          <li>
            <strong>Brave Search</strong> (United States): only when Arbaab
            looks something up on the web for a general question. Receives the
            short search query and nothing that identifies you.
          </li>
          <li>
            <strong>Twilio</strong> (United States): sends our SMS, and bridges
            a restaurant&apos;s phone to your app when a restaurant calls you
            about an order.
          </li>
          <li>
            <strong>Agora</strong> (United States): carries the in-app voice
            calls between you and your driver.
          </li>
          <li>
            <strong>Resend</strong> (United States): sends our email.
          </li>
          <li>
            <strong>Upstash</strong> (United States): a short-lived cache
            holding session and role data.
          </li>
          <li>
            <strong>Meta</strong>: the pixel on this website. See{" "}
            <Link href="/privacy-policy#ads" className={linkClass}>
              Ads and tracking
            </Link>
            .
          </li>
          <li>
            <strong>ipwho.is</strong>: receives your IP address so a &quot;new
            sign-in&quot; email can name the city.
          </li>
          <li>
            <strong>Open-Meteo</strong>: receives an approximate location for
            the weather shown on the app&apos;s home screen.
          </li>
        </ul>
        <p>
          Each of these is allowed to use your information only to do the job
          we hired them for.
        </p>
      </LegalSection>

      <LegalSection id="where-stored" title="Where your data is stored">
        <p>
          Taeam is an Alberta company, but our database and most of the
          services above run on servers in the United States. Our main database
          is hosted in Ohio.
        </p>
        <p>
          This includes the AI services above. When you use Arbaab, your
          messages and the context described in the Arbaab section are
          processed by Anthropic or OpenAI in the United States, and a web
          search query by Brave in the United States. Review text is processed
          by Anthropic in the United States.
        </p>
        <p>
          That means your personal information is stored and processed outside
          Canada. While it is there it is subject to the laws of that country,
          and United States courts, law enforcement and government agencies can
          apply to get access to it under United States law. We tell you this
          because Canadian privacy law, PIPEDA and Alberta&apos;s PIPA, expects
          us to, not because we expect it to happen.
        </p>
        <p>
          Our obligations to you under Canadian and Alberta privacy law do not
          change because a server sits somewhere else. If you would rather not
          have your information stored this way, the honest answer is that you
          should not use Taeam, because there is currently no version of the
          service that avoids it.
        </p>
      </LegalSection>

      <LegalSection id="ads" title="Ads and tracking">
        <p>
          <strong>In the app.</strong> Ads appear in one place: the Watch &amp;
          Earn card in Rewards, where you can choose to watch a short video to
          earn points. Nothing plays unless you tap it. Those ads come from
          Google AdMob, and when you watch one Google receives your
          device&apos;s advertising identifier, your approximate location and
          general device information. Google uses that to choose the ad, to
          check it really played, and, depending on your device settings, to
          personalise ads across other apps. That is third-party advertising,
          and an earlier version of this policy wrongly said Meta was the only
          ad platform involved.
        </p>
        <p>
          You control that identifier. On iOS we show Apple&apos;s tracking
          prompt when you first open the app, and if you decline it is not
          shared; you can change your mind under Settings, Privacy &amp;
          Security, Tracking. On Android you can reset or delete the
          advertising ID under Settings, Privacy, Ads. Declining costs you
          nothing: Watch &amp; Earn still pays the same points.
        </p>
        <p>
          <strong>On this website.</strong> We run the Meta pixel, which
          reports page views and waitlist signups back to Meta so we can
          measure our ads. It never sends your email or anything you type. You
          can turn it off with No ad tracking in the cookie notice, or later
          under Cookie choices in the site footer, and any tracker blocker
          stops it too. The full list of what this site stores in your
          browser is on the{" "}
          <Link href="/cookies" className={linkClass}>
            Cookies &amp; Storage
          </Link>{" "}
          page.
        </p>
        <p>
          Separately from ads, we use Firebase Analytics to count things like
          which screens are slow and how often the app crashes, and the app
          stores small amounts of data on your device to remember that you are
          signed in and to remember your preferences such as theme, language
          and default address.
        </p>
      </LegalSection>

      <LegalSection id="security" title="How we keep it safe">
        <p>
          All traffic between the app and our servers is encrypted with TLS.
          Passwords aren&apos;t stored by us, because sign-in is handled by
          Supabase. Payment cards aren&apos;t stored either, because Stripe
          holds those. Access to the database is restricted row by row, so one
          customer&apos;s account cannot read another&apos;s. Inside the
          company, only the people who need access to do their job have it.
        </p>
        <p>
          Nothing online is bulletproof. If your data is involved in a breach
          that could cause you real harm, we will tell you and we will report
          it, which is what Canadian law requires of us.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="How long we keep it">
        <p>
          While your account is open we keep your account details and your
          order history, because you can see your past orders in the app.
        </p>
        <p>Some things are deleted on a fixed schedule, whether or not you ask:</p>
        <ul className="ms-5 list-disc space-y-1.5">
          <li>
            Delivery photos, meaning the picture a driver takes at your door,
            are deleted 30 days after the delivery.
          </li>
          <li>A driver&apos;s recorded location trail is deleted after 90 days.</li>
          <li>
            The record of which feed posts you watched is deleted after 90
            days.
          </li>
          <li>Support tickets are archived once they are resolved.</li>
        </ul>
        <p>
          If you close your account, we remove your personal details and
          disconnect your orders from you. We keep the anonymised order and
          payment records, because tax and accounting law requires a business
          to be able to show what it sold. Those records no longer identify
          you.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="Your rights">
        <p>
          Under Canadian privacy law (PIPEDA) and Alberta&apos;s PIPA, you can
          ask us for a copy of the info we have on you, ask us to correct
          anything that&apos;s wrong, or ask us to delete your account. You can
          also opt out of marketing messages without losing the account, and
          you can withdraw a consent you previously gave.
        </p>
        <p>
          To do any of these, email <LegalMail /> from the address on your
          account, or{" "}
          <Link href="/delete-account" className={linkClass}>
            delete your account here
          </Link>
          . We&apos;ll get back to you within 30 days.
        </p>
        <p>
          If you are not happy with how we handled it, you can complain to the
          Office of the Privacy Commissioner of Canada or to the Office of the
          Information and Privacy Commissioner of Alberta. You do not need our
          permission to do that.
        </p>
      </LegalSection>

      <LegalSection id="arbaab" title="Arbaab (the in-app AI assistant)">
        <p>
          Arbaab is an optional AI helper that can search restaurants, build a
          cart, and pull up your past orders so you can reorder faster.
          It&apos;s off by default until you turn it on.
        </p>
        <p>
          Arbaab normally runs on Claude, an AI made by Anthropic. If Anthropic
          is unavailable, or Arbaab is in its Lite mode (for example when you
          are not signed in, or after the day&apos;s full-power messages are
          used up), OpenAI answers instead. Both companies are in the United
          States, so your chat is processed outside Canada (see{" "}
          <Link href="/privacy-policy#where-stored" className={linkClass}>
            Where your data is stored
          </Link>
          ). We no longer use Google Gemini.
        </p>
        <p>With each message, the AI provider receives:</p>
        <ul className="ms-5 list-disc space-y-1.5">
          <li>your message and the last few messages of the conversation</li>
          <li>
            the restaurant data it needs to answer: which restaurants are open,
            their menus, hours and anything out of stock
          </li>
          <li>what is in your cart</li>
          <li>
            a short summary of your orders: your most recent order (restaurant,
            items, total and status) and how many orders you have placed, and,
            read from our own records, any order in progress (its status, the
            driver&apos;s first name and an estimated arrival time, never the
            driver&apos;s phone number or location) and the order, support and
            refund updates we sent you in the last 24 hours
          </li>
          <li>
            your favourite restaurants, your rewards status, and the labels on
            your saved addresses, like Home or Work, but not the street lines
          </li>
          <li>
            short notes Arbaab has saved about your food preferences, such as
            &quot;likes it spicy&quot;, if there are any. You can see, edit or
            erase each one under &quot;What Arbaab knows&quot; in Arbaab&apos;s
            settings. Arbaab never keeps payment details, PINs or passwords,
            phone numbers, emails, street addresses or health information;
            dietary needs and allergies are kept so it can respect them.
          </li>
          <li>
            the halal details Taeam holds for those restaurants, and whether
            Taeam has verified them
          </li>
          <li>
            today&apos;s prayer times and Islamic date, which we work out from
            the location you saved for prayer alerts, or from Edmonton if you
            have not (the location itself is not sent)
          </li>
        </ul>
        <p>
          We don&apos;t send your name, phone number, email, street address or
          payment details. Whatever you type into the chat is sent as you
          wrote it, so please don&apos;t type those in yourself.
        </p>
        <p>
          While answering one message, Arbaab may look up more of the same
          information in our database, such as a restaurant&apos;s full menu or
          your recent orders.
        </p>
        <p>
          For a general question that has nothing to do with ordering, such as
          where a dish comes from, Arbaab may run one web search through Brave
          Search. Brave receives only the short search query, which can
          include words from your message. The search is sent from our server,
          so Brave does not receive your name, your account or your IP
          address. Arbaab never searches the web for menus, prices, hours or
          halal status; those come only from Taeam.
        </p>
        <p>
          Under the business terms we use with them, Anthropic and OpenAI do
          not use what we send to train their models, and we have not opted in
          to that. Each keeps it for a limited time for safety and abuse
          monitoring, generally up to 30 days, and longer if their systems flag
          it for a safety review or the law requires it. That is their practice
          and not something we control. Brave keeps search queries for up to
          90 days for billing and troubleshooting.
        </p>
        <p>
          We keep our own log of each Arbaab exchange: the first part of what
          you typed and of Arbaab&apos;s reply, with email addresses and phone
          numbers masked, any action it took inside the app (such as adding
          items to a cart), and whether it ran a web search. We use it to look
          into problems you report, for security, and to keep Arbaab&apos;s
          costs in check. It is deleted when you delete your account.
        </p>
        <p>
          We also keep a record of the order, support, refund and account
          updates we send you, for 30 days, so Arbaab can answer questions like
          &quot;where is my food?&quot;. It is deleted when you delete your
          account.
        </p>
        <p>
          To stop fake apps and scripts from using Arbaab, each Arbaab request
          carries a check from Firebase App Check (Google Play Integrity on
          Android, Apple App Attest on iOS) that it comes from the genuine Taeam
          app. That check does not include your messages.
        </p>
        <p>
          Arbaab never places or pays for an order on its own. It can suggest a
          cart, but nothing goes into your cart until you tap Add to cart, and
          checkout always needs your tap. You can turn it off any time in Settings, and the
          rest of the app works exactly the same.
        </p>
      </LegalSection>

      <LegalSection id="kids" title="Age">
        <p>
          You have to be 18 to hold a Taeam account, which is also what our{" "}
          <Link href="/terms" className={linkClass}>
            Terms of Service
          </Link>{" "}
          say. We don&apos;t knowingly collect information from anyone under
          18. If you think someone under 18 has given us their information,
          email <LegalMail /> and we&apos;ll delete it.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          If we change something meaningful in here, we&apos;ll update the date
          at the top and let you know in the app before the change takes
          effect. We keep a copy of every version we have published, along with
          the exact text you agreed to when you signed up, so it is always
          possible to say what the rules were on a given day.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Privacy questions, data requests, or anything else: <LegalMail />.
        </p>
        <p>
          If you think a post on Taeam, including a Taeam Feed video or photo,
          uses your work without permission, email <LegalMail /> with a link
          to it and why it&apos;s yours. We pass copyright notices on to the
          poster as Canada&apos;s Copyright Act requires, and we take down
          clear infringement.
        </p>
        <p>
          Taeam Technologies Inc.
          <br />
          Edmonton, Alberta, Canada
        </p>
      </LegalSection>
    </LegalShell>
  );
}
