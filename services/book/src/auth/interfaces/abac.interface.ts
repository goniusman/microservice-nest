// book-service/src/auth/interfaces/abac.interface.ts
import { UserContext } from './policy.interface';

export interface EnvironmentAttributes {
  clientIp: string;
  requestTime: Date;
}

export interface AbacEvaluationContext {
  user: UserContext;
  resource: {
    type: string;
    status: string;
    author: string;
  };
  environment: EnvironmentAttributes;
}