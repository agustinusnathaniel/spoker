import type { LayoutProps } from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';

import { SpokerLoading } from '~/lib/components/spoker-loading';

interface FullScreenLoadingProps {
  height?: LayoutProps['height'];
}

export const FullScreenLoading = ({ height }: FullScreenLoadingProps) => {
  return (
    <Grid height={height ?? '75vh'}>
      <SpokerLoading />
    </Grid>
  );
};
