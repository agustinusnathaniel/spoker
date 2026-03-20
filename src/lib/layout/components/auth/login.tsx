'use client';

import { Button, Dialog, Grid, Heading } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { useColorModeValue } from '~/lib/components/ui/color-mode';
import { initialValues, loginFormValidationSchema } from '~/lib/models/login';
import { loginUserWithEmailAndPassword } from '~/lib/services/firebase/auth/login/email-and-password';

import { ForgotPasswordButton } from './forgot-password-button';
import { SignInProviders } from './sign-in-providers';
import { contraBoxStyle } from './style';

interface LoginProps {
  handleSwitchToRegister: () => void;
}

export const Login = ({ handleSwitchToRegister }: LoginProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const borderColor = useColorModeValue('#18191F', '#FFFFFF');

  const {
    register,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: zodResolver(loginFormValidationSchema),
  });

  const processLogin = async () => {
    setIsLoading(true);
    const values = getValues();
    await loginUserWithEmailAndPassword(values.email, values.password).finally(
      () => setIsLoading(false)
    );
  };

  return (
    <Dialog.Content
      as="form"
      {...contraBoxStyle(borderColor)}
      onSubmit={handleSubmit(processLogin)}
    >
      <Dialog.Header>
        <Heading
          bgClip="text"
          bgGradient="to-br"
          gradientFrom="teal.200"
          gradientTo="blue.600"
        >
          Login
        </Heading>

        <Dialog.CloseTrigger />
      </Dialog.Header>

      <Dialog.Body>
        <Grid gap={4}>
          <SignInProviders />

          <SpokerInput
            {...register('email')}
            errorText={errors.email?.message}
            invalid={!!errors.email?.message}
            label="email"
            placeholder="Your e-mail"
          />
          <SpokerInput
            {...register('password')}
            errorText={errors.password?.message}
            invalid={!!errors.password?.message}
            label="password"
            placeholder="Your password"
            type="password"
          />

          <ForgotPasswordButton />
        </Grid>
      </Dialog.Body>

      <Dialog.Footer gap={2}>
        <Button
          fontWeight="normal"
          onClick={handleSwitchToRegister}
          variant="ghost"
        >
          Register
        </Button>
        <Button
          colorPalette="blue"
          disabled={!(isDirty && isValid)}
          loading={isLoading}
          type="submit"
        >
          Sign In
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
};
