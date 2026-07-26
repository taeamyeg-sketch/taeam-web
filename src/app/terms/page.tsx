import type { Metadata } from "next";
import Link from "next/link";
import { LegalMail, LegalSection, LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The agreement between you and Taeam when you order through the platform.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalShell
      current="/terms"
      title="Terms of Service"
      updated="July 2026"
      intro={
        <>
          These are the rules of using Taeam, written to be read. When you create
          an account or place an order on taeam.ca or in the Taeam app, you&apos;re
          agreeing to everything on this page. If anything here doesn&apos;t sit
          right with you, email us before you order. We answer.
        </>
      }
    >
      <LegalSection id="who-we-are" title="1. Who you're dealing with">
        <p>
          Taeam is operated by Taeam Technologies Inc., an Alberta company based in Edmonton,
          Canada. We run a marketplace: independent restaurants prepare your
          food, independent drivers deliver it, and Taeam is the platform that
          connects the three of you and handles the payment.
        </p>
        <p>
          &quot;Taeam&quot;, &quot;we&quot; and &quot;us&quot; in this document
          mean Taeam Technologies Inc. &quot;The platform&quot; means taeam.ca, the Taeam
          app, and the Tawsil driver app.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="2. Your account">
        <p>
          You need to be the age of majority in your province (18 in Alberta) to
          hold an account and place orders. You&apos;re responsible for what
          happens on your account, so keep your sign-in details to yourself and
          tell us right away if you think someone else has access.
        </p>
        <p>
          The details on your account (name, phone number, delivery address)
          need to be accurate, because restaurants and drivers rely on them to
          get food to the right person at the right door.
        </p>
      </LegalSection>

      <LegalSection id="ordering" title="3. Ordering and prices">
        <p>
          Menus, prices and availability are set by each restaurant and can
          change without notice. Prices on Taeam may differ from what the same
          restaurant charges in-store.
        </p>
        <p>
          Every fee (delivery, service, and any small-order fee) is shown at
          checkout before you pay. There are no fees that appear after the
          fact. Applicable taxes (GST) are added at checkout as required by
          law.
        </p>
        <p>
          When you place an order, you&apos;re making an offer to buy. The order
          is confirmed once the restaurant accepts it, and that&apos;s when
          preparation starts.
        </p>
      </LegalSection>

      <LegalSection id="payment" title="4. Payment">
        <p>
          Payments are processed by Stripe. We never see or store your full card
          number. By placing an order you authorize us to charge your selected
          payment method for the order total shown at checkout.
        </p>
        <p>
          Tips are optional and go to your driver. 100% of them, always. Taeam
          takes no cut of tips.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="5. Cancellations and refunds">
        <p>
          You can cancel an order free of charge any time before the restaurant
          accepts it. Once the kitchen starts preparing your food, a
          cancellation may be partially refunded or not refunded, because the
          restaurant has already committed ingredients and labour.
        </p>
        <p>
          If your order arrives wrong, incomplete, or in a state you
          wouldn&apos;t accept in the restaurant, contact support through the
          app or at <LegalMail /> within 48 hours. We&apos;ll look at what
          happened and, where it&apos;s warranted, refund the affected items or
          the full order. Refunds go back to the original payment method and
          never exceed what was actually charged.
        </p>
        <p>
          Points earned on a refunded order are removed along with the refund.
          Repeated refund claims that don&apos;t hold up may lead to claims on
          that account being reviewed manually.
        </p>
      </LegalSection>

      <LegalSection id="delivery" title="6. Delivery and pickup">
        <p>
          Delivery times shown are estimates, not guarantees. Kitchens get
          busy and roads get snowy, especially here. We&apos;ll always show you
          live status so you&apos;re never guessing.
        </p>
        <p>
          Getting the address right is on you; getting to that address is on
          us. If the driver can&apos;t reach you or the drop-off details
          don&apos;t work, we&apos;ll try to contact you before the order is
          marked undeliverable, and undeliverable orders may not be refunded.
        </p>
        <p>
          For pickup orders, food is ready at the time shown and should be
          collected promptly. The restaurant can&apos;t be responsible for food
          that sits. For all orders, once the food is handed over, storage and
          food safety are in your hands.
        </p>
      </LegalSection>

      <LegalSection id="halal" title="7. The halal standard">
        <p>
          Every restaurant on Taeam goes through halal verification before it
          can open on the platform: we review sourcing and certification
          documents and record how each protein is slaughtered. What we learn is
          disclosed on the restaurant&apos;s page (hand or machine, stunned or
          non-stunned) so you can decide by your own standard.
        </p>
        <p>
          That disclosure is based on the documents and declarations restaurants
          provide plus our own review. Standards among Muslims differ, and we
          don&apos;t rule on which standard is correct. We disclose, you
          decide. If a restaurant misrepresents its sourcing to us, that&apos;s a
          breach of their agreement with Taeam: report it to <LegalMail /> and
          we will investigate, and delist where warranted.
        </p>
      </LegalSection>

      <LegalSection id="allergens" title="8. Allergens and dietary needs">
        <p>
          Ingredient and allergen information comes from each restaurant. If you
          have a serious allergy, use the order notes and confirm directly with
          the restaurant before ordering. Cross-contamination in independent
          kitchens is outside anyone&apos;s control but theirs.
        </p>
      </LegalSection>

      <LegalSection id="points" title="9. Points, promos and Taeam Plus">
        <p>
          Taeam Points land automatically on eligible orders; 1,000 points takes
          a dollar off. Points have no cash value, can&apos;t be transferred or
          sold, and can be adjusted or removed where they were earned through
          refunded orders or abuse of the program.
        </p>
        <p>
          Promo codes have their own conditions (minimum order, first order
          only, expiry) shown where the code is offered, and each code is one
          per account unless it says otherwise.
        </p>
        <p>
          Taeam Plus is a paid membership billed on a recurring basis. You can
          cancel any time from your account; the membership stays active until
          the end of the period you&apos;ve already paid for, and no partial
          refunds are given for unused days.
        </p>
      </LegalSection>

      <LegalSection id="arbaab" title="10. Arbaab">
        <p>
          Arbaab is Taeam&apos;s optional AI assistant. It can search, suggest
          and build a cart, but it never places or pays for an order on its
          own. Checkout always needs your confirmation. Like any AI, it can be
          wrong; treat its answers about menus, prices, and especially allergens
          as a starting point, and rely on the restaurant&apos;s own listing for
          the final word.
        </p>
      </LegalSection>

      <LegalSection id="fair-use" title="11. Fair use">
        <p>
          Use the platform like a person, not a scheme. That means no fraudulent
          orders or chargebacks, no abuse or harassment of drivers, restaurant
          staff or support, no fake accounts to re-use promos, and no scraping,
          reverse-engineering or interfering with the platform&apos;s operation.
        </p>
        <p>
          Drivers and restaurant staff are someone&apos;s family doing honest
          work. Accounts that mistreat them don&apos;t stay on Taeam.
        </p>
      </LegalSection>

      <LegalSection id="reviews" title="12. Reviews and content">
        <p>
          Reviews and photos you post stay yours, and you give us permission to
          display them on the platform. Keep them honest and about the food and
          the experience. We remove content that&apos;s abusive, off-topic,
          fake, or posted in exchange for payment.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="13. What we're responsible for">
        <p>
          We run the platform with care, but it&apos;s provided &quot;as
          is&quot;. We can&apos;t promise it will never go down or that every
          restaurant listing is free of errors. Food preparation is the
          restaurant&apos;s responsibility; delivery conduct is the
          driver&apos;s; the platform, payment and the verification process are
          ours.
        </p>
        <p>
          To the extent the law allows, Taeam&apos;s total liability for any
          claim connected to an order is limited to the amount you paid for that
          order. Nothing in these terms limits rights that consumer protection
          law says can&apos;t be limited. In Alberta, that includes your rights
          under the Consumer Protection Act.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="14. Closing an account">
        <p>
          You can close your account any time:{" "}
          <Link href="/delete-account" className="font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 hover:decoration-gold-deep">
            delete your account here
          </Link>{" "}
          or from the app, and we&apos;ll remove your data as described in the{" "}
          <Link href="/privacy-policy" className="font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 hover:decoration-gold-deep">
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          We can suspend or close accounts that break these terms (fraud,
          abuse, or misuse of the platform) with notice where the situation
          allows it. Sections that by their nature should survive (payments
          owed, liability, governing law) survive the account.
        </p>
      </LegalSection>

      <LegalSection id="law" title="15. Governing law">
        <p>
          These terms are governed by the laws of Alberta and the federal laws
          of Canada that apply there. Any dispute that we can&apos;t solve
          together goes to the courts of Alberta.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="16. Changes to these terms">
        <p>
          If we change something meaningful in here, we&apos;ll update the date
          at the top and let you know in the app before the change takes
          effect. Continuing to use Taeam after that means you accept the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="17. Contact">
        <p>
          Questions about these terms, an order, or anything else: <LegalMail />.
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
