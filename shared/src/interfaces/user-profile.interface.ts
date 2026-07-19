// shared/src/interfaces/user-profile.interface.ts
export interface IUserProfile {
  id: string;
  status: 'active' | 'suspended';
  permissions: string[];
}


