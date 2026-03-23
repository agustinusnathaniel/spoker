'use client';

import { useEffect } from 'react';

import { toaster } from '~/lib/components/ui/toaster';
import { useRoomStoreState } from '~/lib/stores/room';

export const useVoteListener = () => {
  const { roomData } = useRoomStoreState();

  // Note: Confetti reward is now handled by dynamically imported ConfettiReward component
  // in the CurrentVotesWrapper to reduce initial bundle size

  useEffect(() => {
    if (roomData?.task.lastVoted?.name && roomData?.task.lastVoted?.time) {
      toaster.create({
        description: `${roomData.task.lastVoted.name} just voted`,
        type: 'info',
      });
    }
  }, [roomData?.task.lastVoted?.name, roomData?.task.lastVoted?.time]);
};
