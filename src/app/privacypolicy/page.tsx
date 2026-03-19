import type { Metadata } from 'next';

import { PrivacyPolicy } from '~/lib/pages/privacypolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
