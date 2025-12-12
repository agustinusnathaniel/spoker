import { createStandaloneToast } from '@chakra-ui/react';
import { sendEmailVerification } from 'firebase/auth';

import { auth } from '~/lib/services/firebase/auth/common';
import { showErrorToast } from '~/lib/services/firebase/utils';

const { toast } = createStandaloneToast();

export const requestVerificationMail = async () => {
  const user = auth.currentUser;

  if (user && !user.emailVerified) {
    await sendEmailVerification(user).then(() => {
      toast({
        title: 'Verification Requested',
        description: `Please check your email (${user.email}).`,
        status: 'info',
        position: 'top',
        isClosable: true,
      });
    });
    return;
  }

  if (user?.emailVerified) {
    showErrorToast(Error('Your email is already verified.'));
    return;
  }

  showErrorToast(Error('Invalid Request'));
};
