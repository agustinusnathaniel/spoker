import {
  Button,
  Container,
  Grid,
  Heading,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { SpokerLoading } from '~/lib/components/spoker-loading';
import { SpokerRadioBox } from '~/lib/components/spoker-radio-box';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { getRoom } from '~/lib/services/firebase/room/get';
import { joinRoom } from '~/lib/services/firebase/room/join';
import { RoleType, roleOptions } from '~/lib/types/user';

export const JoinRoomPage = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    query: { id },
  } = router;
  const [role, setRole] = useState<RoleType>(RoleType.participant);
  const [busy, setBusy] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'role',
    defaultValue: role,
    onChange: (value) => setRole(value as RoleType),
  });
  const group = getRootProps();

  const getRoomData = React.useCallback(async () => {
    if (!id) {
      return;
    }
    const roomData = await getRoom(id as string);
    if (roomData) {
      setRoomName(roomData.room.name);
      setBusy(false);
    } else {
      toast({
        title: 'Room Not Exist',
        status: 'error',
        position: 'top',
      });
      router.push('/');
    }
  }, [id, router, toast]);

  const handleJoin = async () => {
    setIsLoading(true);
    await joinRoom(id as string, role).then(() => {
      router.push(`/room/${id}`);
    });
  };

  useEffect(() => {
    getRoomData();
  }, [getRoomData]);

  if (busy) {
    return <SpokerLoading />;
  }

  return (
    <Container paddingX={0}>
      <SpokerWrapperGrid gap={8}>
        <Heading>Welcome 🎉</Heading>

        <Heading size="md">{roomName}</Heading>

        <Grid gap={2}>
          <Heading size="sm">Pick your role:</Heading>

          <Grid
            {...group}
            gap={2}
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            {roleOptions.map((roleOption) => {
              const radio = getRadioProps({ value: roleOption });

              return (
                <SpokerRadioBox key={roleOption} {...radio}>
                  {roleOption}
                </SpokerRadioBox>
              );
            })}
          </Grid>
        </Grid>

        <Button colorScheme="blue" isLoading={isLoading} onClick={handleJoin}>
          Let&apos;s Go!
        </Button>
      </SpokerWrapperGrid>
    </Container>
  );
};
