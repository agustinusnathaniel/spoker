import type { User } from 'firebase/auth';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

type AuthStoreState = {
  currentUser?: User | null;
  displayName: string;
};

type AuthStoreAction = {
  setCurrentUser: (user?: User | null) => void;
  setDisplayName: (displayName: string) => void;
};

type AuthStore = AuthStoreState & AuthStoreAction;

const useAuth = create<AuthStore>()((set) => ({
  displayName: '',
  setCurrentUser: (user) => set({ currentUser: user }),
  setDisplayName: (displayName) => set({ displayName }),
}));

export const useAuthStoreState = (): AuthStoreState =>
  useAuth(
    useShallow(({ currentUser, displayName }) => ({ currentUser, displayName }))
  );

export const useAuthStoreAction = (): AuthStoreAction =>
  useAuth(
    useShallow(({ setCurrentUser, setDisplayName }) => ({
      setCurrentUser,
      setDisplayName,
    }))
  );
