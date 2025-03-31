import { Grid, Heading } from '@chakra-ui/react';

import { useAuthStoreState } from '~/lib/stores/auth';

import { CreateRoom } from './create-room';
import { JoinRoom } from './join-room';

export const HallWrapper = () => {
  const { displayName } = useAuthStoreState();

  return (
    <Grid gap={12}>
      <Heading>Hello, {displayName}</Heading>
      <Grid templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']} gap={12}>
        <CreateRoom />
        <JoinRoom />
      </Grid>
    </Grid>
  );
};
