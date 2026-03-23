import { useAuthStoreState } from '~/lib/stores/auth';
import { useRoomStoreState } from '~/lib/stores/room';
import { RoleType } from '~/lib/types/user';

export const useUserRole = () => {
  const { currentUser } = useAuthStoreState();
  const { roomData } = useRoomStoreState();

  const userRole = currentUser && roomData?.users?.[currentUser.uid]?.role;

  const isParticipant = userRole === RoleType.participant;
  const isObservant = userRole === RoleType.observant;
  const isOwner = userRole === RoleType.owner;

  return {
    userRole,
    isParticipant,
    isObservant,
    isOwner,
  };
};
