import type { Metadata } from 'next';

import { Auth } from '~/lib/pages/auth';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function AuthPage() {
  return <Auth />;
}
