// src/common/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';


@Injectable()
export class GatewayAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Checks the specific method/endpoint
      context.getClass(),   // Checks the entire controller class
    ]);

    if (isPublic) {
      return true; // Skip authentication completely
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 1. ALLOW PUBLIC AUTH ENDPOINTS (Login / Register go directly through)
    // Adjust these paths to match whatever routes point to your Auth Service
    console.log(request.path)
    if (request.path.startsWith('/auth/login') || request.path.startsWith('/auth/register')) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Missing token');

    try {
      // 2. Validate token (Use your secret or verify with an Auth microservice)
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 3. Attach user info to headers so downstream microservices know who this is
      request.headers['x-user-id'] = payload.sub;
      request.headers['x-user-roles'] = payload.role;
      // request.headers['x-user-roles'] = payload.roles.join(',');
      console.log(payload)
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // 1. Account for lowercase 'authorization' (standard in Express/NestJS)
    const authHeader = request.headers.authorization || request.headers['authorization'];

    if (!authHeader) {
      console.log('No Authorization header found');
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    console.log('Type:', type);
    console.log('Token:', token);

    // 2. Case-insensitive check for 'Bearer'
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }

}