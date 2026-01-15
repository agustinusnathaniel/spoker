import { nanoid } from 'nanoid';

import { clearPoints } from '~/lib/services/firebase/room/update/point/clear';
import { rewriteCompleted } from '~/lib/services/firebase/room/update/rewrite-completed';
import { rewriteQueue } from '~/lib/services/firebase/room/update/rewrite-queue';
import { updateRoomTask } from '~/lib/services/firebase/room/update/room-task';
import type { Task } from '~/lib/types/raw-db';

import type { SubmitVoteArgs } from './types';

export const submitVote = async ({
  roomId,
  task,
  entries,
  estimate,
  queue,
  completed,
}: SubmitVoteArgs) => {
  const votedTask: Task = {
    ...task,
    estimation: estimate,
    pointEntries: entries,
  };

  const randomId = nanoid(21);

  const nextTask = queue?.[0] ?? {
    id: randomId,
    name: 'Placeholder Story (end of Stories)',
    description: 'Edit Me',
  };
  const updatedQueue = queue?.slice(1) ?? [];
  const updatedCompleted = [votedTask, ...(completed ?? [])];

  await Promise.all([
    updateRoomTask(roomId, nextTask),
    rewriteQueue(roomId, updatedQueue),
    rewriteCompleted(roomId, updatedCompleted),
    clearPoints(roomId),
  ]);
};
