import { Review } from '../entities/review.entity';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export interface ReviewRepository {
  save(review: Review): Promise<void>;

  findById(id: string): Promise<Review | null>;

  findByUserAndBook(
    userId: string,
    bookId: string,
  ): Promise<Review | null>;

  update(review: Review): Promise<void>;

  delete(id: string): Promise<void>;
}