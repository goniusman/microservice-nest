// book-service/src/auth/abac/abac-engine.service.ts
import { Injectable } from '@nestjs/common';
import { AbacEvaluationContext } from '../interfaces/abac.interface';

type AbacRule = (context: AbacEvaluationContext) => { allowed: boolean; reason?: string };

@Injectable()
export class AbacEngineService {
  private readonly rules: AbacRule[] = [];

  constructor() {
    // Rule 1: Maintenance / Blackout Window Rule
    // Prevent standard authors from modifying assets during database backup window (e.g., 2:00 AM - 3:00 AM)
    this.rules.push((ctx) => {
      const hour = ctx.environment.requestTime.getHours();
      const isBlackoutWindow = hour === 2; // 2 AM window
      const isSystemAdmin = ctx.user.roles.includes('administrator');

      if (isBlackoutWindow && !isSystemAdmin) {
        return { allowed: false, reason: 'System undergoing maintenance optimizations between 2:00-3:00 AM.' };
      }
      return { allowed: true };
    });

    // Rule 2: IP Range Geofencing (Corporate Office / Allowed Subnets Check)
    // Example: Block administrative roles if accessed from public, external IPs
    this.rules.push((ctx) => {
      const isAdminRole = ctx.user.roles.some(r => ['administrator', 'moderator'].includes(r));
      const isInternalIp = ctx.environment.clientIp === '127.0.0.1' || ctx.environment.clientIp.startsWith('192.168.');

      if (isAdminRole && !isInternalIp) {
        return { allowed: false, reason: 'Privileged operations restricted to corporate internal network paths.' };
      }
      return { allowed: true };
    });

    // Rule 3: Resource State / Locking Mechanism
    // Prevent modifications on assets locked for auditing or publishing processes
    this.rules.push((ctx) => {
      const isResourceLocked = ctx.resource.status === 'ARCHIVED' || ctx.resource.status === 'UNDER_REVIEW';
      const isSystemAdmin = ctx.user.roles.includes('administrator');

      if (isResourceLocked && !isSystemAdmin) {
        return { allowed: false, reason: 'Resource state lock activated: Document changes currently frozen.' };
      }
      return { allowed: true };
    });
  }

  /**
   * Evaluates all registered contextual rules against the incoming request context.
   */
  evaluate(context: AbacEvaluationContext): void {
    for (const rule of this.rules) {
      const result = rule(context);
      if (!result.allowed) {
        throw new Error(result.reason || 'Access Denied: ABAC policy violation.');
      }
    }
  }
}