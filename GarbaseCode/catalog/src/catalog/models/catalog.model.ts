import { Field, ID, ObjectType, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Represents a book item in the catalog' })
export class CatalogItem {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  description?: string;
}






@ObjectType({ description: 'Represents a book item in the catalog' })
export class BookItem {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  quantity: number;

  @Field({ nullable: true })
  description?: string;
}









