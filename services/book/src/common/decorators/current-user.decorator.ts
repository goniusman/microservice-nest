// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Convert regular Nest execution context to GraphQL execution context
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().user;
  },
);

