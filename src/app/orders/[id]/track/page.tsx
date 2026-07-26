import type { Metadata } from 'next';
import { AppFallbackClient } from '@/components/AppFallbackClient';

export const metadata: Metadata = {
  title: 'Track your order',
  robots: { index: false, follow: false },
};

// Static export requires a concrete param; the real order id is read at runtime
// (client) and resolved by the Cloudflare Pages _redirects fallback.
export function generateStaticParams() {
  return [{ id: 'order' }];
}

export default function OrderTrackPage() {
  return (
    <AppFallbackClient
      brand="taeam"
      title="Track your order"
      subtitle="Open the Taeam app to see your driver, live ETA, and order status in real time."
      paramKey="id"
      deepLinkTemplate="taeam://orders/{segment}/track"
      detailTemplate="Order {segment}"
    />
  );
}
