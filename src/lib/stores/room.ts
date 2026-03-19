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
  isBusy: true,
  showVote: false,
  users: [],
  inRoom: true,
  setIsBusy: (isBusy) => set({ isBusy }),
  setShowVote: (showVote) => set({ showVote }),
  setRoomData: (roomData) => set({ roomData }),
  setUsers: (users) => set({ users }),
  setInRoom: (inRoom) => set({ inRoom }),
}));

export const useRoomStoreState = (): RoomState =>
  useRoomStore(
    useShallow(({ roomData, isBusy, showVote, users, inRoom }) => ({
      roomData,
      isBusy,
      showVote,
      users,
      inRoom,
    }))
  );

export const useRoomStoreAction = (): RoomSetStateAction =>
  useRoomStore(
    useShallow(
      ({ setIsBusy, setShowVote, setRoomData, setUsers, setInRoom }) => ({
        setIsBusy,
        setShowVote,
        setRoomData,
        setUsers,
        setInRoom,
      })
    )
  );
