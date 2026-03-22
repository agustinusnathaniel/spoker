'use client';

import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const NotFoundPage = () => {
  return (
    <>
      <Box margin="0 auto" width={{ base: '100%', sm: '70%', md: '50%' }}>
        <Image alt="error-404" src="/404 Error-pana.svg" />
      </Box>
      <Text fontSize="xs" textAlign="center">
        <Link
          href="https://stories.freepik.com/web"
          rel="noopener noreferrer"
          target="_blank"
        >
          Illustration by Freepik Stories
        </Link>
      </Text>

      <Box marginY={4}>
        <Heading textAlign="center">Page not Found.</Heading>

        <Box marginTop={4} textAlign="center">
          <Text>It&apos;s Okay!</Text>

          <Button asChild>
            <Link href="/">Let&apos;s Head Back</Link>
          </Button>
        </Box>
      </Box>
    </>
  );
};
