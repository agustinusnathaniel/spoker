import { Flex, Grid, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";

import SpokerInput from "lib/components/shared/SpokerInput";
import SpokerWrapperGrid from "lib/components/shared/SpokerWrapperGrid";
import { updateRoomTask } from "lib/services/firebase/room";
import type { RoomInstance, Task } from "lib/types/RawDB";

type RoomHeaderProps = {
  roomData: RoomInstance;
  isOwner: boolean;
};

const RoomHeader = ({ roomData, isOwner }: RoomHeaderProps) => {
  const wrapperBackgroundColor = useColorModeValue("teal.50", "teal.600");
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const handleUpdateTask = React.useCallback(
    (field: keyof Task) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (roomData && isOwner) {
        const updatedTask: Task = {
          ...roomData.task,
          [field]: event.target.value,
        };
        updateRoomTask(id as string, updatedTask);
      }
    },
    [id, isOwner, roomData]
  );

  const content = React.useMemo(() => {
    const task = roomData?.task;
    if (isOwner) {
      return (
        <>
          <SpokerInput
            label="Name"
            value={task.name}
            onChange={handleUpdateTask("name")}
            placeholder="Going to Mars"
          />
          <SpokerInput
            label="Description"
            value={task.description}
            onChange={handleUpdateTask("description")}
            placeholder="Land to Moon first"
          />
        </>
      );
    }

    return (
      <>
        <Heading fontSize="2xl">{task.name}</Heading>
        {task.description && <Text>{task.description}</Text>}
      </>
    );
  }, [handleUpdateTask, isOwner, roomData?.task]);

  return (
    <SpokerWrapperGrid gap={4} backgroundColor={wrapperBackgroundColor}>
      <Heading size="lg">{roomData?.room.name}</Heading>

      <Flex gridGap={4}>
        <Heading size="md">Story</Heading>

        <Grid gap={2} width="full">
          {content}
        </Grid>
      </Flex>
    </SpokerWrapperGrid>
  );
};

export default RoomHeader;
