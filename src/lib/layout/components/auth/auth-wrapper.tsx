'use client';

import { DialogRoot } from '@chakra-ui/react';
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
import { Register } from './register';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
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

  useEffect(() => {
    if (!isUnauthorized) {
      setIsRegistered(true);
    }
  }, [isUnauthorized]);

  const handleSwitchToRegister = () => setIsRegistered(false);
  const handleSwitchToLogin = () => setIsRegistered(true);

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
    <DialogRoot
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
      {isRegistered ? (
        <Login {...{ handleSwitchToRegister }} />
      ) : (
        <Register {...{ handleSwitchToLogin }} />
      )}
    </DialogRoot>
  );
};
