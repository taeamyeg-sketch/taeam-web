import type { Metadata } from 'next';
import { AppFallbackClient } from '@/components/AppFallbackClient';

export const metadata: Metadata = {
  title: { absolute: 'Order · Taeam for Restaurants' },
  description: 'View this order in the Taeam restaurant app.',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [{ id: 'order' }];
}

export default function MerchantOrderPage() {
  return (
    <AppFallbackClient
      brand="merchant"
      title="View this order"
      subtitle="Open the Taeam for Restaurants app to see the order details, accept it, and manage prep time."
      paramKey="id"
      deepLinkTemplate="taeammerchant://merchant/orders/{segment}"
      detailTemplate="Order {segment}"
    />
  );
}
