import { toaster } from "~/lib/components/ui/toaster";

import { removeFirebasePrefix } from "~/lib/utils/remove-firebase-prefix";

export const showSuccessToast = (options?: { title?: string; description?: string; duration?: number }) =>
  toaster.create({
    type: "success",
    duration: options?.duration ?? 8000,
    ...options,
  });

export const showErrorToast = (err: Error) =>
  toaster.create({
    description: removeFirebasePrefix(err.message),
    type: "error",
    duration: 15000,
  });
