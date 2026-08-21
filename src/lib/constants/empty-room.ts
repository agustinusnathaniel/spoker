import type { RoomInstance } from '~/lib/types/raw-db';

export const emptyRoom: RoomInstance = {
  config: {
    isFreezeAfterVote: false,
  },
  room: {
    isPrivate: false,
    name: '',
  },
  selectedTaskIndex: 0,
  task: {
    id: '',
    name: '',
  },
};
