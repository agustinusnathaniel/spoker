'use client';

import { Badge, Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useColorModeValue } from '~/lib/components/ui/color-mode';

import {
  type ChangelogEntry,
  entries,
} from '../../../../content/changelog/entries';

const TAG_LABELS: Record<ChangelogEntry['tag'], string> = {
  fixed: 'Fixed',
  improved: 'Improved',
  new: 'New',
};

const TAG_COLOR: Record<ChangelogEntry['tag'], string> = {
  fixed: 'orange',
  improved: 'blue',
  new: 'green',
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const ChangelogPage = () => {
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const versionColor = useColorModeValue('gray.500', 'gray.300');

  return (
    <Grid gap={8}>
      <Grid gap={2}>
        <Heading fontWeight="extrabold" size="4xl">
          Changelog
        </Heading>
        <Text color={subtitleColor} fontSize="lg">
          What&apos;s new in spoker
        </Text>
      </Grid>

      <Grid gap={6}>
        {entries.map((entry) => (
          <SpokerWrapperGrid gap={0} key={entry.slug} padding={0}>
            <Grid gap={4} padding={6}>
              <Flex alignItems="center" gap={3} wrap="wrap">
                <Badge colorPalette={TAG_COLOR[entry.tag]} size="lg">
                  {TAG_LABELS[entry.tag]}
                </Badge>
                <Text color={versionColor} fontSize="sm">
                  v{entry.version} {' · '}
                  {formatDate(entry.date)}
                </Text>
              </Flex>

              <Heading size="xl">{entry.title}</Heading>

              <Box
                _dark={{ color: 'gray.300' }}
                color="gray.600"
                css={{
                  '& h3': {
                    fontWeight: 600,
                    fontSize: 'md',
                    marginTop: 4,
                    marginBottom: 2,
                  },
                  '& ul': {
                    listStyleType: 'disc',
                    paddingLeft: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  },
                  '& li': {
                    fontSize: 'sm',
                  },
                  '& strong': {
                    color: 'foreground',
                  },
                }}
              >
                <entry.content />
              </Box>
            </Grid>
          </SpokerWrapperGrid>
        ))}
      </Grid>
    </Grid>
  );
};
