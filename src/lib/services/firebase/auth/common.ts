import { type Auth, getAuth } from 'firebase/auth';

import { fbase } from '~/lib/services/firebase/config';

let authInstance: Auth | undefined;

export const getAuthInstance = (): Auth => {
  if (!authInstance) {
    authInstance = getAuth(fbase);
  }
  return authInstance;
};

// Lazy export for backward compatibility
export const auth = getAuth(fbase);
