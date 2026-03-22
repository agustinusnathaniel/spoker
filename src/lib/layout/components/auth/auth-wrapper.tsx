'use client';

import { Dialog, Portal } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { FullScreenLoading } from '~/lib/components/full-screen-loading';
import { PUBLIC_ROUTES } from '~/lib/constants/routes/public';
import { RESTRICTED_ROUTES } from '~/lib/constants/routes/restricted';
import { EVENT_TYPE_AUTH } from '~/lib/constants/tracking';
import { useAuthStoreState } from '~/lib/stores/auth';
import { trackEvent } from '~/lib/utils/track-event';

import { Login } from './login';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentUser } = useAuthStoreState();

  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.indexOf(pathname) >= 0;
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(pathname);

  // currentUser is undefined while loading, null when not authenticated, or User when authenticated
  const isLoading = currentUser === undefined;
  const isUnauthorized =
    currentUser === null && !isPublicRoute && !isRestrictedRoute;

  // biome-ignore lint/correctness/useExhaustiveDependencies: -
  useEffect(() => {
    if (isUnauthorized) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [currentUser, pathname]);

  const handleCloseAuthModal = () => {
    router.push('/home');
    trackEvent({
      eventName: 'close_auth-back_to_home',
      eventData: { type: EVENT_TYPE_AUTH },
    });
  };

  // Show loading while determining auth state
  if (isLoading && !isPublicRoute) {
    return <FullScreenLoading />;
  }

  if (!isUnauthorized) {
    return children as ReactElement;
  }

  return (
    <Dialog.Root
      onOpenChange={({ open }) => {
        if (!open) {
          handleCloseAuthModal();
        }
        setIsOpen(open);
      }}
      open={isOpen}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Login />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
