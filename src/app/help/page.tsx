import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Help & support',
  description: 'Get help with your Taeam order or account.',
};

export default function HelpPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Help & support"
      subtitle="Open the Taeam app to get help with an order, chat with support, or manage your account. You can also email us at contact@taeam.ca."
      deepLink="taeam://help"
    />
  );
}
