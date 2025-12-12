import {
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { BiLink, BiShareAlt } from 'react-icons/bi';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { clearPoints } from '~/lib/services/firebase/room/update/point/clear';
import { useRoomStoreState } from '~/lib/stores/room';

export const ControllerWrapper = () => {
  const { users } = useRoomStoreState();
  const { isOwner } = useUserRole();
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const toast = useToast();

  const handleClearPoints = async () => {
    await clearPoints(id as string);
  };

  const handleCopyRoomLink = async () => {
    const roomLink = `${window.location.protocol}//${window.location.host}/join/${id}`;
    await navigator.clipboard.writeText(roomLink);

    toast({
      title: `Room Link Copied!\n${roomLink}`,
      status: 'success',
      isClosable: true,
      position: 'top',
    });
  };

  const currentUserList = React.useMemo(
    () =>
      users.map((user) => (
        <ListItem key={user.uid}>
          {user.name} - {user.role}
        </ListItem>
      )),
    [users],
  );

  return (
    <SpokerWrapperGrid gap={2}>
      <Heading size="md">Controller</Heading>

      <Flex gridGap={2} wrap="wrap">
        {isOwner && (
          <Button size="sm" colorScheme="red" onClick={handleClearPoints}>
            Reset
          </Button>
        )}
        <Button
          size="sm"
          colorScheme="orange"
          onClick={() => router.push(`/join/${id}`)}
        >
          Rejoin
        </Button>
      </Flex>

      <Box>
        <Button
          leftIcon={<BiShareAlt />}
          rightIcon={<BiLink />}
          colorScheme="blue"
          onClick={handleCopyRoomLink}
          size="sm"
        >
          Copy Invite Link
        </Button>
      </Box>

      <Flex wrap="wrap" gridGap={2}>
        <Heading size="sm">Current Users: </Heading>
        <OrderedList spacing={1}>{currentUserList}</OrderedList>
      </Flex>
    </SpokerWrapperGrid>
  );
};
