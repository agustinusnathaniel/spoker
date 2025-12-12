import { updateProfile } from 'firebase/auth';

import { auth } from '~/lib/services/firebase/auth/common';

// biome-ignore lint/suspicious/useAwait: -
export const updateDisplayName = async (displayName: string) => {
  const user = auth.currentUser;

  if (user) {
    updateProfile(user, {
      displayName,
    });
  }
};
