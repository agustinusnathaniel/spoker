import type { Metadata } from 'next';

import { NotFoundPage } from '~/lib/pages/404';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return <NotFoundPage />;
}
