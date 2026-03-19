'use client';

import { Grid } from '@chakra-ui/react';

import { SpokerLoading } from '~/lib/components/spoker-loading';

interface FullScreenLoadingProps {
  height?: string;
}

export const FullScreenLoading = ({ height }: FullScreenLoadingProps) => {
  return (
    <Grid height={height ?? '75vh'}>
      <SpokerLoading />
    </Grid>
  );
};
