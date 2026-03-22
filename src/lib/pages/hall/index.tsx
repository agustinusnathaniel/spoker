'use client';

import { Alert, Box, Button, Grid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { FullScreenLoading } from '~/lib/components/full-screen-loading';
import { toaster } from '~/lib/components/ui/toaster';
import { requestVerificationMail } from '~/lib/services/firebase/auth/request-verification-mail';
import { useAuthStoreState } from '~/lib/stores/auth';

import { HallWrapper } from './components/hall-wrapper';

export const HallPage = () => {
  const { currentUser } = useAuthStoreState();
  const [busy, setBusy] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const requestEmailVerification = () => {
    currentUser?.reload().then(async () => {
      if (currentUser.emailVerified) {
        setIsEmailVerified(currentUser.emailVerified);
        toaster.create({
          description: 'Your email is already verified.',
          type: 'info',
        });
      } else {
        await requestVerificationMail();
      }
    });
  };

  useEffect(() => {
    setBusy(true);
    if (currentUser) {
      currentUser.reload().then(() => {
        setIsEmailVerified(currentUser.emailVerified);
        setBusy(false);
      });
    } else {
      setBusy(false);
    }
  }, [currentUser]);

  if (busy) {
    return <FullScreenLoading />;
  }

  return (
    <Box mb={8} w="full">
      {currentUser && !isEmailVerified ? (
        <Alert.Root borderRadius={24} status="warning">
          <Alert.Indicator />
          <Grid>
            <Alert.Title>
              Your email is not verified yet. Please check your email for
              verification instructions.
            </Alert.Title>

            <Alert.Description>
              Haven&apos;t received any verification email?{' '}
              <Button
                colorPalette="orange"
                fontWeight="semibold"
                onClick={requestEmailVerification}
                size="sm"
              >
                Request Verification Link
              </Button>
            </Alert.Description>
          </Grid>
        </Alert.Root>
      ) : (
        <HallWrapper />
      )}
    </Box>
  );
};
