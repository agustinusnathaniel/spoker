import { child, update } from 'firebase/database';

import { roomsData } from '~/lib/services/firebase/room/common';
import type { RoomConfig } from '~/lib/types/raw-db';

export const updateConfig = async (
  roomId: string,
  config: Partial<RoomConfig>
) => update(child(roomsData, `${roomId}/config`), config);
