import mean from 'lodash-es/mean';

import type { RoomMappedUser } from '~/lib/types/raw-db';
import type { RoomUser } from '~/lib/types/room';
import { RoleType } from '~/lib/types/user';

export const filterUserWithPoints = (unfilteredUsers: Array<RoomUser>) =>
  [...unfilteredUsers].filter((unfilteredUser) =>
    ([RoleType.owner, RoleType.participant] as Array<RoleType>).includes(
      unfilteredUser.role
    )
  );

export const countAveragePoint = (points: Array<number>) => mean(points);

export const connectedUsers = (users: RoomMappedUser) => {
  const result: Array<RoomUser> = [];
  for (const [uid, userData] of Object.entries(users)) {
    if (userData.isConnected) {
      result.push({ uid, ...userData });
    }
  }
  return result;
};

export const checkAllParticipantVoted = (users: Array<RoomUser>) =>
  users
    .filter((user) => user.role === RoleType.participant)
    .every((user) => (user.point ?? -1) >= 0) &&
  users.length > 1 &&
  !users.every((user) => user.role === RoleType.owner);
