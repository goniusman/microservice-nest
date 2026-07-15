

import { PaginatedReviewsResponseDto } from '../../infrastructure/delivery/dtos/paginated-reviews-response.dto';

export interface IReviewReadRepository {
  findByProductPaginated(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewsResponseDto>;
  
  findByIdDirect(
    id: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewsResponseDto>;
}

export const IReviewReadRepositoryToken = Symbol('IReviewReadRepository');
















// import { Review } from '../models/review.model';

// export interface IReviewRepository {
//   save(review: Review): Promise<void>;
//   findById(id: string): Promise<Review | null>;
//   // findByReviewId(id: string): Promise<Review[]>;
//   findByProduct(productId: string): Promise<Review[]>;
//   delete(id: string): Promise<void>;

// }
// // export abstract class IReviewRepository {
// //   abstract save(review: Review): Promise<void>;
// //   abstract findById(id: string): Promise<Review | null>;
// //   abstract findByProduct(productId: string): Promise<Review[]>;
// // }

// // Token used for NestJS DI registration
// export const IReviewRepositoryToken = Symbol('IReviewRepository');