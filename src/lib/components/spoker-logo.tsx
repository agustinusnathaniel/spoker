import {
  Box,
  Link as ChakraLink,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';

export const SpokerLogo = () => {
  return (
    <ChakraLink as={Link} href="/" _hover={undefined}>
      <Flex alignItems="center" gridGap={{ base: 2, md: 4 }}>
        <Image src="/chip.svg" alt="poker icon" width={{ base: 8, md: 10 }} />
        <Box>
          <Heading as="h1" size={{ base: 'sm', md: 'md' }}>
            spoker
          </Heading>
          <Text color="gray" fontSize={{ base: 'xs', md: 'sm' }}>
            Online Scrum Poker
          </Text>
        </Box>
      </Flex>
    </ChakraLink>
  );
};
