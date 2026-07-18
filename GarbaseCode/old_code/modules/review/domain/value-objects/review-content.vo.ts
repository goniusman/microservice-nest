import { ValueObject } from '../../../../shared/domain/value-object';
import { InvalidReviewContentException } from '../exceptions/invalid-review-content.exception';

interface ReviewContentProps {
  value: string;
}

export class ReviewContent extends ValueObject<ReviewContentProps> {
  constructor(content: string) {
    const value = content.trim();

    if (!value) {
      throw new InvalidReviewContentException(
        'Review content is required.',
      );
    }

    if (value.length < 10) {
      throw new InvalidReviewContentException(
        'Review content must contain at least 10 characters.',
      );
    }

    if (value.length > 1000) {
        throw new InvalidReviewContentException(
          'Review content cannot exceed 1000 characters.',
        );
    }

    super({ value });
  }

  get value(): string {
    return this.props.value;
  }
}