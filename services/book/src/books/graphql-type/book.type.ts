
import { ObjectType, Field, ID, registerEnumType, Float, Int, Directive } from '@nestjs/graphql';

// 1. Define an Enum for Book Categories / Genres
export enum BookGenre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCI_FI = 'SCI_FI',
  BIOGRAPHY = 'BIOGRAPHY',
}

// Register the enum with NestJS GraphQL framework
registerEnumType(BookGenre, { name: 'BookGenre' });

// Cache this entire entity for 60 seconds
// @Directive('@cacheControl(maxAge: 60)')
@ObjectType() // Marks this class as a GraphQL Object Type
// PRIVATE ensures this cache is unique per user session and not shared on a CDN
// @Directive('@cacheControl(maxAge: 120, scope: PRIVATE)')
export class BookType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field() // Makes field optional in GraphQL
  description?: string;

  @Field(() => Float) // Maps numbers explicitly to Float
  // @Directive('@cacheControl(maxAge: 10)') // Price changes often, cache for only 10s
  price: number;

  @Field(() => Int) // Maps quantity explicitly to Int
  quantity: number;

  @Field()
  isPublished: boolean;

  @Field(() => BookGenre)
  genre: BookGenre;

  // @Field(() => String)
  // createdAt: Date;
}




@Directive('@key(fields: "id")') // <--- Defines this type as a federated entity
@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;
}



























// import { Directive, Field, ID, ObjectType, Float } from '@nestjs/graphql';

// @ObjectType()
// export class Book {
//   // @Field(() => ID)
//   // id: string;

//   @Field()
//   title: string;

//   // @Field(() => Float)
//   // price: number;

//   @Field()
//   author: string;

//   @Field()
//   description: string;

//   @Field()
//   quantity: number;


//   @Field()
//   price: number;
  

// }

// // Stub configuration of Author entity inside the Book service
// @Directive('@key(fields: "id")')
// @ObjectType()
// export class Author {
//   @Field(() => ID)
//   id: string;

//   @Field(() => [Book])
//   books?: Book[];
// }