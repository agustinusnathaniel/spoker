import type { Metadata } from 'next';

import { RoomPage } from '~/lib/pages/room';

export const metadata: Metadata = {
  title: 'Room',
};

export default function RoomRoutePage() {
  return <RoomPage />;
}
