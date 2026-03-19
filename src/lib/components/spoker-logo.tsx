'use client';

import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const SpokerLogo = () => {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Flex alignItems="center" gap={{ base: 2, md: 4 }}>
        <Image alt="poker icon" src="/chip.svg" width={{ base: 8, md: 10 }} />
        <Box>
          <Heading as="h1" size={{ base: 'lg', md: 'xl' }}>
            spoker
          </Heading>
          <Text color="gray" fontSize={{ base: 'xs', md: 'sm' }}>
            Online Scrum Poker
          </Text>
        </Box>
      </Flex>
    </Link>
  );
};
