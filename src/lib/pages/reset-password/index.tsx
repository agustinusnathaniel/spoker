'use client';

import { Button, Container, Grid, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { toaster } from '~/lib/components/ui/toaster';
import {
  initialValues,
  resetPasswordFormValidationSchema,
} from '~/lib/models/reset-password';
import { requestPasswordReset } from '~/lib/services/firebase/auth/request-password-reset';

export const ResetPassword = () => {
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
    resolver: zodResolver(resetPasswordFormValidationSchema),
  });

  const handleRequestResetPassword = async () => {
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    const { email } = getValues();
    await requestPasswordReset(email, () => {
      router.push('/');
      toaster.create({
        title: 'Password Reset Requested',
        description: `Check your email (${email}) for the password reset link. If there's none, please check your spam folder.`,
        duration: 15_000,
        type: 'success',
      });
    });
    setIsLoading(false);
  };

  return (
    <Container
      alignItems="center"
      display="grid"
      gap={8}
      minHeight={{ base: '50vh', md: '60vh' }}
      paddingX={0}
    >
      <SpokerWrapperGrid
        as="form"
        gap={6}
        onSubmit={handleSubmit(handleRequestResetPassword)}
      >
        <Grid gap={2}>
          <Heading size="lg">Reset your password</Heading>
          <Text color="gray">
            Enter your registered email address and we will send you a password
            reset link.
          </Text>
        </Grid>

        <SpokerInput
          {...register('email')}
          errorText={errors.email?.message}
          invalid={!!errors.email?.message}
          placeholder="e-mail address"
          type="email"
        />

        <Button
          disabled={!(isDirty && isValid)}
          loading={isLoading}
          type="submit"
        >
          Reset Password
        </Button>
      </SpokerWrapperGrid>
    </Container>
  );
};
