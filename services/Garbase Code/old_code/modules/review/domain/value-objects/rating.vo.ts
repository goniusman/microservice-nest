import { ValueObject } from '../../../../shared/domain/value-object';
import { InvalidRatingException } from '../exceptions/invalid-rating.exception';

interface RatingProps {
  value: number;
}

export class Rating extends ValueObject<RatingProps> {
  constructor(value: number) {
    super({ value });

    if (!Number.isInteger(value)) {
      throw new InvalidRatingException();
    }

    if (value < 1 || value > 5) {
      throw new InvalidRatingException();
    }
  }

  get value(): number {
    return this.props.value;
  }
}