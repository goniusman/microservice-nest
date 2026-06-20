import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Book ID is required' })
  bookId: string;

  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot be more than 5 stars' })
  @IsOptional() // Making it optional if you allow text-only, or remove @IsOptional if required
  rating?: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true; // Defaults to true (active review)
}
