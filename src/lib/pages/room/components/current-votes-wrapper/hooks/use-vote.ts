'use client';

import { useParams } from 'next/navigation';

import { useUserRole } from '~/lib/hooks/use-user-role';
import { submitVote } from '~/lib/services/firebase/room/update/submit-vote';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStore } from '~/lib/stores/room';
import type { PointEntry } from '~/lib/types/raw-db';

export const useVote = () => {
  const params = useParams();
  const id = params.id as string;
  const { currentUser } = useAuthStoreState();
  const { isOwner } = useUserRole();

  const handleFinishVote = async (estimate: number) => {
    const { roomData, users } = useRoomStore.getState();

    if (roomData && currentUser && isOwner) {
      const pointEntries: Array<PointEntry> = users.map(
        (user) => ({ name: user.name, point: user.point ?? 0 }) as PointEntry
      );
      await submitVote({
        completed: roomData.completed,
        entries: pointEntries,
        estimate,
        queue: roomData.queue,
        roomId: id,
        task: roomData.task,
      });
    }
  };

  return {
    handleFinishVote,
  };
};
