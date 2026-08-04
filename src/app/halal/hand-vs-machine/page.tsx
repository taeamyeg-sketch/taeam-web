import type { Metadata } from 'next';
import HandVsMachineExperience from './HandVsMachineExperience';

export const metadata: Metadata = {
  title: 'Hand or Machine: What Halal Chicken Actually Means',
  description:
    'Machine-slaughtered halal chicken is real, certified, and sold everywhere in Canada. Here is how it differs from conventional meat, how hand slaughter works, where scholars stand, and how to know which one you are eating.',
  keywords: [
    'machine slaughtered halal',
    'hand slaughtered chicken',
    'zabihah by hand',
    'is machine slaughtered chicken halal',
    'halal stunning',
    'halal certification Canada',
    'zabiha',
    'Taeam',
  ],
  openGraph: {
    title: 'Hand or Machine · Taeam Research',
    description:
      'Two very different things are both sold as halal chicken in Canada. What happens on each line, what scholars say, and how to know which one is on your plate.',
    type: 'article',
    url: 'https://taeam.ca/halal/hand-vs-machine',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Taeam, Hand or Machine' }],
  },
};

export default function HandVsMachinePage() {
  return <HandVsMachineExperience />;
}
