'use client';

import { ClientOnly, Flex } from '@chakra-ui/react';
import { Suspense } from 'react';

import { SpokerLogo } from '~/lib/components/spoker-logo';
import { AuthPopover } from '~/lib/layout/components/auth/auth-popover';

import { ThemeToggle } from './theme-toggle';

export const Header = () => (
  <Flex align="center" as="header" width="full">
    <SpokerLogo />

    <Flex alignItems="center" gap={{ base: 2, md: 4 }} marginLeft="auto">
      <Suspense fallback={null}>
        <AuthPopover />
      </Suspense>
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </Flex>
  </Flex>
);
