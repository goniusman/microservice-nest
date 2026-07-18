import { Injectable, Inject } from '@nestjs/common';

import { ReviewFactory } from '../../../domain/factories/review.factory';

import {
  REVIEW_REPOSITORY,
  ReviewRepository,
} from '../../../domain/repositories/review.repository';

import {
  DOMAIN_EVENT_PUBLISHER,
  DomainEventPublisher,
} from '../../../../../shared/application/domain-event.publisher';

import { CreateReviewCommand } from './create-review.command';
import { CreateReviewResult } from './create-review.result';

import { ReviewAlreadyExistsException } from '../../../domain/exceptions/review-already-exists.exception';

@Injectable()
export class CreateReviewHandler {
  constructor(
    private readonly reviewFactory: ReviewFactory,

    @Inject(REVIEW_REPOSITORY)
    private readonly repository: ReviewRepository,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(
    command: CreateReviewCommand,
  ): Promise<CreateReviewResult> {
    // 1. Business rule:
    // A user can review the same book only once.
    const existing = await this.repository.findByUserAndBook(
      command.userId,
      command.bookId,
    );

    if (existing) {
      throw new ReviewAlreadyExistsException();
    }

    // 2. Build the aggregate.
    const review = this.reviewFactory.create({
      userId: command.userId,
      bookId: command.bookId,
      rating: command.rating,
      content: command.content,
    });

    // 3. Persist it.
    await this.repository.save(review);

    // 4. Publish domain events.
    await this.eventPublisher.publish(
      review.pullDomainEvents(),
    );

    // 5. Return the result.
    return new CreateReviewResult(
      review.properties.id,
    );
  }
}