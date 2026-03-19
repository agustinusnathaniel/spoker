import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useReward } from 'react-rewards';

import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';
import { useRoomStoreState } from '~/lib/stores/room';

export const useVoteListener = () => {
  const toast = useToast();
  const { roomData, showVote } = useRoomStoreState();
  const { reward } = useReward(CURRENT_VOTE_WRAPPER_ID, 'confetti');

  useEffect(() => {
    if (showVote) {
      reward();
    }
  }, [showVote, reward]);

  useEffect(() => {
    if (roomData?.task.lastVoted?.name && roomData?.task.lastVoted?.time) {
      toast({
        description: `${roomData.task.lastVoted.name} just voted`,
        status: 'info',
        position: 'bottom-right',
      });
    }
  }, [roomData?.task.lastVoted?.name, roomData?.task.lastVoted?.time, toast]);
};
