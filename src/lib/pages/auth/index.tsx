'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

import { FullScreenLoading } from '~/lib/components/full-screen-loading';
import { toaster } from '~/lib/components/ui/toaster';
import { handleVerifyEmail } from '~/lib/services/firebase/auth/verify-email';
import { useAuthStoreState } from '~/lib/stores/auth';
import { removeFirebasePrefix } from '~/lib/utils/remove-firebase-prefix';

const AuthContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const { currentUser } = useAuthStoreState();
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  const handleInvalidLink = useCallback(() => {
    setIsProcessed(true);
    router.push('/');
    toaster.create({
      description: 'Invalid Link',
      type: 'warning',
    });
  }, [router]);

  const handleAuthCallback = useCallback(() => {
    if (mode === 'verifyEmail') {
      setIsProcessed(true);
      if (oobCode) {
        handleVerifyEmail(oobCode)
          .then(() => {
            toaster.create({
              title: 'Email Verification Success',
              type: 'success',
            });
            if (currentUser) {
              currentUser.reload().then(() => router.push('/'));
            } else {
              router.push('/');
            }
          })
          .catch((err: Error) => {
            router.push('/');
            toaster.create({
              description: removeFirebasePrefix(err.message),
              type: 'error',
            });
          });
      } else {
        handleInvalidLink();
      }
      return;
    }

    handleInvalidLink();
  }, [currentUser, handleInvalidLink, mode, oobCode, router]);

  useEffect(() => {
    if (isProcessed) {
      return;
    }
    handleAuthCallback();
  }, [handleAuthCallback, isProcessed]);

  return <FullScreenLoading />;
};

export const Auth = () => {
  return (
    <Suspense fallback={<FullScreenLoading />}>
      <AuthContent />
    </Suspense>
  );
};
