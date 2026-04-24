'use client';

import { Box, Spinner, Text } from '@chakra-ui/react';

export const SpokerLoading = () => (
  <Box alignItems="center" gap={2} margin="auto" textAlign="center">
    <Spinner marginX="auto" size="xl" />
    <Text fontSize="lg">Loading...</Text>
  </Box>
);
