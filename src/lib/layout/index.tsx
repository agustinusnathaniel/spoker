'use client';

import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { AuthWrapper } from './components/auth/auth-wrapper';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { RouteWrapper } from './components/route-wrapper';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <Box minHeight="100vh" transition="0.5s ease-out">
    <Box margin="0 auto" maxWidth="6xl" padding={8}>
      <Header />
      <RouteWrapper>
        <AuthWrapper>
          <Box as="main" marginY={12}>
            {children}
          </Box>
        </AuthWrapper>
      </RouteWrapper>
      <Footer />
    </Box>
  </Box>
);
