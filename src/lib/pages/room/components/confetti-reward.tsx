'use client';

import { useEffect, useMemo } from 'react';
import { confetti, useReward } from 'react-rewards';

import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';

interface ConfettiRewardProps {
  trigger: boolean;
}

export const ConfettiReward = ({ trigger }: ConfettiRewardProps) => {
  // react-rewards v3 targets an element or ref instead of a DOM id.
  // The wrapper is rendered by current-votes-wrapper, so resolve it lazily
  // at fire time; useReward reads .current when reward() is called.
  const target = useMemo(
    () => ({
      get current() {
        return document.querySelector(`#${CURRENT_VOTE_WRAPPER_ID}`);
      },
    }),
    []
  );
  const { reward } = useReward(target, confetti);

  useEffect(() => {
    if (trigger) {
      reward();
    }
  }, [trigger, reward]);

  return null;
};
