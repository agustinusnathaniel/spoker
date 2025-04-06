import { z } from 'zod';
import { submitStoryFormValidationSchema } from '~/lib/models/task-list';
import type { Task } from '~/lib/types/raw-db';

export type UpsertStoryForm = z.infer<typeof submitStoryFormValidationSchema>;

export type SortableTaskItem = Task & {
  selected?: boolean;
  chosen?: boolean;
  filtered?: boolean;
};
