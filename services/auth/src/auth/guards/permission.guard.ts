// src/auth/guards/permission.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Extract metadata configured on the handler/class
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no permissions are specified, let the request pass to the handler
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    let userPayload: any;
    const contextType = context.getType();

    // 2. Extract user data safely based on the application runtime context
    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      userPayload = request.user; // Appended by your local Passport JWT Strategy
    } else if (contextType === 'rpc') {
      const rpcData = context.switchToRpc().getData();
      // For internal RPC calls, the calling service passes the user context inside the payload
      userPayload = rpcData?.user; 
    } else {
      // Fallback block for other protocols (e.g., websockets) if introduced later
      return false;
    }

    if (!userPayload || !userPayload.permissions) {
      throw new ForbiddenException('Access denied: Authentication context missing.');
    }

    // 3. Evaluate matching permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPayload.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('Access denied: Insufficient privileges.');
    }

    return true;
  }
}