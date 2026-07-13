import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { BookGenre } from './book.type';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType() // Marks this as a dedicated input container
export class CreateBookInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    author: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    price: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    quantity: number;

    @Field(() => BookGenre)
    // @IsString()
    // @IsNotEmpty()
    genre: BookGenre;
}