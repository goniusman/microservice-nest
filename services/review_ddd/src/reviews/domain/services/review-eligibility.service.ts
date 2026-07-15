// src/reviews/domain/services/review-eligibility.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { type IReviewReadRepository, IReviewReadRepositoryToken } from '../repositories/review-read.repository.interface';

@Injectable()
export class ReviewEligibilityService {
  constructor(
    // Inject the read repository token
    @Inject(IReviewReadRepositoryToken)
    private readonly reviewRepository: IReviewReadRepository,

    // 👇 This explicit string token tells NestJS what provider to lookup at bootup
    @Inject('ORDER_REPOSITORY_TOKEN')
    private readonly orderRepository: any,

  ) {}

  async isUserEligibleForReview(userId: string, productId: string): Promise<boolean> {
    // 1. Fetch paginated envelope (we pull a large batch size like 100 or check explicitly)
    const paginatedResult = await this.reviewRepository.findByProductPaginated(productId, 1, 100);
    
    // 2. Extract the actual array out of the structural envelope safely safely
    const reviewsArray = paginatedResult.data || [];
    
    // 3. Now run the match condition on the valid array
    const hasAlreadyReviewed = reviewsArray.some(review => review.userId === userId);
    
    return !hasAlreadyReviewed;
  }

  // 🛡️ Rule: A user can review only purchased books
  async canUserReviewBook(userId: string, bookId: string): Promise<boolean> {
    const hasPurchased = await this.orderRepository.hasUserPurchasedBook(userId, bookId);
    return hasPurchased;
  }

  // 🛡️ Rule: Evaluates system strings against corporate blacklists
  public containsProhibitedWords(comment: string): boolean {
    const prohibitedWords = ['illegal-word-1', 'scam-banned-token'];
    return prohibitedWords.some(word => comment.toLowerCase().includes(word));
  }
}