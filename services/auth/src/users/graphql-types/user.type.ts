// user.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@Directive('@key(fields: "id")') // <--- Defines this type as a federated entity
@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;
}
