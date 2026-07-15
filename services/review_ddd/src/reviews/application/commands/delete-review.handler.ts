// application/commands/delete-review.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteReviewCommand } from './delete-review.command';
import { IReviewWriteRepository, IReviewWriteRepositoryToken } from '../../domain/repositories/review-write.repository.interface';

@CommandHandler(DeleteReviewCommand)
export class DeleteReviewHandler implements ICommandHandler<DeleteReviewCommand> {
  constructor(
    @Inject(IReviewWriteRepositoryToken)
    private readonly reviewRepository: IReviewWriteRepository,
  ) {}

  async execute(command: DeleteReviewCommand): Promise<void> {
    const { id } = command;

    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewRepository.delete(id);
  }
}