import type { Metadata } from 'next';

import { ChangelogPage } from '~/lib/pages/changelog';

export const metadata: Metadata = {
  title: 'Changelog',
};

export default function Changelog() {
  return <ChangelogPage />;
}
