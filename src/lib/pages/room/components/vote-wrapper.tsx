import { Flex, Heading, Spacer, useRadioGroup } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { SpokerRadioBox } from '~/lib/components/spoker-radio-box';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { updatePoint } from '~/lib/services/firebase/room/update/point';
import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreState } from '~/lib/stores/room';
import { pointOptions } from '~/lib/types/room';

export const VoteWrapper = () => {
  const { currentUser } = useAuthStoreState();
  const { roomData, showVote } = useRoomStoreState();
  const { isOwner, isParticipant } = useUserRole();
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const handleUpdatePoint = async (point: number) => {
    if (currentUser && !(roomData?.config.isFreezeAfterVote && showVote)) {
      await updatePoint({ uid: currentUser.uid, point, roomId: id as string });
    }
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'vote',
    value: currentUser
      ? String(roomData?.users?.[currentUser.uid]?.point)
      : undefined,
    onChange: async (value) => {
      await handleUpdatePoint(Number(value));
    },
  });
  const voteOptionGroup = getRootProps();

  if (!(isOwner || isParticipant)) {
    return null;
  }

  return (
    <SpokerWrapperGrid gap={4}>
      <Heading size="lg">Vote!</Heading>

      <Flex wrap="wrap" gridGap={2} {...voteOptionGroup}>
        {pointOptions.map((voteOption) => {
          const radio = getRadioProps({ value: voteOption });

          return (
            <SpokerRadioBox key={voteOption} {...radio}>
              {voteOption}
            </SpokerRadioBox>
          );
        })}
      </Flex>
      <Spacer />
    </SpokerWrapperGrid>
  );
};
