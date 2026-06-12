import type { Metadata } from 'next';
import { AppFallback } from '@/components/AppFallback';

export const metadata: Metadata = {
  title: 'Browse halal restaurants · Taeam',
  description: 'Browse verified halal restaurants in Edmonton on the Taeam app.',
};

export default function RestaurantsPage() {
  return (
    <AppFallback
      brand="taeam"
      title="Browse restaurants"
      subtitle="Open the Taeam app to browse every verified halal restaurant in Edmonton and order in a few taps."
      deepLink="taeam://restaurants"
    />
  );
}
