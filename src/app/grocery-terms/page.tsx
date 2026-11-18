import type { Metadata } from "next";
import Link from "next/link";
import { LegalMail, LegalSection, LegalShell } from "@/components/legal/LegalShell";

/**
 * Taeam Grocery Terms, the text customers accept before their first grocery
 * order (GROCERY_PLAN.md section 9, item 1).
 *
 * THE VERSION IS THE EVIDENCE. The app's grocery terms gate records only the
 * version string a customer accepted (grocery_terms_acceptances.version, checked
 * against grocery_settings.terms_version by routes/api/grocery.js). So
 * "version 2026-11" must always mean exactly the text below. Any change to the
 * wording, however small, needs:
 *   1. a new TERMS_VERSION here (2026-12, or 2026-11.2 for a second change in
 *      the same month, the same scheme as the other legal registries);
 *   2. the old text kept in git history (never rewrite a published version);
 *   3. grocery_settings.terms_version set to the new string in the admin app
 *      (Grocery, Settings, Terms) on the day this page is deployed, so every
 *      customer is asked to accept again before their next grocery order.
 * Changing the text without the version leaves acceptances pointing at words
 * nobody accepted.
 *
 * Copy rules (plan section 3): no em or en dashes, no store names, no
 * competitor names, no "cheaper than", no crossed-out or "was" prices.
 */
const TERMS_VERSION = "2026-11";
const EFFECTIVE = "November 17, 2026";

export const metadata: Metadata = {
  title: "Taeam Grocery Terms",
  description:
    "The terms for Taeam Grocery orders: Taeam buys for you as your agent, the card hold, swaps, delivery, refunds and what the halal labels mean.",
  robots: { index: true, follow: true },
};

const linkClass =
  "font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 hover:decoration-gold-deep";

export default function GroceryTermsPage() {
  return (
    <LegalShell
      current="/grocery-terms"
      title="Taeam Grocery Terms"
      updated={`${EFFECTIVE} (version ${TERMS_VERSION})`}
      intro={
        <>
          Version {TERMS_VERSION}, effective {EFFECTIVE}. These terms apply to
          every Taeam Grocery order, where a Taeam shopper buys groceries for
          you at a nearby store and brings them to your door. You accept them
          in the app before your first grocery order. They add to our{" "}
          <Link href="/terms" className={linkClass}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className={linkClass}>
            Privacy Policy
          </Link>
          . The short version: we buy for you at the store&apos;s price, you pay
          one fee shown before you order, your item is only ever swapped for a
          backup we have verified, and the label on the product is what counts.
        </>
      }
    >
      <LegalSection id="scope" title="1. What these terms cover">
        <p>
          Taeam Grocery is run by Taeam Technologies Inc., an Alberta company
          based in Edmonton (&quot;Taeam&quot;, &quot;we&quot;, &quot;us&quot;).
          These terms cover grocery orders that a Taeam shopper buys for you
          at a store (a &quot;grocery order&quot;). Where these terms and the
          Terms of Service say different things about a grocery order, these
          terms apply to that order.
        </p>
        <p>
          They do not cover grocers, butchers and supermarkets that sell to you
          directly on Taeam as partners. Those appear in their own rows, the
          partner is the seller, and their orders work like restaurant orders
          under the Terms of Service.
        </p>
        <p>
          You must be 18 or older to place a grocery order. We record which
          version of these terms you accepted and when. If we change them, the
          version number changes and we ask you to accept the new version
          before your next grocery order.
        </p>
      </LegalSection>

      <LegalSection id="agency" title="2. We buy for you, as your agent">
        <p>
          When you place a grocery order, you appoint Taeam as your agent to
          buy the items in your order on your behalf, from a store we choose,
          and to deliver them to you. The store sells the goods to you through
          us. Taeam does not buy groceries to resell them to you.
        </p>
        <p>
          <strong>
            You pay the store&apos;s shelf price, sales included, plus one fee
            shown before you order.
          </strong>{" "}
          The goods part of your charge is the store&apos;s charge for your
          order, never more. We do not mark up, round up, or charge you an
          estimate for goods.
        </p>
        <p>
          The prices you see before you order are estimates from our own recent
          price checks. What you are charged for the goods is what the store
          actually charges at the till, which can be higher or lower than the
          estimate, always within the card hold in section 5.
        </p>
        <p>
          We choose the store from the stores near you that carry every item in
          your order, and each order is shopped at one store. Until a store is
          assigned you see &quot;Shopped at a nearby store&quot;. After that,
          the store&apos;s name appears in your order details, tracking and
          receipt.
        </p>
        <p>
          <strong>Taeam is not affiliated with the stores it shops at.</strong>{" "}
          We name a store only to tell you where your order was bought. The
          stores do not endorse Taeam and are not responsible for our service.
          We do not give the store your name or contact details. The only
          exception is a loyalty card number you choose to save (section 13).
        </p>
        <p>
          <strong>Our business card and its rewards.</strong> Your shopper
          pays the store with a Taeam business card. Any cashback or rewards
          that card earns belong to Taeam, and by placing a grocery order you
          agree that Taeam keeps them. They never change what you are charged
          for the goods, which is always the store&apos;s charge.
        </p>
        <p>
          The goods become yours when the store sells them. Taeam is
          responsible for them until they are handed to you or left at your
          door under section 8.
        </p>
        <p>
          Taeam Grocery is for your own personal and household use, not for
          buying goods to resell. A store&apos;s own purchase limits apply to
          your order.
        </p>
      </LegalSection>

      <LegalSection id="shopper" title="3. Who shops for you">
        <p>
          Every grocery order is shopped by a real person, shown in the app by
          their real first name and, if they have chosen to add one, a photo.
          The person you see is the person who shops your order. If a different
          shopper takes over your order, the app shows you the change.
        </p>
        <p>
          Shoppers are independent contractors engaged by Taeam through the
          Tawsil app. Calls between you and your shopper go through the Taeam
          app, so neither of you sees the other&apos;s phone number.
        </p>
      </LegalSection>

      <LegalSection id="ordering" title="4. Ordering and delivery windows">
        <p>
          The minimum grocery order is $35.00 of estimated groceries. We deliver
          within the area shown in the app, up to 10 km from the store.
        </p>
        <p>
          <strong>Order now</strong> is offered only while a shopper shows as
          Available now. Your order goes straight to that shopper. If the
          shopper does not accept it within 5 minutes, the order is cancelled,
          the card hold is released, and you can book a window instead.
        </p>
        <p>
          <strong>Booking a window.</strong> Otherwise you book a 2 hour delivery
          window from the hours our shoppers have posted, up to 4 days ahead.
          Booking for a window closes 2 hours before it starts. The number of
          spots shown for a window is the real number left.
        </p>
        <p>
          If your shopper can no longer take a booked order, we give it to
          another shopper or contact you to rebook or cancel it free. Delivery
          times are estimates, not guarantees.
        </p>
      </LegalSection>

      <LegalSection id="hold" title="5. The card hold and when you are charged">
        <p>
          At checkout we place a temporary hold on your card. A hold is not a
          charge. Before you order, the app shows you this, with the amount
          filled in:
        </p>
        <p className="border-l-2 border-gold pl-4 font-semibold text-ink">
          &quot;A temporary hold of up to $X will appear on your card. You are
          charged only for what we buy.&quot;
        </p>
        <p>
          The hold covers your estimated groceries plus a margin of 10% for
          price differences (never more than $30), estimated GST on taxable
          items, an estimated bag charge, the Taeam fee and its GST, and your
          tip.
        </p>
        <p>
          You are charged once, when your order is delivered. The charge is the
          store&apos;s charge for your order, confirmed from the store receipt,
          less any items you refused at the door and any swap credit, plus the
          Taeam fee, GST on the fee, and your tip. You are never charged more
          than the hold. The rest of the hold is released; how quickly it
          disappears from your statement is up to your bank, usually a few
          business days.
        </p>
        <p>
          If our team is still checking the store receipt when your order is
          delivered, the charge waits until the check is done, and is made no
          later than 5 days after your order. If our card statement later shows
          the store charged less than we charged you for the goods, we refund
          the difference automatically.
        </p>
      </LegalSection>

      <LegalSection id="price" title="6. The Taeam fee and the launch price">
        <p>
          You pay one Taeam service fee per grocery order, shown before you
          order, plus GST on the fee.{" "}
          <strong>
            The launch price is $5.99 plus 12% of your groceries, plus GST.
          </strong>{" "}
          For example, $35 of groceries pays a fee of $10.19, $60 pays $13.19,
          and $100 pays $17.99, each plus GST.
        </p>
        <p>
          &quot;Groceries&quot; means the item total you are charged: the
          store&apos;s item prices before tax, deposits and bags, less items
          refused at the door and less swap credits. The fee is worked out on
          the real total when your order is delivered, so if an item is out of
          stock, your fee goes down with it.
        </p>
        <p>
          <strong>How the launch price ends.</strong> The launch price is
          temporary. It ends no later than six months after the first Taeam
          Grocery order, and it may end sooner. Either way, we tell you in the
          app and by email at least 14 days before it ends, and that notice
          shows the price that applies after it. The fee for an order is
          always worked out on the price shown when you place that order. The
          launch price is a price of its own, not a discount, and we will never
          show you a crossed-out fee or a &quot;was&quot; price.
        </p>
        <p>
          <strong>Taeam Plus and promo codes.</strong> Taeam Plus members get
          $1.00 off the Taeam fee on every grocery order. A promo code can
          discount the Taeam fee only, never the goods, because the goods are
          the store&apos;s price. Each order gets at most one fee discount; if
          more than one applies, you get the largest. Grocery orders do not
          earn or use Taeam Points.
        </p>
      </LegalSection>

      <LegalSection id="tips" title="7. Tips">
        <p>
          A tip is optional. You can pick 10%, 15% or 20% of your estimated
          groceries or enter your own amount. 100% of the tip goes to your
          shopper, and Taeam keeps none of it. The tip is part of the card hold
          and cannot be changed after checkout.
        </p>
      </LegalSection>

      <LegalSection id="delivery" title="8. Delivery, and if nobody answers">
        <p>
          Your shopper brings the order to the address you gave. Please make
          sure someone can take chilled and frozen items in promptly.
        </p>
        <p>
          <strong>If nobody answers:</strong> your shopper calls you through
          the app, waits 5 minutes, then leaves the order at your door and
          takes a photo. You are charged as normal. If you chose &quot;Hand it
          to me&quot;, you accepted this same fallback at checkout. Once the
          order is left at your door, it is your responsibility, including any
          chilled or frozen items.
        </p>
        <p>
          <strong>At the door</strong> you can refuse any item that is damaged
          or wrong before your shopper confirms delivery. A refused item comes
          off your charge, and you can keep it. There is no return trip.
        </p>
      </LegalSection>

      <LegalSection id="swaps" title="9. Swaps and out of stock items">
        <p>
          <strong>
            Your halal item is never swapped for a &quot;similar&quot; one. Only
            for a backup we have verified, or you get a refund.
          </strong>
        </p>
        <p>
          For each item you choose &quot;Swap with an approved backup&quot; or
          &quot;Refund it&quot;. A backup is a product Taeam has checked and
          approved in advance for that item, never something picked on the
          spot. Your shopper scans every item, and the scanner accepts only the
          product you ordered or its approved backup.
        </p>
        <ul className="ms-5 list-disc space-y-1.5">
          <li>If the backup costs less, you pay the lower price.</li>
          <li>
            If it costs up to $1.00 more, you pay the price of the item you
            ordered and Taeam pays the difference. Your receipt shows this as a
            &quot;Swap credit&quot;.
          </li>
          <li>
            If it costs more than $1.00 more, we ask you in the app. If you do
            not approve it within 5 minutes, the item is refunded.
          </li>
          <li>
            A swap is never offered if it would take your total above the card
            hold.
          </li>
        </ul>
        <p>
          If you chose &quot;Refund it&quot;, or no approved backup is on the
          shelf, the item is not bought and you are not charged for it.
        </p>
      </LegalSection>

      <LegalSection id="cancelling" title="10. Cancelling">
        <p>
          You can cancel a grocery order free in the app until your shopper
          starts shopping it. The card hold is released.
        </p>
        <p>
          Once shopping has started there is no cancel button, because your
          shopper is already buying for you. Contact support in the app. We
          stop the shop if we still can. If we cannot, you may be charged for
          the items already bought for you, with the fee and tip worked out as
          above, and nothing else.
        </p>
        <p>
          We may cancel an order, at no charge to you, if no shopper can take
          it, if payment at the till fails and cannot be fixed within 10
          minutes, or if it is unsafe to continue. Any items already at the till
          stay with the store.
        </p>
      </LegalSection>

      <LegalSection id="claims" title="11. Problems after delivery">
        <p>
          If an item is missing, wrong, damaged, spoiled or past its date,
          report it in the app <strong>within 24 hours of delivery</strong>,
          item by item, with a photo. If we approve the claim, we refund what
          you paid for that item, including its GST, to your card. Taeam pays
          that refund; your shopper does not.
        </p>
        <p>
          Approved claims count toward the same limit as restaurant orders:
          three approved claims in any 30 days. After that, a person reviews
          each new claim before anything is decided.
        </p>
        <p>
          If you find a problem after 24 hours, contact support anyway and we
          will look at it. Nothing in these terms limits the rights you have
          under consumer protection law, including Alberta&apos;s Consumer
          Protection Act.
        </p>
      </LegalSection>

      <LegalSection id="halal" title="12. What the halal labels mean">
        <p>
          Every product Taeam shows as halal carries one of two labels, and
          never a bare &quot;Halal&quot;:
        </p>
        <ul className="ms-5 list-disc space-y-1.5">
          <li>
            <strong>Certified.</strong> A halal certifying body has certified
            the product. We show that body&apos;s full legal name and
            &quot;Certificate valid until&quot; the date on the certificate. We
            check that the certificate covers the product, but the certification
            is the certifier&apos;s, not Taeam&apos;s.
          </li>
          <li>
            <strong>Assessed by Taeam.</strong> We show &quot;Halal status
            assessed by Taeam Technologies Inc.&quot;, the date we checked, and
            a link to our published standard. It means we read the
            product&apos;s ingredients and evidence (the label, certificates for
            its ingredients, and answers from the manufacturer) against that
            standard. It is Taeam&apos;s assessment. It is not a certificate
            from a certifying body and not a religious ruling.
          </li>
        </ul>
        <p>
          Some ingredients are judged differently by different scholars. Where
          a product has one, we show it with a visible flag, and you can filter
          flagged products out. We disclose, you decide. A product that fails
          our standard cannot be ordered. A product we have not checked yet
          shows no halal status at all, which does not mean it is not halal.
        </p>
        <p>
          We check again when a certificate expires or after 12 months for
          Certified products, and every 6 months for Assessed products. A
          product overdue for its check stops being orderable until it is
          checked. When a monthly label photo shows the ingredients have
          changed, or a product is recalled, we suspend it and check again.
        </p>
        <p>
          Every label is true as of the date shown. Manufacturers can change a
          recipe without telling anyone, so check the label before eating. If a
          product we showed as Certified or Assessed did not match what we
          showed on that date, tell us: we refund it and check it again.
        </p>
        <p>
          <strong>Allergens.</strong> We copy ingredients carefully, but the
          label on the product is what counts. Check it before eating. If you
          have an allergy, read the label on the product you receive, not only
          the listing in the app.
        </p>
      </LegalSection>

      <LegalSection id="loyalty" title="13. Your store loyalty card">
        <p>
          Where the app offers it, you can save the number of your own store
          loyalty card. Your shopper scans it at the till before paying, and
          the points are yours under that programme&apos;s own terms and
          privacy policy. That store&apos;s programme then records the purchase
          on your loyalty account. We offer a programme only after checking
          its terms, and we cannot promise a store will award the points.
        </p>
        <p>
          Taeam never collects store points for itself, and shoppers never use
          their own loyalty cards on your order.
        </p>
      </LegalSection>

      <LegalSection id="receipt" title="14. Your receipt and GST">
        <p>
          Your receipt shows who shopped your order and at which store, the
          goods total with a photo of the store receipt attached, any swap
          credit, the Taeam service fee (labelled &quot;launch price&quot;
          while it runs), any Taeam Plus or promo discount, GST on the service
          fee with Taeam&apos;s GST registration number, your tip, and the
          total charged.
        </p>
        <p>
          The goods carry the store&apos;s own GST on the items that are
          taxable, passed through to you exactly as the store charged it, as
          shown on the store receipt. Deposits and bag charges are passed
          through at what the store charged. Taeam does not add any tax to the
          goods. Taeam charges GST on its service fee only.
        </p>
      </LegalSection>

      <LegalSection id="responsibility" title="15. Who is responsible for what">
        <p>
          The manufacturer and the store are responsible for the products
          themselves: their quality, safety and labelling. Taeam is responsible
          for buying the product you ordered or its approved backup, keeping
          chilled and frozen items in insulated bags on the way, delivering
          your order, handling refunds under these terms, and the checks
          described in section 12.
        </p>
        <p>
          The limits in section 14 of the{" "}
          <Link href="/terms#liability" className={linkClass}>
            Terms of Service
          </Link>{" "}
          apply to grocery orders. Nothing in these terms limits rights that
          consumer protection law says cannot be limited.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="16. Changes, language and law">
        <p>
          If we change these terms, we publish a new version on this page with
          a new version number and date, and ask you to accept it before your
          next grocery order. A change to the price follows section 6.
        </p>
        <p>
          The app may show you a summary of these terms in Arabic or Urdu. The
          English text on this page is the version that governs.
        </p>
        <p>
          These terms are governed by the laws of Alberta and the federal laws
          of Canada that apply there.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="17. Contact">
        <p>
          Questions about a grocery order or these terms: support in the app, or{" "}
          <LegalMail />.
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
