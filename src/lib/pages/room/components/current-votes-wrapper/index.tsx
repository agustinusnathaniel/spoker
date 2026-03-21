'use client';

import {
  Button,
  Checkbox,
  createListCollection,
  Field,
  Grid,
  Heading,
  NativeSelect,
  Portal,
  Select,
  Separator,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
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
  const params = useParams();
  const id = params?.id as string;
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
                color={
                  showVote ? pointTextColor(participant.point ?? 0) : undefined
                }
                fontSize={
                  showVote ? pointTextSize(participant.point ?? 0) : undefined
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
            {participantIndex !== participants.length - 1 && <Separator />}
          </Fragment>
        )),
    [currentUser?.uid, config?.hideLabel, showVote, users]
  );

  const handleUpdateHideLabel = async (
    selectedHideLabel: HideLabelOptionsType
  ) => {
    if (isOwner || isObservant) {
      const updatedConfig: Partial<RoomConfig> = {
        hideLabel: selectedHideLabel,
      };
      await updateConfig(id, updatedConfig);
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
      <Heading size="2xl">Current Votes</Heading>

      <Checkbox.Root
        checked={config?.isFreezeAfterVote}
        colorPalette="teal"
        disabled={!isOwner}
        marginY={4}
        onCheckedChange={(e) => {
          if (isOwner) {
            const updatedConfig: Partial<RoomConfig> = {
              isFreezeAfterVote: !!e.checked,
            };
            updateConfig(id, updatedConfig);
          }
        }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>freeze after vote</Checkbox.Label>
      </Checkbox.Root>

      {(isOwner || isObservant) && (
        <Field.Root>
          <Select.Root
            collection={createListCollection({ items: hideLabelOptions })}
            marginBottom={4}
            onValueChange={(detail) =>
              handleUpdateHideLabel(detail.value[0] as HideLabelOptionsType)
            }
            value={[config?.hideLabel ?? 'monkey']}
          >
            <Select.HiddenSelect />
            <Select.Label fontSize="sm">Hide Label</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select hide label" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {hideLabelOptions.map((hideLabelOption) => (
                    <Select.Item item={hideLabelOption} key={hideLabelOption}>
                      {hideLabelOption}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Field.Root>
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
            <NativeSelect.Root
              borderRadius={12}
              borderWidth={2}
              fontWeight="bold"
            >
              <NativeSelect.Field onChange={handleSetEstimate} value={estimate}>
                {pointOptions.map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Button
              colorPalette="teal"
              disabled={isLoadingSubmitVote}
              loading={isLoadingSubmitVote}
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
