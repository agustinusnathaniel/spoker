import {
  Box,
  Button,
  Link as ChakraLink,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';

export const Page404 = () => {
  return (
    <>
      <Box width={{ base: '100%', sm: '70%', md: '50%' }} margin="0 auto">
        <Image src="/404 Error-pana.svg" alt="error-404" />
      </Box>
      <Text textAlign="center" fontSize="xs">
        <ChakraLink href="https://stories.freepik.com/web" isExternal>
          Illustration by Freepik Stories
        </ChakraLink>
      </Text>

      <Box marginY={4}>
        <Heading textAlign="center">Page not Found.</Heading>

        <Box textAlign="center" marginTop={4}>
          <Text>It&apos;s Okay!</Text>

          <Button as={Link} href="/">
            Let&apos;s Head Back
          </Button>
        </Box>
      </Box>
    </>
  );
};
