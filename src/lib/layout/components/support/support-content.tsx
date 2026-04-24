'use client';

import { Button, Grid, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { sponsorLinks } from './constants';

export const SupportContent = () => (
  <Grid gap={4}>
    <Text>Support this project</Text>

    <Grid gap={2} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
      {sponsorLinks.map((sponsorLink) => (
        <Button
          asChild
          colorPalette={sponsorLink.colorScheme}
          flexDirection="column"
          fontSize={{ base: 'sm', md: 'md' }}
          key={sponsorLink.label}
        >
          <Link
            href={sponsorLink.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {sponsorLink.icon}
            <Text>{sponsorLink.label}</Text>
            {sponsorLink.description && (
              <Text fontSize="xs">{sponsorLink.description}</Text>
            )}
          </Link>
        </Button>
      ))}
    </Grid>
  </Grid>
);
