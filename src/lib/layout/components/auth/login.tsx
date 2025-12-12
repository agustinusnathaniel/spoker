import {
  Button,
  Grid,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SpokerInput } from '~/lib/components/spoker-input';
import { initialValues, loginFormValidationSchema } from '~/lib/models/login';
import { loginUserWithEmailAndPassword } from '~/lib/services/firebase/auth/login/email-and-password';

import { ForgotPasswordButton } from './forgot-password-button';
import { SignInProviders } from './sign-in-providers';
import { contraBoxStyle } from './style';

type LoginProps = {
  handleSwitchToRegister: () => void;
};

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
      () => setIsLoading(false),
    );
  };

  return (
    <ModalContent
      as="form"
      {...contraBoxStyle(borderColor)}
      onSubmit={handleSubmit(processLogin)}
    >
      <ModalHeader>
        <Heading bgGradient="linear(to-br, teal.200, blue.600)" bgClip="text">
          Login
        </Heading>

        <ModalCloseButton />
      </ModalHeader>

      <ModalBody>
        <Grid gap={4}>
          <SignInProviders />

          <SpokerInput
            {...register('email')}
            label="email"
            isInvalid={!!errors.email?.message}
            errorText={errors.email?.message}
            placeholder="Your e-mail"
          />
          <SpokerInput
            {...register('password')}
            type="password"
            label="password"
            isInvalid={!!errors.password?.message}
            errorText={errors.password?.message}
            placeholder="Your password"
          />

          <ForgotPasswordButton />
        </Grid>
      </ModalBody>

      <ModalFooter gridGap={2}>
        <Button
          variant="ghost"
          fontWeight="normal"
          onClick={handleSwitchToRegister}
        >
          Register
        </Button>
        <Button
          type="submit"
          disabled={!(isDirty && isValid)}
          isLoading={isLoading}
          colorScheme="blue"
        >
          Sign In
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
