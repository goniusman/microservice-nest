import { IsString, IsNotEmpty, IsInt, Min, Max, IsBoolean, IsDate, IsArray } from 'class-validator';
import { EditHistoryEntry } from '../../../domain/models/review.model';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  readonly isPremiumUser: boolean;

  @IsBoolean()
  readonly isVerifiedUser: boolean;

  @IsString()
  @IsNotEmpty()
  readonly bookId: string;

  // @IsInt()
  // @Min(0)
  // readonly reportCount: number;

  // @IsBoolean()
  // readonly isAuthorBlocked: boolean;

  // @IsBoolean()
  // readonly isSoftDeleted: boolean;

  // @IsBoolean()
  // readonly isHidden: boolean;

  // @IsDate()
  // readonly createdAt: Date;

  // @IsArray()
  // readonly editHistory: EditHistoryEntry[];
}