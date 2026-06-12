import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Tawsil driver dashboard',
  description: 'Open the Tawsil driver app.',
  robots: { index: false, follow: false },
};

export default function DriverPage() {
  return (
    <AppFallback
      brand="tawsil"
      title="Driver dashboard"
      subtitle="Open the Tawsil driver app to go online, view offers, and track your earnings."
      deepLink="tawsil://driver"
    />
  );
}
