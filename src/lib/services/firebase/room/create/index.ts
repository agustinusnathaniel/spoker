import { child, get, set } from 'firebase/database';
import { nanoid } from 'nanoid';

import type { CreateRoomFormType } from '~/lib/models/hall';
import { roomsData } from '~/lib/services/firebase/room/common';
import type { RoomInstance } from '~/lib/types/raw-db';

export const createRoom = async (roomInstance: CreateRoomFormType) => {
  await get(roomsData).then((snap) => {
    if (snap.hasChild(roomInstance.id)) {
      throw new Error('room already exists, try another id.');
    }
  });

  const randomId = nanoid(21);

  const newRoom: RoomInstance = {
    room: {
      name: roomInstance.name,
      isPrivate: roomInstance.isPrivate,
      password: roomInstance.isPrivate ? roomInstance.password : '',
    },
    task: {
      id: randomId,
      name: '#1 Task',
      description: 'Edit Me',
    },
    queue: [],
    completed: [],
    selectedTaskIndex: -1,
    config: {
      isFreezeAfterVote: true,
      hideLabel: 'monkey',
    },
  };

  await set(child(roomsData, roomInstance.id), newRoom);
  return true;
};
