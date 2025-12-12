import { Button, Container, Grid, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import {
  initialValues,
  resetPasswordFormValidationSchema,
} from '~/lib/models/reset-password';
import { requestPasswordReset } from '~/lib/services/firebase/auth/request-password-reset';
import { showSuccessToast } from '~/lib/services/firebase/utils';

export const ResetPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
      router.push('/').then(() => {
        showSuccessToast({
          title: 'Password Reset Requested',
          description: `Check your email (${email}) for the password reset link. If there's none, please check your spam folder.`,
          duration: 15000,
        });
      });
    });
    setIsLoading(false);
  };

  return (
    <Container
      paddingX={0}
      display="grid"
      gridGap={8}
      minHeight={{ base: '50vh', md: '60vh' }}
      alignItems="center"
    >
      <SpokerWrapperGrid
        gap={6}
        as="form"
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
          placeholder="e-mail address"
          type="email"
          isInvalid={!!errors.email?.message}
          errorText={errors.email?.message}
        />

        <Button
          type="submit"
          disabled={!(isDirty && isValid)}
          isLoading={isLoading}
        >
          Reset Password
        </Button>
      </SpokerWrapperGrid>
    </Container>
  );
};
