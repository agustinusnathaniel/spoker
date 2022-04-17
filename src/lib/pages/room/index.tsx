import { Box, Grid, useToast } from "@chakra-ui/react";
import { child, onValue, onDisconnect } from "firebase/database";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

import { AuthContext } from "lib/components/auth/AuthProvider";
import ControllerWrapper from "lib/components/room/ControllerWrapper";
import CurrentVotesWrapper from "lib/components/room/CurrentVotesWrapper";
import RoomHeader from "lib/components/room/RoomHeader";
import TaskList from "lib/components/room/TaskList";
import VoteWrapper from "lib/components/room/VoteWrapper";
import SpokerLoading from "lib/components/shared/SpokerLoading";
import {
  disconnectUser,
  roomsData,
  submitVote,
} from "lib/services/firebase/room";
import type { PointEntry, RoomInstance } from "lib/types/RawDB";
import type { RoomUser } from "lib/types/room";
import { RoleType } from "lib/types/user";

const RoomContainer = () => {
  const { currentUser } = React.useContext(AuthContext);
  const [busy, setBusy] = React.useState<boolean>(true);
  const [showVote, setShowVote] = React.useState<boolean>(false);
  const [roomData, setRoomData] = React.useState<RoomInstance>();
  const [users, setUsers] = React.useState<Array<RoomUser>>([]);
  const [inRoom, setInRoom] = React.useState<boolean>(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;
  const toast = useToast();

  const participantPoints = React.useMemo(() => {
    if (!showVote) {
      return [];
    }
    return [...users]
      .filter((unfilteredUser) =>
        [RoleType.owner, RoleType.participant].includes(unfilteredUser.role)
      )
      .map((user) => user.point ?? 0);
  }, [showVote, users]);

  const averagePoint = React.useMemo(() => {
    const filledPoints = participantPoints.filter((point) => point);
    return (
      filledPoints.reduce((prev, current) => {
        if (current) {
          return current + prev;
        }
        return prev;
      }, 0) / filledPoints.length ?? 0
    );
  }, [participantPoints]);
  const highestPoint = React.useMemo(
    () => participantPoints.sort((a, b) => b - a)[0] ?? 0,
    [participantPoints]
  );
  const userRole = React.useMemo(
    () => currentUser && roomData?.users?.[currentUser.uid]?.role,
    [currentUser, roomData?.users]
  );
  const isParticipant = userRole === RoleType.participant;
  const isObservant = userRole === RoleType.observant;
  const isOwner = userRole === RoleType.owner;

  const getRoomData = async () => {
    onValue(child(roomsData, id as string), (snap) => {
      if (snap.exists()) {
        setRoomData(snap.val());
        onDisconnect(child(snap.ref, `users/${currentUser?.uid}`)).remove();
      } else {
        router.push("/");
        toast({
          title: "This room doesn't exist",
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    });
  };

  const removeUserFromRoom = async () => {
    if (roomData && currentUser && roomData.users?.[currentUser.uid]) {
      setInRoom(false);
      disconnectUser(id as string, currentUser.uid);
    }
  };

  const handleFinishVote = async (estimate: number) => {
    if (roomData && currentUser && isOwner) {
      const pointEntries: Array<PointEntry> = users.map(
        (user) => ({ name: user.name, point: user.point ?? 0 } as PointEntry)
      );
      await submitVote(
        id as string,
        roomData.task,
        pointEntries,
        estimate,
        roomData.queue,
        roomData.completed
      );
    }
  };

  React.useEffect(() => {
    toast.closeAll();
    getRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (roomData?.task.lastVoted?.name) {
      toast({
        description: `${roomData.task.lastVoted.name} just voted`,
        status: "info",
        position: "bottom-right",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomData?.task.lastVoted?.name, roomData?.task.lastVoted?.time]);

  React.useEffect(() => {
    if (roomData && currentUser && inRoom) {
      if (roomData.users?.[currentUser.uid]) {
        setBusy(false);
        const updatedUsers: Array<RoomUser> = Object.entries(roomData.users)
          .map(([uid, userData]) => ({
            uid,
            ...userData,
          }))
          .filter((user) => user.isConnected);

        const isAllParticipantVoted = updatedUsers
          .filter((user) => user.role === RoleType.participant)
          .every((user) => user.point);

        setShowVote(isAllParticipantVoted);
        setUsers(updatedUsers);
        return;
      }

      router.push(`/join/${id}`);
      toast({
        status: "warning",
        title: "You haven't pick any role yet",
        description:
          "Either you haven't join the room before or rejoin or disconnected / refreshed the page",
        position: "top-right",
        duration: 15000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomData, inRoom]);

  React.useEffect(() => {
    router.events.on("routeChangeStart", removeUserFromRoom);
    return () => {
      router.events.off("routeChangeStart", removeUserFromRoom);
    };
  });

  if (busy) {
    return <SpokerLoading />;
  }

  return currentUser && roomData ? (
    <Grid gap={8}>
      <Head>
        <title>{roomData.room.name} | spoker</title>
      </Head>

      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={6}>
        <Grid gap={6}>
          <RoomHeader roomData={roomData} isOwner={isOwner} />
          {(isOwner || isParticipant) && (
            <VoteWrapper
              roomData={roomData}
              currentUser={currentUser}
              showVote={showVote}
            />
          )}
        </Grid>

        <Grid gap={6}>
          <CurrentVotesWrapper
            isOwner={isOwner}
            isObservant={isObservant}
            isParticipant={isParticipant}
            roomData={roomData}
            showVote={showVote}
            averagePoint={averagePoint}
            highestPoint={highestPoint}
            users={users}
            currentUser={currentUser}
            onFinishVote={handleFinishVote}
          />
          <ControllerWrapper
            users={users}
            isResetEnabled={isOwner || isObservant}
          />
        </Grid>
      </Grid>

      <TaskList isOwner={isOwner} roomData={roomData} showVote={showVote} />
    </Grid>
  ) : (
    <Box>Error</Box>
  );
};

export default RoomContainer;
