import { Button, Grid, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { loginWithGoogle } from '~/lib/services/firebase/auth/login/google';

export const SignInProviders = () => {
  const toast = useToast();

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: -
  useEffect(() => {
    return () => {
      toast.closeAll();
    };
  }, []);

  return (
    <Grid gap={2} textAlign="center">
      <Text>Sign In with:</Text>

      <Button
        leftIcon={<FcGoogle />}
        onClick={handleLoginWithGoogle}
        _hover={{ bgGradient: 'linear(to-r, blue.100, cyan.100)' }}
      >
        Google
      </Button>
    </Grid>
  );
};
