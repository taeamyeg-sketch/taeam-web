import type { Metadata } from 'next';
import HalalExperience from './HalalExperience';

export const metadata: Metadata = {
  title: 'The Halal Trust Gap · Taeam',
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
    title: 'The Halal Trust Gap · Taeam',
    description:
      'No single standard. Unregulated certifiers. "Only the chicken is halal." The trust gap Canadian Muslims face, and how Taeam closes it.',
    type: 'article',
    url: 'https://taeam.ca/halal',
    images: [{ url: '/taeam-logo.png', width: 512, height: 512, alt: 'Taeam, The Halal Trust Gap' }],
  },
};

export default function HalalPage() {
  return <HalalExperience />;
}
