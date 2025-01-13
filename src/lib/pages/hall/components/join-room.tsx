import { Button, Grid, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler } from 'react';
import * as React from 'react';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';

export const JoinRoom = () => {
  const router = useRouter();
  const [roomId, setRoomId] = React.useState<string>('');
  const isDisabled = React.useMemo(() => roomId.length === 0, [roomId.length]);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) =>
    setRoomId(e.target.value);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/join/${roomId}`);
    }
  };

  return (
    <SpokerWrapperGrid gap={8} backgroundColor="cyan.600" color="white">
      <Heading size="lg">or Join the Party!</Heading>

      <Grid gap={4}>
        <SpokerInput
          label="Room ID"
          value={roomId}
          onChange={handleChangeInput}
          placeholder="quick-brown-fox"
          _placeholder={{ color: 'cyan.400' }}
          onKeyDown={handleKeyDown}
        />
      </Grid>

      <Button
        as={Link}
        href={!isDisabled ? `/join/${roomId}` : '#'}
        isDisabled={isDisabled}
        alignSelf="flex-end"
        style={{
          pointerEvents: isDisabled ? 'none' : 'auto',
        }}
      >
        Let Me in!
      </Button>
    </SpokerWrapperGrid>
  );
};
