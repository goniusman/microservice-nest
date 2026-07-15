import { Review } from '../models/review.model';
import { EntityManager } from 'typeorm';

export interface IReviewWriteRepository {


  save(review: Review, context?: any): Promise<void>;
  findById(id: string, context?: any): Promise<Review | null>;
  delete(id: string, context?: any): Promise<void>;


  // We accept an optional EntityManager to participate in global transactions
  // save(review: Review, entityManager?: EntityManager): Promise<void>;
  // findById(id: string, entityManager?: EntityManager): Promise<Review | null>;
  // delete(id: string, entityManager?: EntityManager): Promise<void>;
  // findByProduct(productId: string): Promise<Review[]>;
}

export const IReviewWriteRepositoryToken = Symbol('IReviewWriteRepository');