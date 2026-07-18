// src/reviews/application/commands/create-review.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateReviewCommand } from './create-review.command';
import { ReviewFactory } from '../../domain/factories/review.factory';
import { ReviewEligibilityService } from '../../domain/services/review-eligibility.service';
import { IReviewWriteRepository, IReviewWriteRepositoryToken } from '../../domain/repositories/review-write.repository.interface';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler implements ICommandHandler<CreateReviewCommand> {
  constructor(
    @Inject(IReviewWriteRepositoryToken)
    private readonly writeRepository: IReviewWriteRepository,
    private readonly eligibilityService: ReviewEligibilityService,
    private readonly reviewFactory: ReviewFactory,
    private readonly amqpConnection: AmqpConnection, // Direct global AMQP Exchange access
  ) {}

  async execute(command: CreateReviewCommand): Promise<string> {
    const { bookId, userId, rating, comment, isVerifiedUser, isPremiumUser, productId,
      //  reportCount, isAuthorBlocked, isSoftDeleted, isHidden, createdAt, editHistory 
      } = command;

    // 1. Cross-Entity Purchase Rule Validation
    const hasPurchased = await this.eligibilityService.canUserReviewBook(userId, bookId);
    if (!hasPurchased) {
      throw new ConflictException('Review creation blocked. You can only review books you have purchased.');
    }
    // 1. Cross-Entity Purchase Rule Validation // later will uncomment
    // const hasUserEligibleForReview = await this.eligibilityService.isUserEligibleForReview(userId, productId);
    // if (!hasUserEligibleForReview) {
    //   throw new ConflictException('Review creation blocked. You already reviewd!');
    // }

    // 2. Factory creation applies verification boundary validation constraints
    const review = this.reviewFactory.createReview(
      bookId, userId, rating, comment, isVerifiedUser, isPremiumUser, productId,
      //  reportCount, isAuthorBlocked, isSoftDeleted, isHidden, createdAt, editHistory 
    );

    // 3. 🛡️ Rule: If review contains prohibited words -> Flag for moderation
    const requiresModeration = this.eligibilityService.containsProhibitedWords(comment);
    
    // Save state cleanly into Database Engine 
    await this.writeRepository.save(review);

    // 4. Asynchronous Event Dispatches (RabbitMQ Pipeline Actions)
    if (requiresModeration) {
      // 🛡️ Rule: Send moderation request via Broker
      await this.amqpConnection.publish('bookverse_global_exchange', 'review_moderation_requested', {
        reviewId: review.id,
        comment: review.comment,
      });
    }

    // 🛡️ Rule: Notify followers when review is published
    // 🛡️ Rule: Recalculate book average rating (Initial computation call)
    await Promise.all([
      this.amqpConnection.publish('bookverse_global_exchange', 'review_published', {
        reviewId: review.id,
        authorId: userId,
        bookId: bookId,
      }),
      this.amqpConnection.publish('bookverse_global_exchange', 'book_rating_changed', {
        bookId: bookId,
      })
    ]);

    return review.id;
  }
}