'use client';

import { Button, Grid, Text } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa6';

import { loginWithGoogle } from '~/lib/services/firebase/auth/login/google';

export const SignInProviders = () => {
  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <Grid gap={2} textAlign="center">
      <Text>Sign In with:</Text>

      <Button
        _hover={{
          bgGradient: 'to-br',
          gradientFrom: { _dark: 'white', _light: 'gray.subtle' },
          gradientTo: { _dark: 'blue.subtle', _light: 'blue.solid' },
        }}
        onClick={handleLoginWithGoogle}
      >
        <FaGoogle />
        Google
      </Button>
    </Grid>
  );
};
