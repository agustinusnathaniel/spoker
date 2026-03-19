import type { Task } from '~/lib/types/raw-db';

export interface EditQueueItemArgs {
  queue?: Array<Task>;
  roomId: string;
  selectedQueueIndex: number;
  updatedItem: Task;
}
