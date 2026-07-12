import { Directive, Field, ID, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class Book {
  // @Field(() => ID)
  // id: string;

  @Field()
  title: string;

  // @Field(() => Float)
  // price: number;

  @Field()
  author: string;

  @Field()
  description: string;

  @Field()
  quantity: number;


  @Field()
  price: number;
  

}

// Stub configuration of Author entity inside the Book service
@Directive('@key(fields: "id")')
@ObjectType()
export class Author {
  @Field(() => ID)
  id: string;

  @Field(() => [Book])
  books?: Book[];
}