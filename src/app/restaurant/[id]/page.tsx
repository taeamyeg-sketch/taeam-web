import type { Metadata } from 'next';
import { AppFallbackClient } from '@/components/AppFallbackClient';

export const metadata: Metadata = {
  title: 'Restaurant · Taeam',
  description: 'View this halal restaurant on the Taeam app.',
};

export function generateStaticParams() {
  return [{ id: 'restaurant' }];
}

export default function RestaurantDetailPage() {
  return (
    <AppFallbackClient
      brand="taeam"
      title="View this restaurant"
      subtitle="Open the Taeam app to see this restaurant's menu, halal verification, and order for delivery or pickup."
      paramKey="id"
      deepLinkTemplate="taeam://restaurant/{segment}"
    />
  );
}
