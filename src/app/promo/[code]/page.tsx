import type { Metadata } from 'next';
import { AppFallbackClient } from '@/components/AppFallbackClient';

export const metadata: Metadata = {
  title: 'Your promo · Taeam',
  description: 'Apply your Taeam promo code.',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [{ code: 'promo' }];
}

export default function PromoPage() {
  return (
    <AppFallbackClient
      brand="taeam"
      title="Claim your promo"
      subtitle="Open the Taeam app to apply this promo code automatically at checkout."
      paramKey="code"
      deepLinkTemplate="taeam://promo/{segment}"
      detailTemplate="Code {segment}"
    />
  );
}
