import { useToast } from '@chakra-ui/react';
import { child, onDisconnect, onValue } from 'firebase/database';
import { useRouter } from 'next/router';
import * as React from 'react';

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
} from '~/lib/utils/roomUtils';

export const useRoomListener = () => {
  const router = useRouter();
  const toast = useToast();

  const { currentUser } = useAuthStoreState();
  const { roomData, inRoom } = useRoomStoreState();
  const { userRole } = useUserRole();
  const { setIsBusy, setShowVote, setRoomData, setUsers, setInRoom } =
    useRoomStoreAction();

  const {
    query: { id },
  } = router;
  const firstRenderRef = React.useRef(true);

  const handleOnDisconnect = React.useCallback(() => {
    if (currentUser?.uid) {
      onDisconnect(
        child(roomsData, `${id as string}/users/${currentUser.uid}`)
      ).update({
        isConnected: false,
      });
    }
  }, [currentUser?.uid, id]);

  const getRoomData = React.useCallback(async () => {
    setInRoom(true);
    onValue(child(roomsData, id as string), (snap) => {
      if (snap.exists()) {
        setRoomData(snap.val());
        handleOnDisconnect();
      } else {
        router.push('/');
        toast({
          title: "This room doesn't exist",
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      }
    });
  }, [handleOnDisconnect, id, router, setInRoom, setRoomData, toast]);

  const removeUserFromRoom = async () => {
    if (roomData && currentUser && roomData.users?.[currentUser.uid]) {
      setInRoom(false);
      await disconnectUser(id as string, currentUser.uid);
    }
  };

  const handleRejoin = React.useCallback(async () => {
    await rejoinRoom(id as string, userRole);
    setInRoom(true);
  }, [id, setInRoom, userRole]);

  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      toast.closeAll();
      getRoomData();
    }
  }, [getRoomData, toast]);

  React.useEffect(() => {
    console.info({ roomData, currentUser, inRoom });
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
      toast({
        status: 'warning',
        title: "You haven't pick any role yet",
        description:
          "Either you haven't join the room before or rejoin or disconnected / refreshed the page",
        position: 'top-right',
        duration: 15000,
        isClosable: true,
      });
    }
  }, [
    roomData,
    inRoom,
    currentUser,
    router,
    id,
    toast,
    setIsBusy,
    setShowVote,
    setUsers,
  ]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    router.events.on('routeChangeStart', removeUserFromRoom);
    return () => {
      router.events.off('routeChangeStart', removeUserFromRoom);
    };
  });
};
