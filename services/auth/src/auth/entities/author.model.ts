import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@Directive('@key(fields: "id")')
@ObjectType()
export class Author {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}