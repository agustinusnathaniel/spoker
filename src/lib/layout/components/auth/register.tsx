'use client';

import {
  Button,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Grid,
  Heading,
} from '@chakra-ui/react';

import { useColorModeValue } from '~/lib/components/ui/color-mode';

import { SignInProviders } from './sign-in-providers';
import { contraBoxStyle } from './style';

interface RegisterProps {
  handleSwitchToLogin: () => void;
}

export const Register = ({ handleSwitchToLogin }: RegisterProps) => {
  const borderColor = useColorModeValue('#18191F', '#FFFFFF');

  return (
    <DialogContent as="form" {...contraBoxStyle(borderColor)}>
      <DialogHeader>
        <Heading bgClip="text" bgGradient="linear(to-br, teal.200, green.400)">
          Register
        </Heading>
      </DialogHeader>

      <DialogBody>
        <Grid gap={4}>
          <SignInProviders />
        </Grid>
      </DialogBody>

      <DialogFooter gap={2}>
        <Button
          fontWeight="normal"
          onClick={handleSwitchToLogin}
          variant="ghost"
        >
          Sign In
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
