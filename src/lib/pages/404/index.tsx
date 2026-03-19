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
      <Box margin="0 auto" width={{ base: '100%', sm: '70%', md: '50%' }}>
        <Image alt="error-404" src="/404 Error-pana.svg" />
      </Box>
      <Text fontSize="xs" textAlign="center">
        <ChakraLink href="https://stories.freepik.com/web" isExternal>
          Illustration by Freepik Stories
        </ChakraLink>
      </Text>

      <Box marginY={4}>
        <Heading textAlign="center">Page not Found.</Heading>

        <Box marginTop={4} textAlign="center">
          <Text>It&apos;s Okay!</Text>

          <Button as={Link} href="/">
            Let&apos;s Head Back
          </Button>
        </Box>
      </Box>
    </>
  );
};
