import type { Metadata } from 'next';

import { Home } from '~/lib/pages/home';

export const metadata: Metadata = {
  title: 'Estimate with your Team',
};

export default function HomePage() {
  return <Home />;
}
