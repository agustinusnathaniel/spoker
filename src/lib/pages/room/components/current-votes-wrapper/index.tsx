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
import * as React from 'react';

import { PointWrapper } from '../point-wrapper';
import { pointTextColor, pointTextSize } from '../utils';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import type { HideLabelOptionsType } from '~/lib/constants/hide-label';
import { hideLabelOptions } from '~/lib/constants/hide-label';
import { CURRENT_VOTE_WRAPPER_ID } from '~/lib/constants/wrapperkeys';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { updateConfig } from '~/lib/services/firebase/room/update/room-config';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreState } from '~/lib/stores/room';
import type { RoomConfig } from '~/lib/types/raw-db';
import { pointOptions } from '~/lib/types/room';
import { RoleType } from '~/lib/types/user';

import { useRoomPoint } from './hooks/use-room-point';
import { useVote } from './hooks/use-vote';

export const CurrentVotesWrapper = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const toast = useToast();
  const { currentUser } = useAuthStoreState();
  const { roomData, showVote, users } = useRoomStoreState();
  const config = roomData?.config;
  const { isOwner, isObservant } = useUserRole();
  const { averagePoint, highestPoint } = useRoomPoint();
  const { handleFinishVote } = useVote();
  const [isLoadingSubmitVote, setIsLoadingSubmitVote] =
    React.useState<boolean>(false);
  const [estimate, setEstimate] = React.useState<number>(0);

  React.useEffect(() => {
    if (showVote) {
      setEstimate(highestPoint);
    }
  }, [highestPoint, showVote]);

  const showAveragePoint = React.useMemo(
    () => showVote && !Number.isNaN(averagePoint),
    [averagePoint, showVote]
  );

  const sortedParticipants = React.useMemo(
    () =>
      users
        .filter((user) =>
          [RoleType.participant, RoleType.owner].includes(user.role)
        )
        .sort((a, b) => (showVote ? (b.point ?? 0) - (a.point ?? 0) : 0))
        .map((participant, participantIndex, participants) => (
          <React.Fragment key={participant.uid}>
            <Grid templateColumns="2fr 1fr" alignItems="center">
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
                  showVote={showVote}
                  roomSelectedHideLabel={config?.hideLabel ?? 'monkey'}
                  isCurrentUser={participant.uid === currentUser?.uid}
                  point={participant.point}
                />
              </Text>
            </Grid>
            {participantIndex !== participants.length - 1 && <Divider />}
          </React.Fragment>
        )),
    [currentUser?.uid, config?.hideLabel, showVote, users]
  );

  const handleUpdateFreezeAfterVote = async (
    e: React.ChangeEvent<HTMLInputElement>
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

  const handleSetEstimate = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        disabled={!isOwner}
        isChecked={config?.isFreezeAfterVote}
        onChange={handleUpdateFreezeAfterVote}
        colorScheme="teal"
        marginY={4}
      >
        freeze after vote
      </Checkbox>

      {(isOwner || isObservant) && (
        <FormControl display="flex" alignItems="center">
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
              <Text as="option" value={hideLabelOption} key={hideLabelOption}>
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
          marginTop={6}
          gap={4}
          padding={2}
          borderColor="orange"
          borderWidth={2}
          borderRadius={16}
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
              value={estimate}
              onChange={handleSetEstimate}
              fontWeight="bold"
            >
              {pointOptions.map((point) => (
                <option value={point} key={point}>
                  {point}
                </option>
              ))}
            </Select>
            <Button
              isLoading={isLoadingSubmitVote}
              disabled={isLoadingSubmitVote}
              colorScheme="teal"
              size="md"
              onClick={handleFinishVoting}
              marginY={-1}
            >
              Finish Vote
            </Button>
          </Grid>
        </Grid>
      )}
    </SpokerWrapperGrid>
  );
};
