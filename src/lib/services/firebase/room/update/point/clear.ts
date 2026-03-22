import { child, get, update } from 'firebase/database';

import { roomsData } from '~/lib/services/firebase/room/common';

export const clearPoints = async (roomId: string) => {
  const snap = await get(child(roomsData, `${roomId}/users`));
  if (snap.exists()) {
    const users = snap.val() as Record<string, unknown>;
    const updates: Record<string, null> = {};

    for (const [userId] of Object.entries(users)) {
      updates[`${roomId}/users/${userId}/point`] = null;
    }

    await update(roomsData, updates);
  }
};
