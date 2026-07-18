import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReviewsByProductQuery } from './get-reviews-product.query';
import { ReviewResponseDto } from '../../infrastructure/delivery/dtos/review-response.dto';
import { Inject } from '@nestjs/common';
import { IReviewReadRepository, IReviewReadRepositoryToken } from '../../domain/repositories/review-read.repository.interface';
import { PaginatedReviewsResponseDto } from '../../infrastructure/delivery/dtos/paginated-reviews-response.dto';

// Glue this handler to the query type within the QueryBus
@QueryHandler(GetReviewsByProductQuery)
export class GetReviewsByProductHandler implements IQueryHandler<GetReviewsByProductQuery> {
  constructor(
    @Inject(IReviewReadRepositoryToken)
    private readonly reviewRepository: IReviewReadRepository
) {}

 async execute(query: GetReviewsByProductQuery): Promise<PaginatedReviewsResponseDto> {
    return await this.reviewRepository.findByProductPaginated(
      query.productId,
      query.page,
      query.limit,
    );
  }
}