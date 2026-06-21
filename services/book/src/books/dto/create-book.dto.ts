import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Book title cannot be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Author name is required' })
  author: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Price must be a positive number' })
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(0, { message: 'Stock quantity cannot be less than 0' })
  @IsOptional()
  quantity?: number = 0; // Added stock tracking, defaults to 0
}