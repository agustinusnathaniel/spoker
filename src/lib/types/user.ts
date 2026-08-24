export const RoleType = {
  observant: 'observant',
  owner: 'owner',
  participant: 'participant',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const roleOptions: Array<RoleType> = Object.values(RoleType);

export interface User {
  isConnected: boolean;
  name: string;
  point?: number;
  role: RoleType;
}
