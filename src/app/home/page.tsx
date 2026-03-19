import type { Metadata } from 'next';

import { Home } from '~/lib/pages/home';

export const metadata: Metadata = {
  title:
    'Estimate with your Team | spoker - real-time multiplayer scrum poker app',
};

export default function HomePage() {
  return <Home />;
}
