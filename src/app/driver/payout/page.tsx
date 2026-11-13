import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Payout setup · Tawsil',
  description: 'Go back to the Tawsil driver app to see your payout status.',
  robots: { index: false, follow: false },
};

// Where Stripe sends a driver after its payout form. The Tawsil app normally
// catches this address itself; this page is what shows when it does not.
export default function DriverPayoutPage() {
  return (
    <AppFallback
      brand="tawsil"
      title="Your details were sent to Stripe"
      subtitle="Go back to the Tawsil app and open Payouts. It shows whether you are all set or if Stripe still needs something, like a photo of your ID."
      deepLink="tawsil://driver/payout"
    />
  );
}
