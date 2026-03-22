import type { z } from 'zod';

import type { submitStoryFormValidationSchema } from '~/lib/models/task-list';
import type { Task } from '~/lib/types/raw-db';

export type UpsertStoryForm = z.infer<typeof submitStoryFormValidationSchema>;

export type SortableTaskItem = Task;

export interface SortableTaskItemProps {
  queueProps?: {
    isQueue: boolean;
    taskIndex: number;
    onClickSwap: (selectedIndex: number) => Promise<void>;
    onClickEdit: (selectedIndex: number) => void;
    onClickRemove: (selectedIndex: number) => void;
  };
  task: Task;
}
