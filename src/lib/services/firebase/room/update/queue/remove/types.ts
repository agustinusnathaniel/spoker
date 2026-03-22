import type { Task } from '~/lib/types/raw-db';

export interface RemoveQueueItemArgs {
  queue?: Array<Task>;
  roomId: string;
  selectedQueueIndex: number;
}
