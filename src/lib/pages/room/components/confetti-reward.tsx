'use client';

import { useEffect } from 'react';
import { useReward } from 'react-rewards';

import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';

interface ConfettiRewardProps {
  trigger: boolean;
}

export const ConfettiReward = ({ trigger }: ConfettiRewardProps) => {
  const { reward } = useReward(CURRENT_VOTE_WRAPPER_ID, 'confetti');

  useEffect(() => {
    if (trigger) {
      reward();
    }
  }, [trigger, reward]);

  return null;
};
