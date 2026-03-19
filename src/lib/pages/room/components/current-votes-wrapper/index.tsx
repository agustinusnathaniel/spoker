import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import type { HideLabelOptionsType } from '~/lib/constants/hide-label';
import { hideLabelOptions } from '~/lib/constants/hide-label';
import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { updateConfig } from '~/lib/services/firebase/room/update/room-config';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStore } from '~/lib/stores/room';
import type { RoomConfig } from '~/lib/types/raw-db';
import { pointOptions } from '~/lib/types/room';
import { RoleType } from '~/lib/types/user';

import { PointWrapper } from '../point-wrapper';
import { pointTextColor, pointTextSize } from '../utils';
import { useRoomPoint } from './hooks/use-room-point';
import { useVote } from './hooks/use-vote';

export const CurrentVotesWrapper = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const toast = useToast();
  const { currentUser } = useAuthStoreState();
  const config = useRoomStore(useShallow((state) => state.roomData?.config));
  const showVote = useRoomStore(useShallow((state) => state.showVote));
  const users = useRoomStore(useShallow((state) => state.users));
  const { isOwner, isObservant } = useUserRole();
  const { averagePoint, highestPoint } = useRoomPoint();
  const { handleFinishVote } = useVote();
  const [isLoadingSubmitVote, setIsLoadingSubmitVote] =
    useState<boolean>(false);
  const [estimate, setEstimate] = useState<number>(0);

  useEffect(() => {
    if (showVote) {
      setEstimate(highestPoint);
    }
  }, [highestPoint, showVote]);

  const showAveragePoint = useMemo(
    () => showVote && !Number.isNaN(averagePoint),
    [averagePoint, showVote]
  );

  const sortedParticipants = useMemo(
    () =>
      users
        .filter((user) =>
          ([RoleType.participant, RoleType.owner] as Array<RoleType>).includes(
            user.role
          )
        )
        .sort((a, b) => (showVote ? (b.point ?? 0) - (a.point ?? 0) : 0))
        .map((participant, participantIndex, participants) => (
          <Fragment key={participant.uid}>
            <Grid alignItems="center" templateColumns="2fr 1fr">
              <Heading size="sm">{participant.name}</Heading>
              <Text
                fontSize={
                  showVote ? pointTextSize(participant.point ?? 0) : undefined
                }
                textColor={
                  showVote ? pointTextColor(participant.point ?? 0) : undefined
                }
              >
                <PointWrapper
                  isCurrentUser={participant.uid === currentUser?.uid}
                  point={participant.point}
                  roomSelectedHideLabel={config?.hideLabel ?? 'monkey'}
                  showVote={showVote}
                />
              </Text>
            </Grid>
            {participantIndex !== participants.length - 1 && <Divider />}
          </Fragment>
        )),
    [currentUser?.uid, config?.hideLabel, showVote, users]
  );

  const handleUpdateFreezeAfterVote = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (isOwner) {
      const updatedConfig: Partial<RoomConfig> = {
        isFreezeAfterVote: e.currentTarget.checked,
      };
      await updateConfig(id as string, updatedConfig);
    } else {
      toast({
        title: 'Participant/observant cannot change configurations',
        status: 'warning',
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleUpdateHideLabel = async (
    selectedHideLabel: HideLabelOptionsType
  ) => {
    if (isOwner || isObservant) {
      const updatedConfig: Partial<RoomConfig> = {
        hideLabel: selectedHideLabel,
      };
      await updateConfig(id as string, updatedConfig);
    }
  };

  const handleSetEstimate = (e: ChangeEvent<HTMLSelectElement>) => {
    setEstimate(Number(e.target.value));
  };

  const handleFinishVoting = async () => {
    setIsLoadingSubmitVote(true);
    await handleFinishVote(estimate);
    setIsLoadingSubmitVote(false);
  };

  return (
    <SpokerWrapperGrid
      display="inline-block"
      gap={4}
      id={CURRENT_VOTE_WRAPPER_ID}
    >
      <Heading size="lg">Current Votes</Heading>

      <Checkbox
        colorScheme="teal"
        disabled={!isOwner}
        isChecked={config?.isFreezeAfterVote}
        marginY={4}
        onChange={handleUpdateFreezeAfterVote}
      >
        freeze after vote
      </Checkbox>

      {(isOwner || isObservant) && (
        <FormControl alignItems="center" display="flex">
          <FormLabel fontSize="sm" width="30%">
            Hide Label
          </FormLabel>
          <Select
            marginBottom={4}
            onChange={(e) =>
              handleUpdateHideLabel(e.target.value as HideLabelOptionsType)
            }
            value={config?.hideLabel ?? 'monkey'}
          >
            {hideLabelOptions.map((hideLabelOption) => (
              <Text as="option" key={hideLabelOption} value={hideLabelOption}>
                {hideLabelOption}
              </Text>
            ))}
          </Select>
        </FormControl>
      )}

      <Grid gap={2}>
        {showAveragePoint && <Text>average: {averagePoint}</Text>}
        {sortedParticipants}
      </Grid>

      {isOwner && showVote && (
        <Grid
          borderColor="orange"
          borderRadius={16}
          borderWidth={2}
          gap={4}
          marginTop={6}
          padding={2}
        >
          <Grid gap={2}>
            <Heading fontSize="md" fontStyle="italic">
              Final Estimate
            </Heading>
            <Text fontSize="xs">
              Select final estimate point and click finish vote to proceed to
              next story in queue.
            </Text>
          </Grid>

          <Grid gap={2} templateColumns="2fr 3fr">
            <Select
              borderRadius={12}
              borderWidth={2}
              fontWeight="bold"
              onChange={handleSetEstimate}
              value={estimate}
            >
              {pointOptions.map((point) => (
                <option key={point} value={point}>
                  {point}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="teal"
              disabled={isLoadingSubmitVote}
              isLoading={isLoadingSubmitVote}
              marginY={-1}
              onClick={handleFinishVoting}
              size="md"
            >
              Finish Vote
            </Button>
          </Grid>
        </Grid>
      )}
    </SpokerWrapperGrid>
  );
};
