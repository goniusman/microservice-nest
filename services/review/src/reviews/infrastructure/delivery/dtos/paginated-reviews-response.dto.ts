import { ReviewResponseDto } from './review-response.dto';

export class PaginatedReviewsResponseDto {
  constructor(
    public readonly data: ReviewResponseDto[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number
  ) {}
}