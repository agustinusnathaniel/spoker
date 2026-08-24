import { customAlphabet } from 'nanoid';
import { z } from 'zod';

import { ALLOWED_CHAR_CHECK } from '~/lib/constants/allowed-values';
import { requiredString } from '~/lib/models/primitives';

const allowedChars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';

const nanoid = customAlphabet(allowedChars);
const randomId = nanoid();

export const initialValues: CreateRoomFormType = {
  id: randomId,
  isPrivate: false,
  name: '',
  password: '',
};

export const createRoomFormSchema = z.object({
  id: requiredString('room id is required').regex(
    ALLOWED_CHAR_CHECK,
    'room id contain unallowed character'
  ),
  isPrivate: z.boolean(),
  name: requiredString('Name must be filled'),
  password: z.string().optional(),
});

export type CreateRoomFormType = z.infer<typeof createRoomFormSchema>;
