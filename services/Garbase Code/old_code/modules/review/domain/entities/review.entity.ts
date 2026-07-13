import { AggregateRoot } from '../../../../shared/domain/aggregate-root';

import {
  ReviewProps,
  ReviewStatus,
} from './review.props';

import { Rating } from '../value-objects/rating.vo';
import { ReviewContent } from '../value-objects/review-content.vo';

import { ReviewAlreadyDeletedException } from '../exceptions/review-already-deleted.exception';
import { ReviewCreatedEvent } from '../events/review-created.event';

export class Review extends AggregateRoot<ReviewProps> {
  private constructor(props: ReviewProps) {
    super(props);
  }

  static create(props: ReviewProps): Review {
     const review = new Review(props);

    review.addDomainEvent(

        new ReviewCreatedEvent(

            props.id,

            props.userId,

            props.bookId,

        ),

    );

    return review;
  }

  static rehydrate(props: ReviewProps): Review {
    return new Review(props);
  }

  update(
    rating: Rating,
    content: ReviewContent,
  ): void {
    if (this.props.status === ReviewStatus.DELETED) {
      throw new ReviewAlreadyDeletedException();
    }

    this.props.rating = rating;

    this.props.content = content;

    this.props.updatedAt = new Date();
  }

  delete(): void {
    if (this.props.status === ReviewStatus.DELETED) {
      throw new ReviewAlreadyDeletedException();
    }

    this.props.status = ReviewStatus.DELETED;

    this.props.updatedAt = new Date();
  }
}