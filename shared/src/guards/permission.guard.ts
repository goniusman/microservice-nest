// book-service/src/auth/guards/permission.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { pathToRegexp } from 'path-to-regexp';
import { RedisService } from '../redis/redis.service'; // Make sure the path matches your folder tree

interface AuthProfile {
  roles: string[];
  permissions: Array<{ method: string; path: string }>;
} 

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject('AUTH_TCP_SERVICE') private readonly tcpClient: ClientProxy,
    private readonly redisService: RedisService, // Injecting your custom wrapper here
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userId = request.headers['X-User-Id'] as string; 
    // userId = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'
    // userId = '52434d51-5da3-4057-8894-6cec8ebff12d'
    if (!userId) {
      throw new ForbiddenException('Access Denied: Unauthenticated payload.');
    }

    const currentMethod = request.method;
    const currentPath = request.path;
    const cacheKey = `user:auth:${userId}`;

    let authProfile: AuthProfile | null = null;

    try {
      // 1. STEP 1: Attempt to pull cache from your custom Redis wrapper
      // Your wrapper automatically handles JSON.parse() internally!
      authProfile = await this.redisService.get<AuthProfile>(cacheKey);
      console.log(authProfile)
      if (!authProfile) {
        // 2. STEP 2: Cache Miss. Fire standard TCP request packet to the Auth Service
        authProfile = await firstValueFrom(
          this.tcpClient.send<AuthProfile>({ cmd: 'get_user_permissions' }, { userId })
        );

        if (authProfile) {
          // 3. STEP 3: Store in Redis cache for 1 hour (3600 seconds) using your wrapper
          await this.redisService.set(cacheKey, authProfile, 3600);
        }
      }

      if (!authProfile || !authProfile.permissions) {
        throw new ForbiddenException('Access Denied: Empty authorizations profile.');
      }

      // 4. STEP 4: Path matching rule validation using the modern path-to-regexp API
      const isRouteAllowed = authProfile.permissions.some((rule) => {
        const methodMatches = rule.method === '*' || rule.method.toUpperCase() === currentMethod.toUpperCase();
        if (!methodMatches) return false;

        // Modern path-to-regexp returns an object layout containing a compiled native RegExp property
        const { regexp } = pathToRegexp(rule.path);
        return regexp.test(currentPath);
      });

      if (!isRouteAllowed) {
        throw new ForbiddenException('Access Denied: Insufficient authorization permissions.');
      }

      // Inject validated data context down to the handler
      request.user = { id: userId, roles: authProfile.roles };
      return true;

    } catch (error) {
      throw new ForbiddenException(`Security verification failure. ${error}`);
    }
  }
}