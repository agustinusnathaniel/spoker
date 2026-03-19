import { Button, Grid, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { useMemo, useState } from 'react';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';

export const JoinRoom = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>('');
  const isDisabled = useMemo(() => roomId.length === 0, [roomId.length]);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) =>
    setRoomId(e.target.value);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/join/${roomId}`);
    }
  };

  return (
    <SpokerWrapperGrid backgroundColor="cyan.600" color="white" gap={8}>
      <Heading size="lg">or Join the Party!</Heading>

      <Grid gap={4}>
        <SpokerInput
          _placeholder={{ color: 'cyan.400' }}
          label="Room ID"
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
          placeholder="quick-brown-fox"
          value={roomId}
        />
      </Grid>

      <Button
        alignSelf="flex-end"
        as={Link}
        href={isDisabled ? '#' : `/join/${roomId}`}
        isDisabled={isDisabled}
        style={{
          pointerEvents: isDisabled ? 'none' : 'auto',
        }}
      >
        Let Me in!
      </Button>
    </SpokerWrapperGrid>
  );
};
