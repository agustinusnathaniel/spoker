'use client';

import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Grid,
  Heading,
} from '@chakra-ui/react';
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
    <DialogContent
      as="form"
      {...contraBoxStyle(borderColor)}
      onSubmit={handleSubmit(processLogin)}
    >
      <DialogHeader>
        <Heading bgClip="text" bgGradient="linear(to-br, teal.200, blue.600)">
          Login
        </Heading>

        <DialogCloseTrigger />
      </DialogHeader>

      <DialogBody>
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
      </DialogBody>

      <DialogFooter gap={2}>
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
      </DialogFooter>
    </DialogContent>
  );
};
