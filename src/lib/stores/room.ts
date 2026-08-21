import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

import type { RoomInstance } from '~/lib/types/raw-db';
import type { RoomUser } from '~/lib/types/room';

interface RoomState {
  inRoom: boolean;
  isBusy: boolean;
  roomData?: RoomInstance;
  showVote: boolean;
  users: Array<RoomUser>;
}

interface RoomSetStateAction {
  setInRoom: (inRoom: boolean) => void;
  setIsBusy: (isBusy: boolean) => void;
  setRoomData: (roomData: RoomInstance) => void;
  setShowVote: (showVote: boolean) => void;
  setUsers: (users: Array<RoomUser>) => void;
}

type RoomStore = RoomState & RoomSetStateAction;

export const useRoomStore = create<RoomStore>()((set) => ({
  inRoom: true,
  isBusy: true,
  setInRoom: (inRoom) => set({ inRoom }),
  setIsBusy: (isBusy) => set({ isBusy }),
  setRoomData: (roomData) => set({ roomData }),
  setShowVote: (showVote) => set({ showVote }),
  setUsers: (users) => set({ users }),
  showVote: false,
  users: [],
}));

export const useRoomStoreState = (): RoomState =>
  useRoomStore(
    useShallow(({ roomData, isBusy, showVote, users, inRoom }) => ({
      inRoom,
      isBusy,
      roomData,
      showVote,
      users,
    }))
  );

export const useRoomStoreAction = (): RoomSetStateAction =>
  useRoomStore(
    useShallow(
      ({ setIsBusy, setShowVote, setRoomData, setUsers, setInRoom }) => ({
        setInRoom,
        setIsBusy,
        setRoomData,
        setShowVote,
        setUsers,
      })
    )
  );
