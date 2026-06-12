import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Peak hours · Tawsil',
  description: 'See peak earning hours in the Tawsil driver app.',
  robots: { index: false, follow: false },
};

export default function DriverPeakHoursPage() {
  return (
    <AppFallback
      brand="tawsil"
      title="Peak hours"
      subtitle="Open the Tawsil driver app to see when demand is highest and plan your drives to earn more."
      deepLink="tawsil://driver/peak-hours"
    />
  );
}
