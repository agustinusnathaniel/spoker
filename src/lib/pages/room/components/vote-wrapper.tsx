'use client';

import { Flex, Heading, RadioGroup, Spacer } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { VoteRadioCard } from '~/lib/components/vote-radio-card';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { updatePoint } from '~/lib/services/firebase/room/update/point';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreState } from '~/lib/stores/room';
import { pointOptions } from '~/lib/types/room';

export const VoteWrapper = () => {
  const { currentUser } = useAuthStoreState();
  const { roomData, showVote } = useRoomStoreState();
  const { isOwner, isParticipant } = useUserRole();
  const params = useParams();
  const id = params?.id as string;
  const [selectedPoint, setSelectedPoint] = useState<string>(
    currentUser ? String(roomData?.users?.[currentUser.uid]?.point ?? '') : ''
  );

  const handleUpdatePoint = async (point: number) => {
    if (currentUser && !(roomData?.config.isFreezeAfterVote && showVote)) {
      await updatePoint({ uid: currentUser.uid, point, roomId: id });
      setSelectedPoint(String(point));
    }
  };

  if (!(isOwner || isParticipant)) {
    return null;
  }

  return (
    <SpokerWrapperGrid gap={4}>
      <Heading size="2xl">Vote!</Heading>

      <RadioGroup.Root
        disabled={roomData?.config.isFreezeAfterVote && showVote}
        onValueChange={(e) => handleUpdatePoint(Number(e.value))}
        value={selectedPoint}
      >
        <Flex gap={2} wrap="wrap">
          {pointOptions.map((voteOption) => (
            <VoteRadioCard key={voteOption} value={String(voteOption)}>
              {voteOption}
            </VoteRadioCard>
          ))}
        </Flex>
      </RadioGroup.Root>
      <Spacer />
    </SpokerWrapperGrid>
  );
};
