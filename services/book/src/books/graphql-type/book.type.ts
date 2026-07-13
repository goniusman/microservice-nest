
import { ObjectType, Field, ID, registerEnumType, Float, Int } from '@nestjs/graphql';

// 1. Define an Enum for Book Categories / Genres
export enum BookGenre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCI_FI = 'SCI_FI',
  BIOGRAPHY = 'BIOGRAPHY',
}

// Register the enum with NestJS GraphQL framework
registerEnumType(BookGenre, { name: 'BookGenre' });

@ObjectType() // Marks this class as a GraphQL Object Type
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