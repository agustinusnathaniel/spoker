import { Button, Grid, Heading, useToast } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { createRoomFormSchema, initialValues } from '~/lib/models/hall';
import { createRoom } from '~/lib/services/firebase/room/create';
import { formatId } from '~/lib/utils/format-id';
import { removeFirebasePrefix } from '~/lib/utils/remove-firebase-prefix';

export const CreateRoom = () => {
  const toast = useToast();
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
        toast({
          position: 'top-right',
          title: 'Create Room Fail',
          description: removeFirebasePrefix(err.message),
          status: 'error',
          isClosable: true,
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
          isInvalid={!!errors.name?.message}
          placeholder="The Quick Brown Fox"
        />
        <SpokerInput
          label="Room ID"
          {...register('id')}
          errorText={errors.id?.message}
          isInvalid={!!errors.id?.message}
          placeholder="define your own room slug"
        />
      </Grid>

      <Button
        colorScheme="green"
        disabled={!(isDirty && isValid) || isLoading}
        isLoading={isLoading}
        type="submit"
      >
        Let&apos;s Have Some Fun!
      </Button>
    </SpokerWrapperGrid>
  );
};
