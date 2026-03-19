'use client';

import { Box, Grid } from '@chakra-ui/react';

import { SpokerLoading } from '~/lib/components/spoker-loading';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreState } from '~/lib/stores/room';

import { ControllerWrapper } from './components/controller-wrapper';
import { CurrentVotesWrapper } from './components/current-votes-wrapper';
import { RoomHeader } from './components/header';
import { TaskList } from './components/task-list';
import { VoteWrapper } from './components/vote-wrapper';
import { useRoomListener } from './hooks/use-room-listener';
import { useVoteListener } from './hooks/use-vote-listener';

export const RoomPage = () => {
  const { currentUser } = useAuthStoreState();
  const { isBusy, roomData } = useRoomStoreState();

  useRoomListener();
  useVoteListener();

  if (isBusy) {
    return <SpokerLoading />;
  }

  if (currentUser && roomData) {
    return (
      <Grid gap={8}>
        <Grid
          alignItems="start"
          gap={6}
          templateColumns={{ base: '1fr', md: '3fr 2fr' }}
        >
          <Grid gap={6}>
            <RoomHeader />
            <VoteWrapper />
          </Grid>

          <Grid gap={6}>
            <CurrentVotesWrapper />
            <ControllerWrapper />
          </Grid>
        </Grid>

        <TaskList />
      </Grid>
    );
  }

  return <Box>Error</Box>;
};
