'use client';

import debounce from 'lodash-es/debounce';
import isNil from 'lodash-es/isNil';
import { useParams } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { updateRoomTask } from '~/lib/services/firebase/room/update/room-task';
import type { Task } from '~/lib/types/raw-db';

import type { RoomHeaderProps } from './types';

type UseRoomHeaderArgs = RoomHeaderProps & {
  isOwner: boolean;
};

export const useRoomHeader = ({ roomData, isOwner }: UseRoomHeaderArgs) => {
  const [name, setName] = useState<string | undefined>(roomData?.task.name);
  const [description, setDescription] = useState<string | undefined>(
    roomData?.task.description
  );
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!isNil(roomData?.task.name)) {
      setName(roomData?.task.name);
    }
  }, [roomData?.task.name]);

  useEffect(() => {
    if (!isNil(roomData?.task.description)) {
      setDescription(roomData?.task.description);
    }
  }, [roomData?.task.description]);

  const handleUpdateRemoteTask = useCallback(
    (field: keyof Task) =>
      debounce(async (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (roomData && isOwner) {
          const updatedTask: Task = {
            ...roomData.task,
            [field]: event.target.value,
          };
          await updateRoomTask(id, updatedTask);
        }
      }, 500),
    [id, isOwner, roomData]
  );

  const handleUpdateTask = useCallback(
    (field: keyof Task) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (field === 'name') {
        setName(event.target.value);
      }
      if (field === 'description') {
        setDescription(event.target.value);
      }
      handleUpdateRemoteTask(field)(event);
    },
    [handleUpdateRemoteTask]
  );

  return {
    name,
    description,
    handleUpdateTask,
  };
};
