import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { RiGithubFill } from 'react-icons/ri';

import { SpokerLogo } from '~/lib/components/spoker-logo';
import { packageInfo } from '~/lib/constants/package-info';
import { EVENT_TYPE_LINK } from '~/lib/constants/tracking';
import { trackEvent } from '~/lib/utils/track-event';

export const Footer = () => {
  const handleClick = (eventName: string) => () => {
    trackEvent({
      eventName,
      eventData: { type: EVENT_TYPE_LINK },
    });
  };

  return (
    <Box
      alignItems="center"
      as="footer"
      display="flex"
      flexDirection={{ base: 'column-reverse', md: 'row' }}
      gap={{ base: 6, md: 4 }}
      justifyContent="center"
      paddingY={8}
      width="full"
    >
      <Flex
        alignItems={{ base: 'center', md: 'normal' }}
        direction="column"
        gap={2}
      >
        <Box scale={0.8} transform="auto" translateX="-10%">
          <SpokerLogo />
        </Box>
        <Text color="gray" fontSize="sm">
          2021 - {new Date().getFullYear()}
          {' | '}
          <Link
            href="https://agustinusnathaniel.com"
            isExternal
            onClick={handleClick('open agustinusnathaniel.com')}
          >
            agustinusnathaniel.com
          </Link>
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        gap={2}
        justifyContent="center"
        marginLeft={{ md: 'auto' }}
      >
        <Link
          fontSize="sm"
          fontWeight="bold"
          href={`${packageInfo.repository.url}/blob/main/CHANGELOG.md`}
          isExternal
          onClick={handleClick('open repo changelog')}
        >
          v{packageInfo.version}
        </Link>
        <Link
          href={packageInfo.repository.url}
          isExternal
          onClick={handleClick('open repository')}
        >
          <RiGithubFill fontSize="2rem" />
        </Link>
      </Flex>
    </Box>
  );
};
