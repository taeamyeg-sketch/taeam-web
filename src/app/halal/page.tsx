import type { Metadata } from 'next';
import HalalExperience from './HalalExperience';

export const metadata: Metadata = {
  title: 'The halal trust gap',
  description:
    'Almost two million Muslims in Canada still walk out of restaurants unsure the food is really halal. No single standard, unregulated certifiers, and "only the chicken is halal" labels. Here is the trust gap, and how Taeam closes it with transparency.',
  keywords: [
    'halal',
    'halal certification Canada',
    'halal trust',
    'zabihah',
    'halal Edmonton',
    'halal transparency',
    'Taeam',
  ],
  openGraph: {
    title: 'The halal trust gap · Taeam',
    description:
      'Canada has no single halal standard and nobody regulates the certifiers. The trust gap Canadian Muslims face, and how Taeam closes it.',
    type: 'article',
    url: 'https://taeam.ca/halal',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Taeam, the halal trust gap' }],
  },
};

export default function HalalPage() {
  return <HalalExperience />;
}
