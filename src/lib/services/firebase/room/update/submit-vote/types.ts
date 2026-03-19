import type { PointEntry, Task } from '~/lib/types/raw-db';

export interface SubmitVoteArgs {
  completed?: Array<Task>;
  entries: Array<PointEntry>;
  estimate: number;
  queue?: Array<Task>;
  roomId: string;
  task: Task;
}
