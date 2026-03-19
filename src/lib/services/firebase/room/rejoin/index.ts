import { child, get, set, update } from 'firebase/database';

import { getCurrentUser } from '~/lib/services/firebase/auth/get-current-user';
import { roomsData } from '~/lib/services/firebase/room/common';
import type { RoleType } from '~/lib/types/user';

export const rejoinRoom = async (roomId: string, role?: RoleType | null) => {
  const currentUser = getCurrentUser();

  await get(child(roomsData, `${roomId}/users/${currentUser?.uid}`)).then(
    async (snap) => {
      if (snap.exists()) {
        await update(snap.ref, {
          isConnected: true,
        });
      } else {
        await set(child(roomsData, `${roomId}/users/${currentUser?.uid}`), {
          name: currentUser?.displayName,
          role,
          isConnected: true,
        });
      }
    }
  );
};
