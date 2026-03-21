import { sendEmailVerification } from 'firebase/auth';

import { toaster } from '~/lib/components/ui/toaster';
import { auth } from '~/lib/services/firebase/auth/common';
import { showErrorToast } from '~/lib/services/firebase/utils';

export const requestVerificationMail = async () => {
  const user = auth.currentUser;

  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
    toaster.create({
      title: 'Verification Requested',
      description: `Please check your email (${user.email}).`,
      type: 'info',
    });
    return;
  }

  if (user?.emailVerified) {
    showErrorToast(new Error('Your email is already verified.'));
    return;
  }

  showErrorToast(new Error('Invalid Request'));
};
