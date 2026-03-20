'use client';

import { Grid, Heading } from '@chakra-ui/react';

import { useAuthStoreState } from '~/lib/stores/auth';

import { CreateRoom } from './create-room';
import { JoinRoom } from './join-room';

export const HallWrapper = () => {
  const { displayName } = useAuthStoreState();

  return (
    <Grid gap={12}>
      <Heading size="4xl">Hello, {displayName}</Heading>
      <Grid
        gap={12}
        templateColumns={{ base: '1fr', md: '1fr', lg: 'repeat(2, 1fr)' }}
      >
        <CreateRoom />
        <JoinRoom />
      </Grid>
    </Grid>
  );
};
