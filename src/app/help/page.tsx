import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';
import { SEALED } from '@/lib/launch';

export const metadata: Metadata = {
  title: 'Help & support',
  description: 'Get help with your Taeam order or account.',
};

export default function HelpPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Help & support"
      subtitle={
        SEALED
          ? "Taeam isn't open for orders yet. Got a question about the waitlist or a reservation? Email us at contact@taeam.ca."
          : 'Open the Taeam app to get help with an order, chat with support, or manage your account. You can also email us at contact@taeam.ca.'
      }
      deepLink="taeam://help"
      contactEmail="contact@taeam.ca"
    />
  );
}
