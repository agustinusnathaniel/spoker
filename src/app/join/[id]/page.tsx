import type { Metadata } from 'next';

import { JoinRoom } from '~/lib/pages/join';

export const metadata: Metadata = {
  title: 'Join Room',
};

export default function JoinRoomPage() {
  return <JoinRoom />;
}
