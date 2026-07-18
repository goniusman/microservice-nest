import { Injectable } from '@nestjs/common';
import { EditHistoryEntry, Review } from '../models/review.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewFactory {
  createReview(
    bookId: string,
    userId: string,
    rating: number,
    comment: string,
    isVerifiedUser: boolean,
    isPremiumUser: boolean,
    productId: string,

    // reportCount: number,
    // isAuthorBlocked: boolean,
    // isSoftDeleted: boolean,
    // isHidden: boolean,
    // createdAt: Date,
    // editHistory: EditHistoryEntry[],
  ): Review {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5.');


    // 👇 Protect the creational boundary by invoking our new structural logic rule
    Review.validateContent(rating, comment);

    return Review.create({
      id: uuidv4(),
      bookId,
      userId,
      rating,
      comment,
      productId,
      isVerifiedUser,
      isPremiumUser,
      reportCount: 0,
      isAuthorBlocked: false,
      isSoftDeleted: false,
      isHidden: false,
      createdAt: new Date(),
      editHistory: [],
    });
  }

}