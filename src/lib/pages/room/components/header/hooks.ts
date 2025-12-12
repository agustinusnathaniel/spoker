import debounce from 'lodash-es/debounce';
import isNil from 'lodash-es/isNil';
import { useRouter } from 'next/router';
import * as React from 'react';

import { updateRoomTask } from '~/lib/services/firebase/room/update/room-task';
import type { Task } from '~/lib/types/raw-db';

import type { RoomHeaderProps } from './types';

type UseRoomHeaderArgs = RoomHeaderProps & {
  isOwner: boolean;
};

export const useRoomHeader = ({ roomData, isOwner }: UseRoomHeaderArgs) => {
  const [name, setName] = React.useState<string | undefined>(
    roomData?.task.name,
  );
  const [description, setDescription] = React.useState<string | undefined>(
    roomData?.task.description,
  );
  const router = useRouter();
  const {
    query: { id },
  } = router;

  React.useEffect(() => {
    if (!isNil(roomData?.task.name)) {
      setName(roomData?.task.name);
    }
  }, [roomData?.task.name]);

  React.useEffect(() => {
    if (!isNil(roomData?.task.description)) {
      setDescription(roomData?.task.description);
    }
  }, [roomData?.task.description]);

  const handleUpdateRemoteTask = React.useCallback(
    (field: keyof Task) =>
      debounce(async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (roomData && isOwner) {
          const updatedTask: Task = {
            ...roomData.task,
            [field]: event.target.value,
          };
          await updateRoomTask(id as string, updatedTask);
        }
      }, 500),
    [id, isOwner, roomData],
  );

  const handleUpdateTask = React.useCallback(
    (field: keyof Task) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (field === 'name') {
        setName(event.target.value);
      }
      if (field === 'description') {
        setDescription(event.target.value);
      }
      handleUpdateRemoteTask(field)(event);
    },
    [handleUpdateRemoteTask],
  );

  return {
    name,
    description,
    handleUpdateTask,
  };
};
