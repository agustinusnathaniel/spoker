'use client';

import { Button, Grid, Text } from '@chakra-ui/react';

import { loginWithGoogle } from '~/lib/services/firebase/auth/login/google';

export const SignInProviders = () => {
  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <Grid gap={2} textAlign="center">
      <Text>Sign In with:</Text>

      <Button
        _hover={{ bgGradient: 'linear(to-r, blue.100, cyan.100)' }}
        onClick={handleLoginWithGoogle}
      >
        Google
      </Button>
    </Grid>
  );
};
