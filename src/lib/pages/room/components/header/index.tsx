import { Box, Divider, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import * as React from 'react';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { useRoomStoreState } from '~/lib/stores/room';

import { EditableFields } from './components/editable-fields';
import { useRoomHeader } from './hooks';

export const RoomHeader = () => {
  const { roomData } = useRoomStoreState();
  const { isOwner } = useUserRole();
  const { name, description, handleUpdateTask } = useRoomHeader({
    roomData,
    isOwner,
  });

  const content = React.useMemo(() => {
    if (isOwner) {
      return (
        <EditableFields
          name={name}
          description={description}
          handleUpdateTask={handleUpdateTask}
        />
      );
    }
    const task = roomData?.task;
    if (!task) {
      return null;
    }

    return (
      <>
        <Heading fontSize="2xl" wordBreak="break-word">
          {task.name}
        </Heading>
        {task.description && (
          <Text wordBreak="break-word">{task.description}</Text>
        )}
      </>
    );
  }, [description, handleUpdateTask, isOwner, name, roomData?.task]);

  return (
    <SpokerWrapperGrid gap={4}>
      <Box>
        <Heading size="lg">{roomData?.room.name}</Heading>
        <Divider borderColor="black" marginTop={2} />
      </Box>

      <Flex gridGap={4}>
        <Heading size="md">Story</Heading>

        <Grid gap={2} width="full">
          {content}
        </Grid>
      </Flex>
    </SpokerWrapperGrid>
  );
};
