import { Injectable, Inject } from '@nestjs/common';

import {
  CLOCK,
  Clock,
} from '../../../../shared/application/clock';

import {
  ID_GENERATOR,
  IdGenerator,
} from '../../../../shared/application/id-generator';

import { Review } from '../entities/review.entity';
import {
  ReviewStatus,
} from '../entities/review.props';

import { Rating } from '../value-objects/rating.vo';
import { ReviewContent } from '../value-objects/review-content.vo';

export interface CreateReviewParams {
  userId: string;
  bookId: string;
  rating: number;
  content: string;
}

@Injectable()
export class ReviewFactory {
  constructor(
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,

    @Inject(CLOCK)
    private readonly clock: Clock,
  ) {}

  create(params: CreateReviewParams): Review {
    const now = this.clock.now();

    return Review.create({
      id: this.idGenerator.generate(),

      userId: params.userId,

      bookId: params.bookId,

      rating: new Rating(params.rating),

      content: new ReviewContent(params.content),

      status: ReviewStatus.ACTIVE,

      createdAt: now,

      updatedAt: now,
    });
  }
}