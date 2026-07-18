// user.resolver.ts
import { Resolver, Query, ResolveReference } from '@nestjs/graphql';
import { UserType } from './graphql-types/user.type';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  // This handles incoming structural lookups from the Federation Router
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.userService.findOne(reference.id);
  }
}
