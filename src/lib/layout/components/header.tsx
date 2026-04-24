'use client';

import { ClientOnly, Flex } from '@chakra-ui/react';

import { SpokerLogo } from '~/lib/components/spoker-logo';
import { AuthPopover } from '~/lib/layout/components/auth/auth-popover';

import { ThemeToggle } from './theme-toggle';

export const Header = () => (
  <Flex align="center" as="header" width="full">
    <SpokerLogo />

    <Flex alignItems="center" gap={{ base: 2, md: 4 }} marginLeft="auto">
      <AuthPopover />
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </Flex>
  </Flex>
);
