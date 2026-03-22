'use client';

import { Button, Container, Grid, Heading, RadioGroup } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { SpokerLoading } from '~/lib/components/spoker-loading';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { toaster } from '~/lib/components/ui/toaster';
import { VoteRadioCard } from '~/lib/components/vote-radio-card';
import { getRoom } from '~/lib/services/firebase/room/get';
import { joinRoom } from '~/lib/services/firebase/room/join';
import { RoleType, roleOptions } from '~/lib/types/user';

export const JoinRoom = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [role, setRole] = useState<RoleType>(RoleType.participant);
  const [busy, setBusy] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');

  const getRoomData = React.useCallback(async () => {
    if (!id) {
      return;
    }
    const roomData = await getRoom(id);
    if (roomData) {
      setRoomName(roomData.room.name);
      setBusy(false);
    } else {
      toaster.create({
        title: 'Room Not Exist',
        type: 'error',
      });
      router.push('/');
    }
  }, [id, router]);

  const handleJoin = async () => {
    setIsLoading(true);
    await joinRoom(id, role).then(() => {
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
        <Heading size="4xl">Welcome 🎉</Heading>

        <Heading size="xl">{roomName}</Heading>

        <Grid gap={2}>
          <Heading size="lg">Pick your role:</Heading>

          <RadioGroup.Root
            onValueChange={(e) => setRole(e.value as RoleType)}
            value={role}
          >
            <Grid
              gap={2}
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              {roleOptions.map((roleOption) => (
                <VoteRadioCard key={roleOption} value={roleOption}>
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </VoteRadioCard>
              ))}
            </Grid>
          </RadioGroup.Root>
        </Grid>

        <Button colorPalette="blue" loading={isLoading} onClick={handleJoin}>
          Let&apos;s Go!
        </Button>
      </SpokerWrapperGrid>
    </Container>
  );
};
