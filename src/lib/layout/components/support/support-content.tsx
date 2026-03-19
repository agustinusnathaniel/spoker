import { Button, Grid, Link, Text } from '@chakra-ui/react';

import { sponsorLinks } from './constants';

export const SupportContent = () => {
  return (
    <Grid gap={4}>
      <Text>Support this project</Text>

      <Grid gap={2} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {sponsorLinks.map((sponsorLink) => (
          <Button
            as={Link}
            colorScheme={sponsorLink.colorScheme}
            flexDirection="column"
            fontSize={{ base: 'sm', md: 'md' }}
            href={sponsorLink.url}
            isExternal
            key={sponsorLink.label}
            leftIcon={sponsorLink.icon}
          >
            <Text>{sponsorLink.label}</Text>
            {sponsorLink.description && (
              <Text fontSize="xs">{sponsorLink.description}</Text>
            )}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
};
