// book-service/src/auth/guards/permission.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no permissions are explicitly required, let the request through (or rely on an AuthGuard first)
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes your JwtAuthGuard has already verified the token and attached the user payload

    if (!user || !user.permissions) {
      throw new ForbiddenException('Access denied: Missing user permissions profile.');
    }

    // Check if the user has ALL required permissions for this route
    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Access denied: Insufficient permissions.');
    }

    return true;
  }
}