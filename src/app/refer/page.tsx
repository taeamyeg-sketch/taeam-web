import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Refer a friend · Taeam',
  description: 'Invite friends to Taeam and earn rewards.',
};

export default function ReferPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Refer a friend"
      subtitle="Open the Taeam app to grab your referral link. Invite friends and you both earn rewards."
      deepLink="taeam://refer"
    />
  );
}
