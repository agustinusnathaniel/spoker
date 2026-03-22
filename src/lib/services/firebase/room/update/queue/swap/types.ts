import type { Task } from '~/lib/types/raw-db';

export interface SwapSelectedQueueWithCurrentArgs {
  queue?: Array<Task>;
  roomId: string;
  selectedQueueIndex: number;
  task: Task;
}
