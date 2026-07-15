import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReviewReadRepository } from '../../../domain/repositories/review-read.repository.interface';
import { ReviewEntity } from './review.entity';
import { PaginatedReviewsResponseDto } from '../../delivery/dtos/paginated-reviews-response.dto';
import { ReviewResponseDto } from '../../delivery/dtos/review-response.dto';

@Injectable()
export class PostgresReviewReadRepository implements IReviewReadRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly typeOrmRepo: Repository<ReviewEntity>,
  ) { }

  async findByProductPaginated(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewsResponseDto> {
    const skip = (page - 1) * limit;

    // Use a performant select query fetching only the required raw data columns
    const [entities, total] = await this.typeOrmRepo.findAndCount({
      where: { productId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const dtos = entities.map(
      (entity) =>
        new ReviewResponseDto(
          entity.id,
          entity.productId,
          entity.userId,
          entity.rating,
          entity.comment,
          entity.createdAt,
          entity.isPremiumUser,
          entity.isVerifiedUser,
          entity.bookId,
          entity.reportCount,
          entity.isAuthorBlocked,
          entity.isSoftDeleted,
          entity.isHidden,
          entity.editHistory
        ),
    );

    const totalPages = Math.ceil(total / limit);
    return new PaginatedReviewsResponseDto(dtos, total, page, limit, totalPages);
  }

  async findByIdDirect(
    id: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewsResponseDto> {
    const skip = (page - 1) * limit;

    // Use a performant select query fetching only the required raw data columns
    const [entities, total] = await this.typeOrmRepo.findAndCount({
      where: { id },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const dtos = entities.map(
      (entity) =>
        new ReviewResponseDto(
          entity.id,
          entity.productId,
          entity.userId,
          entity.rating,
          entity.comment,
          entity.createdAt,
          entity.isPremiumUser,
          entity.isVerifiedUser,
          entity.bookId,
          entity.reportCount,
          entity.isAuthorBlocked,
          entity.isSoftDeleted,
          entity.isHidden,
          entity.editHistory
        ),
    );

    const totalPages = Math.ceil(total / limit);
    return new PaginatedReviewsResponseDto(dtos, total, page, limit, totalPages);
  }
}