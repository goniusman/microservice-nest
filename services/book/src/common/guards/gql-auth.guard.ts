// src/common/guards/gql-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext();

    // If the context doesn't contain a valid user object, block access
    if (!user) {
      throw new UnauthorizedException('You must be logged in to view this resource');
    }

    return true;
  }
}