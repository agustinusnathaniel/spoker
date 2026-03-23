import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { useRoomStore } from '~/lib/stores/room';
import {
  countAveragePoint,
  filterUserWithPoints,
} from '~/lib/utils/room-utils';

export const useRoomPoint = () => {
  const showVote = useRoomStore(useShallow((state) => state.showVote));
  const users = useRoomStore(useShallow((state) => state.users));

  const participantPoints = useMemo(() => {
    if (!showVote) {
      return [];
    }
    return filterUserWithPoints(users).map((user) => user.point ?? 0);
  }, [showVote, users]);

  const averagePoint = useMemo(() => {
    const filledPoints = participantPoints.filter((point) => point);
    return countAveragePoint(filledPoints);
  }, [participantPoints]);
  const highestPoint = useMemo(
    () => (participantPoints.length > 0 ? Math.max(...participantPoints) : 0),
    [participantPoints]
  );

  return {
    averagePoint,
    highestPoint,
  };
};
