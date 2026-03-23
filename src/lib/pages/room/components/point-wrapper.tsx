import { Text } from '@chakra-ui/react';
import { memo } from 'react';

import { Twemoji } from '~/lib/components/twemoji';
import type { HideLabelOptionsType } from '~/lib/constants/hide-label';
import { hideLabel } from '~/lib/constants/hide-label';

// ============================================================================
// Point Display Components
// ============================================================================

interface PointValueProps {
  point: number;
}

function PointValue({ point }: PointValueProps) {
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

interface HiddenPointProps {
  hasPoint: boolean;
  hideLabelType: HideLabelOptionsType;
}

function HiddenPoint({ hasPoint, hideLabelType }: HiddenPointProps) {
  if (hasPoint) {
    return <Twemoji emoji={hideLabel[hideLabelType].selected} />;
  }
  return <Twemoji emoji={hideLabel[hideLabelType].empty} />;
}

// ============================================================================
// Point Wrapper
// ============================================================================

interface PointWrapperProps {
  hideLabelType: HideLabelOptionsType;
  point?: number;
  /**
   * Whether the point value should be revealed
   * (true when vote is shown or for the current user's own vote)
   */
  reveal: boolean;
}

export const PointWrapper = memo(function PointWrapper({
  reveal,
  hideLabelType,
  point,
}: PointWrapperProps) {
  if (reveal) {
    return <PointValue point={point ?? 0} />;
  }

  const hasPoint = point !== undefined && point >= 0;
  return <HiddenPoint hasPoint={hasPoint} hideLabelType={hideLabelType} />;
});
