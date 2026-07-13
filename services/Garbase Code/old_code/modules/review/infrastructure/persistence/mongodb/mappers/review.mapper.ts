import { Review } from '../../../domain/entities/review.entity';
import {
  ReviewProps,
  ReviewStatus,
} from '../../../domain/entities/review.props';

import { Rating } from '../../../domain/value-objects/rating.vo';
import { ReviewContent } from '../../../domain/value-objects/review-content.vo';

import { ReviewDocument } from '../schemas/review.schema';

export class ReviewMapper {
  static toPersistence(review: Review) {
    const props = review.properties;

    return {
      id: props.id,
      userId: props.userId,
      bookId: props.bookId,
      rating: props.rating.value,
      content: props.content.value,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static toDomain(document: ReviewDocument): Review {
    const props: ReviewProps = {
      id: document.id,
      userId: document.userId,
      bookId: document.bookId,
      rating: new Rating(document.rating),
      content: new ReviewContent(document.content),
      status: document.status as ReviewStatus,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return Review.rehydrate(props);
  }
}