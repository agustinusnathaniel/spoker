'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { system } from '~/lib/styles/theme';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider({
  children,
  ...props
}: ColorModeProviderProps) {
  return (
    <ColorModeProvider {...props}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ColorModeProvider>
  );
}
