'use client';

import { Box, Button, Flex, Heading, List } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { BiLink, BiShareAlt } from 'react-icons/bi';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { toaster } from '~/lib/components/ui/toaster';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { clearPoints } from '~/lib/services/firebase/room/update/point/clear';
import { useRoomStoreState } from '~/lib/stores/room';

export const ControllerWrapper = () => {
  const { users } = useRoomStoreState();
  const { isOwner } = useUserRole();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const handleClearPoints = async () => {
    await clearPoints(id);
  };

  const handleCopyRoomLink = async () => {
    const roomLink = `${window.location.protocol}//${window.location.host}/join/${id}`;
    await navigator.clipboard.writeText(roomLink);

    toaster.create({
      title: `Room Link Copied!\n${roomLink}`,
      type: 'success',
    });
  };

  const currentUserList = useMemo(
    () =>
      users.map((user) => (
        <List.Item key={user.uid}>
          {user.name} - {user.role}
        </List.Item>
      )),
    [users]
  );

  return (
    <SpokerWrapperGrid gap={2}>
      <Heading size="xl">Controller</Heading>

      <Flex gap={2} wrap="wrap">
        {isOwner && (
          <Button colorPalette="red" onClick={handleClearPoints} size="sm">
            Reset
          </Button>
        )}
        <Button
          colorPalette="orange"
          onClick={() => router.push(`/join/${id}`)}
          size="sm"
        >
          Rejoin
        </Button>
      </Flex>

      <Box>
        <Button colorPalette="blue" onClick={handleCopyRoomLink} size="sm">
          <BiShareAlt />
          Copy Invite Link
          <BiLink />
        </Button>
      </Box>

      <Flex gap={2} wrap="wrap">
        <Heading size="sm">Current Users: </Heading>
        <List.Root gap={1}>{currentUserList}</List.Root>
      </Flex>
    </SpokerWrapperGrid>
  );
};
