import { Flex } from '@chakra-ui/react';

import { SpokerLogo } from '~/lib/components/spoker-logo';
import { AuthPopover } from '~/lib/layout/components/auth/auth-popover';

import { ThemeToggle } from './theme-toggle';

export const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <SpokerLogo />

      <Flex alignItems="center" marginLeft="auto" gridGap={[2, 4]}>
        <AuthPopover />
        <ThemeToggle />
      </Flex>
    </Flex>
  );
};
