'use client';

import { child, onDisconnect, onValue } from 'firebase/database';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { toaster } from '~/lib/components/ui/toaster';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { roomsData } from '~/lib/services/firebase/room/common';
import { rejoinRoom } from '~/lib/services/firebase/room/rejoin';
import { disconnectUser } from '~/lib/services/firebase/room/update/disconnect-user';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreAction, useRoomStoreState } from '~/lib/stores/room';
import type { RoomUser } from '~/lib/types/room';
import {
  checkAllParticipantVoted,
  connectedUsers,
} from '~/lib/utils/room-utils';

export const useRoomListener = () => {
  const router = useRouter();

  const { currentUser } = useAuthStoreState();
  const { roomData, inRoom } = useRoomStoreState();
  const { userRole } = useUserRole();
  const { setIsBusy, setShowVote, setRoomData, setUsers, setInRoom } =
    useRoomStoreAction();

  const params = useParams();
  const id = params?.id as string;
  const firstRenderRef = useRef(true);

  const handleOnDisconnect = useCallback(() => {
    if (currentUser?.uid) {
      onDisconnect(child(roomsData, `${id}/users/${currentUser.uid}`)).update({
        isConnected: false,
      });
    }
  }, [currentUser?.uid, id]);

  const getRoomData = useCallback(() => {
    setInRoom(true);
    onValue(child(roomsData, id), (snap) => {
      if (snap.exists()) {
        setRoomData(snap.val());
        handleOnDisconnect();
      } else {
        router.push('/');
        toaster.create({
          title: "This room doesn't exist",
          type: 'error',
        });
      }
    });
  }, [handleOnDisconnect, id, router, setInRoom, setRoomData]);

  const removeUserFromRoom = async () => {
    if (roomData && currentUser && roomData.users?.[currentUser.uid]) {
      setInRoom(false);
      await disconnectUser(id, currentUser.uid);
    }
  };

  const handleRejoin = useCallback(async () => {
    await rejoinRoom(id, userRole);
    setInRoom(true);
  }, [id, setInRoom, userRole]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      getRoomData();
    }
  }, [getRoomData]);

  useEffect(() => {
    if (roomData && currentUser && inRoom) {
      if (roomData.users?.[currentUser.uid]) {
        setIsBusy(false);
        const updatedUsers: Array<RoomUser> = connectedUsers(roomData.users);
        const isAllParticipantVoted = checkAllParticipantVoted(updatedUsers);
        setShowVote(isAllParticipantVoted);
        setUsers(updatedUsers);
        return;
      }

      router.push(`/join/${id}`);
      toaster.create({
        type: 'warning',
        title: "You haven't pick any role yet",
        description:
          "Either you haven't join the room before or rejoin or disconnected / refreshed the page",
        duration: 15_000,
      });
    }
  }, [
    roomData,
    inRoom,
    currentUser,
    router,
    id,
    setIsBusy,
    setShowVote,
    setUsers,
  ]);

  useEffect(() => {
    const inRoomDisconnected =
      roomData &&
      currentUser &&
      inRoom &&
      currentUser &&
      roomData.users?.[currentUser?.uid] &&
      !roomData.users?.[currentUser.uid]?.isConnected;

    if (inRoomDisconnected) {
      handleRejoin();
    }
  }, [currentUser, handleRejoin, inRoom, roomData, roomData?.users]);

  // Handle route change - remove user from room when leaving
  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup function
  useEffect(
    () => () => {
      removeUserFromRoom();
    },
    []
  );
};
