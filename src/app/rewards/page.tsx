import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Your rewards · Taeam',
  description: 'View and redeem your Taeam rewards points.',
};

export default function RewardsPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Your rewards"
      subtitle="Open the Taeam app to check your points balance and redeem rewards on your next order."
      deepLink="taeam://rewards"
    />
  );
}
