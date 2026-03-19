'use client';

import type { GridProps } from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';

import { useColorModeValue } from '~/lib/components/ui/color-mode';

import { contraGridStyle } from './style';

type SpokerWrapperGridProps = GridProps;

export const SpokerWrapperGrid = ({
  children,
  ...props
}: SpokerWrapperGridProps) => {
  const backgroundColor = useColorModeValue(undefined, 'gray.500');

  return (
    <Grid {...contraGridStyle} backgroundColor={backgroundColor} {...props}>
      {children}
    </Grid>
  );
};
