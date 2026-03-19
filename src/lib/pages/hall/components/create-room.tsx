'use client';

import { Button, Grid, Heading } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { toaster } from '~/lib/components/ui/toaster';
import { createRoomFormSchema, initialValues } from '~/lib/models/hall';
import { createRoom } from '~/lib/services/firebase/room/create';
import { formatId } from '~/lib/utils/format-id';
import { removeFirebasePrefix } from '~/lib/utils/remove-firebase-prefix';

export const CreateRoom = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: zodResolver(createRoomFormSchema),
  });

  const processCreateRoom = async () => {
    setIsLoading(true);
    const values = getValues();
    values.id = formatId(values.id);
    await createRoom(values)
      .then(() => {
        router.push(`/join/${values.id}`);
      })
      .catch((err: Error) => {
        toaster.create({
          title: 'Create Room Fail',
          description: removeFirebasePrefix(err.message),
          type: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SpokerWrapperGrid
      as="form"
      gap={8}
      onSubmit={handleSubmit(processCreateRoom)}
    >
      <Heading size="lg">Create Room</Heading>

      <Grid gap={4}>
        <SpokerInput
          label="Room Name"
          {...register('name')}
          errorText={errors.name?.message}
          invalid={!!errors.name?.message}
          placeholder="The Quick Brown Fox"
        />
        <SpokerInput
          label="Room ID"
          {...register('id')}
          errorText={errors.id?.message}
          invalid={!!errors.id?.message}
          placeholder="define your own room slug"
        />
      </Grid>

      <Button
        colorPalette="green"
        disabled={!(isDirty && isValid) || isLoading}
        loading={isLoading}
        type="submit"
      >
        Let&apos;s Have Some Fun!
      </Button>
    </SpokerWrapperGrid>
  );
};
