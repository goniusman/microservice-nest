// src/book/dto/update-book.input.ts
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateBookInput } from './create-book.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string; // The database ID must always be provided
}