import {
  Button,
  Grid,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from '@chakra-ui/react';

import { SignInProviders } from './sign-in-providers';
import { contraBoxStyle } from './style';

interface RegisterProps {
  handleSwitchToLogin: () => void;
}

export const Register = ({ handleSwitchToLogin }: RegisterProps) => {
  const borderColor = useColorModeValue('#18191F', '#FFFFFF');

  return (
    <ModalContent as="form" {...contraBoxStyle(borderColor)}>
      <ModalHeader>
        <Heading bgClip="text" bgGradient="linear(to-br, teal.200, green.400)">
          Register
        </Heading>
      </ModalHeader>

      <ModalBody>
        <Grid gap={4}>
          <SignInProviders />
        </Grid>
      </ModalBody>

      <ModalFooter gridGap={2}>
        <Button
          fontWeight="normal"
          onClick={handleSwitchToLogin}
          variant="ghost"
        >
          Sign In
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
