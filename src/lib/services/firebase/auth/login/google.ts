import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '~/lib/services/firebase/auth/common';
import { showErrorToast } from '~/lib/services/firebase/utils';

const googleProvider = new GoogleAuthProvider();

// biome-ignore lint/suspicious/useAwait: -
export const loginWithGoogle = async () => {
  signInWithPopup(auth, googleProvider).catch((err) => showErrorToast(err));
};
