import { z } from 'zod';

import { requiredString } from '~/lib/models/primitives';

export const submitStoryFormValidationSchema = z.object({
  description: z.string(),
  name: requiredString('Name must be filled'),
});
