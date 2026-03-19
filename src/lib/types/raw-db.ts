import type { HideLabelOptionsType } from '~/lib/constants/hide-label';

import type { User } from './user';

export interface DBSample {
  rooms: Rooms;
}

export interface Rooms {
  [roomId: string]: RoomInstance;
}

export interface RoomMappedUser {
  [participantUid: string]: User;
}

export interface RoomInstance {
  completed?: Array<Task>;

  config: RoomConfig;
  queue?: Array<Task>;
  room: RoomInfo;
  selectedTaskIndex: number;
  task: Task;

  users?: RoomMappedUser;
}

interface RoomInfo {
  isPrivate: boolean;
  name: string;
  password?: string;
}

export interface RoomConfig {
  hideLabel?: HideLabelOptionsType;
  isFreezeAfterVote: boolean;
}

export type PointEntry = Pick<User, 'name' | 'point'>;

interface LastVoted {
  name: string;
  time: string;
}

export interface Task {
  description?: string;
  estimation?: number;
  id: string;
  lastVoted?: LastVoted | null;
  name: string;
  pointEntries?: Array<PointEntry>;
}
