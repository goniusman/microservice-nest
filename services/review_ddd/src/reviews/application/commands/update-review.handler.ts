// src/reviews/application/commands/update-review.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UpdateReviewCommand } from './update-review.command';
import { IReviewWriteRepository, IReviewWriteRepositoryToken } from '../../domain/repositories/review-write.repository.interface';

@CommandHandler(UpdateReviewCommand)
export class UpdateReviewHandler implements ICommandHandler<UpdateReviewCommand> {
  constructor(
    @Inject(IReviewWriteRepositoryToken)
    private readonly writeRepository: IReviewWriteRepository,
    private readonly amqpConnection: AmqpConnection,
  ) { }

  async execute(command: UpdateReviewCommand): Promise<void> {
    const { 
      rating, 
      comment, 
      id, 
      isPremiumUser, 
      isVerifiedUser, 
      reportCount,
      isAuthorBlocked,
      isHidden
    } = command;

    const review = await this.writeRepository.findById(id);
    if (!review) throw new NotFoundException('Review aggregate target not found.');

    const initialRating = review.rating;

    // Delegate execution to domain models to evaluate multi-tiered history and time windows
    review.updateReview(rating, comment,isPremiumUser,isVerifiedUser, reportCount, isAuthorBlocked, isHidden);

    // Persist changes securely
    await this.writeRepository.save(review);

    // 🛡️ Rule: If rating changes -> Recalculate book average rating
    if (initialRating !== rating) {
      await this.amqpConnection.publish('bookverse_global_exchange', 'book_rating_changed', {
        bookId: review.bookId,
      });
    }
  }
}