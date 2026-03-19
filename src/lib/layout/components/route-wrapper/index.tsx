import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FullScreenLoading } from '~/lib/components/full-screen-loading';
import { PUBLIC_ROUTES } from '~/lib/constants/routes/public';
import { RESTRICTED_ROUTES } from '~/lib/constants/routes/restricted';
import { useAuthStoreState } from '~/lib/stores/auth';

import { useAuthObserver } from './hooks';

interface RouteWrapperProps {
  children: ReactNode;
}

export const RouteWrapper = ({ children }: RouteWrapperProps) => {
  const router = useRouter();
  const { pathname } = router;
  const { isLoadingAuth } = useAuthObserver();

  const { currentUser } = useAuthStoreState();
  const [busy, setBusy] = useState<boolean>(false);

  const toast = useToast();

  const isPublicRoute = useMemo(
    () => PUBLIC_ROUTES.includes(pathname),
    [pathname]
  );
  const isRestrictedRoute = useMemo(
    () => RESTRICTED_ROUTES.includes(pathname),
    [pathname]
  );

  const isNotVerified = useMemo(
    () =>
      currentUser &&
      !currentUser.emailVerified &&
      pathname !== '/' &&
      !isPublicRoute &&
      !isRestrictedRoute,
    [currentUser, isPublicRoute, isRestrictedRoute, pathname]
  );

  const routeCheck = useCallback(() => {
    if (currentUser && isRestrictedRoute) {
      // setBusy(true);
      router.replace('/').then(() => setBusy(false));
      return;
    }

    if (isNotVerified) {
      setBusy(true);

      currentUser?.reload().then(() => {
        if (!currentUser.emailVerified) {
          router.push('/').then(() => {
            toast({
              title: 'Your email is not verified yet.',
              description: `Check your email (${currentUser.email}) for verification link.`,
              position: 'top',
              status: 'warning',
              isClosable: true,
            });
          });
        }
      });
    }

    setBusy(false);
  }, [currentUser, isNotVerified, isRestrictedRoute, router, toast]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: -
  useEffect(() => {
    routeCheck();
  }, [pathname, currentUser]);

  if (busy || isLoadingAuth) {
    return <FullScreenLoading />;
  }

  return children as ReactElement;
};
