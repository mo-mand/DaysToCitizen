import type { Metadata } from 'next';
import HelpContent from './HelpContent';

export const metadata: Metadata = {
  title: 'How to Track Canadian Citizenship Days — DaysToCitizen Help',
  description:
    'Learn how IRCC counts physical presence for citizenship eligibility. Step-by-step guide to tracking your 1,095 days in Canada as a Permanent Resident.',
  keywords: [
    'Canadian citizenship physical presence',
    'IRCC 1095 days',
    'permanent resident citizenship tracker',
    'how to count days for Canadian citizenship',
    'citizenship eligibility calculator Canada',
  ],
  openGraph: {
    title: 'How to Track Canadian Citizenship Days — DaysToCitizen',
    description:
      'IRCC requires 1,095 days of physical presence in Canada within 5 years. Learn exactly how to count them and avoid costly mistakes.',
    url: 'https://daystocitizen.ca/help',
    siteName: 'DaysToCitizen',
    type: 'article',
  },
};

export default function HelpPage() {
  return <HelpContent />;
}
