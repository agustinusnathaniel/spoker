'use client';

import { useEffect } from 'react';
import { useReward } from 'react-rewards';

import { toaster } from '~/lib/components/ui/toaster';
import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';
import { useRoomStoreState } from '~/lib/stores/room';

export const useVoteListener = () => {
  const { roomData, showVote } = useRoomStoreState();
  const { reward } = useReward(CURRENT_VOTE_WRAPPER_ID, 'confetti');

  useEffect(() => {
    if (showVote) {
      reward();
    }
  }, [showVote, reward]);

  useEffect(() => {
    if (roomData?.task.lastVoted?.name && roomData?.task.lastVoted?.time) {
      toaster.create({
        description: `${roomData.task.lastVoted.name} just voted`,
        type: 'info',
      });
    }
  }, [roomData?.task.lastVoted?.name, roomData?.task.lastVoted?.time]);
};
