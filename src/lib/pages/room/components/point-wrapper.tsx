import { Text } from '@chakra-ui/react';
import { memo } from 'react';

import { Twemoji } from '~/lib/components/twemoji';
import type { HideLabelOptionsType } from '~/lib/constants/hide-label';
import { hideLabel } from '~/lib/constants/hide-label';

interface PointWrapperProps {
  isCurrentUser: boolean;
  point?: number;
  roomSelectedHideLabel: HideLabelOptionsType;
  showVote: boolean;
}

export const PointWrapper = memo(
  ({
    showVote,
    roomSelectedHideLabel,
    isCurrentUser,
    point,
  }: PointWrapperProps) => {
    if (showVote || isCurrentUser) {
      return (
        <Text
          as="span"
          display="inline-block"
          minWidth="1.875rem"
          textAlign="center"
        >
          {point}
        </Text>
      );
    }
    if (point || point === 0) {
      return <Twemoji emoji={hideLabel[roomSelectedHideLabel].selected} />;
    }
    return <Twemoji emoji={hideLabel[roomSelectedHideLabel].empty} />;
  }
);

PointWrapper.displayName = 'PointWrapper';
