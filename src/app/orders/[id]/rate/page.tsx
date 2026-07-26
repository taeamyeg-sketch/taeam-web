import type { Metadata } from 'next';
import { AppFallbackClient } from '@/components/AppFallbackClient';

export const metadata: Metadata = {
  title: 'Rate your order',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [{ id: 'order' }];
}

export default function OrderRatePage() {
  return (
    <AppFallbackClient
      brand="taeam"
      title="Rate your order"
      subtitle="Open the Taeam app to leave a rating and help other Edmontonians find great halal food."
      paramKey="id"
      deepLinkTemplate="taeam://orders/{segment}/rate"
      detailTemplate="Order {segment}"
    />
  );
}
