import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaginatedReviewsResponseDto } from '../../infrastructure/delivery/dtos/paginated-reviews-response.dto';
import { type IReviewReadRepository, IReviewReadRepositoryToken } from '../../domain/repositories/review-read.repository.interface';

import { GetReviewByIdQuery } from './get-review.query';

@QueryHandler(GetReviewByIdQuery)
export class GetReviewByIdHandler implements IQueryHandler<GetReviewByIdQuery> {
  constructor(
    @Inject(IReviewReadRepositoryToken)
    private readonly readRepository: IReviewReadRepository,
  ) {}
 
  async execute(query: GetReviewByIdQuery): Promise<any | null> {
    return await this.readRepository.findByIdDirect(query.id, query.page, query.limit);
  }

}
