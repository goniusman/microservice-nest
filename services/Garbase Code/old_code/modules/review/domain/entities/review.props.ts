import { Rating } from '../value-objects/rating.vo';
import { ReviewContent } from '../value-objects/review-content.vo';

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export interface ReviewProps {
  id: string;

  userId: string;

  bookId: string;

  rating: Rating;

  content: ReviewContent;

  status: ReviewStatus;

  createdAt: Date;

  updatedAt: Date;
}