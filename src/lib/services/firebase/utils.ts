import type { UseToastOptions } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/react';

import { removeFirebasePrefix } from '~/lib/utils/remove-firebase-prefix';

const { toast } = createStandaloneToast();

export const showSuccessToast = (options?: UseToastOptions) =>
  toast({
    status: 'success',
    position: 'top',
    isClosable: true,
    duration: 8000,
    ...options,
  });

export const showErrorToast = (err: Error) =>
  toast({
    description: removeFirebasePrefix(err.message),
    status: 'error',
    position: 'top',
    isClosable: true,
    duration: 15000,
  });
