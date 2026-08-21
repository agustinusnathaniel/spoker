'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { PUBLIC_ROUTES } from '~/lib/constants/routes/public';
import { RESTRICTED_ROUTES } from '~/lib/constants/routes/restricted';
import { auth } from '~/lib/services/firebase/auth/common';
import { useAuthStoreAction } from '~/lib/stores/auth';

export const useAuthObserver = () => {
  const { setCurrentUser, setDisplayName } = useAuthStoreAction();
  const pathname = usePathname();
  const [busy, setBusy] = useState<boolean>(true);
  const isPublicRoute = useMemo(
    () => PUBLIC_ROUTES.includes(pathname),
    [pathname]
  );
  const isRestrictedRoute = useMemo(
    () => RESTRICTED_ROUTES.includes(pathname),
    [pathname]
  );
  const isLoadingAuth = busy && (!isPublicRoute || isRestrictedRoute);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setDisplayName(user?.displayName ?? '');
      setBusy(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setDisplayName]);

  return { isLoadingAuth };
};
