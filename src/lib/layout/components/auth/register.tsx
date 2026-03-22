'use client';

import { Button, Dialog, Grid, Heading } from '@chakra-ui/react';

import { useColorModeValue } from '~/lib/components/ui/color-mode';

import { SignInProviders } from './sign-in-providers';
import { contraBoxStyle } from './style';

interface RegisterProps {
  handleSwitchToLogin: () => void;
}

export const Register = ({ handleSwitchToLogin }: RegisterProps) => {
  const borderColor = useColorModeValue('#18191F', '#FFFFFF');

  return (
    <Dialog.Content as="form" {...contraBoxStyle(borderColor)}>
      <Dialog.Header>
        <Heading
          bgClip="text"
          bgGradient="to-br"
          gradientFrom="teal.200"
          gradientTo="green.400"
        >
          Register
        </Heading>
      </Dialog.Header>

      <Dialog.Body>
        <Grid gap={4}>
          <SignInProviders />
        </Grid>
      </Dialog.Body>

      <Dialog.Footer gap={2}>
        <Button
          fontWeight="normal"
          onClick={handleSwitchToLogin}
          variant="ghost"
        >
          Sign In
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
};
