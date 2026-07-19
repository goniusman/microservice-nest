// src/auth/policies/policy.interface.ts
import { User } from '../../users/entities/user.entity';

export interface ResourcePolicy<T> {
  canUpdate(user: User, resource: T): boolean;
  canDelete(user: User, resource: T): boolean;
}