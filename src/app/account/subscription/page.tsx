import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Manage your subscription',
  description: 'Manage your Taeam Plus subscription.',
  robots: { index: false, follow: false },
};

export default function SubscriptionPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Your subscription"
      subtitle="Open the Taeam app to manage your Taeam Plus membership, billing, and benefits."
      deepLink="taeam://account/subscription"
    />
  );
}
