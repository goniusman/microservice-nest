import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReviewReadRepository } from '../../../domain/repositories/review-read.repository.interface';
import { ReviewDocument } from './review.document';
import { PaginatedReviewsResponseDto } from '../../delivery/dtos/paginated-reviews-response.dto';
import { ReviewResponseDto } from '../../delivery/dtos/review-response.dto';

@Injectable()
export class MongoReviewReadRepository implements IReviewReadRepository {
  constructor(
    @InjectModel(ReviewDocument.name)
    private readonly mongoModel: Model<ReviewDocument>,
  ) { }

  async findByProductPaginated(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewsResponseDto> {
    const skip = (page - 1) * limit;

    // Run both the count and the paginated lookup simultaneously for max performance
    const [docs, total] = await Promise.all([
      this.mongoModel
        .find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() // 🚀 Skips generating heavy Mongoose model instances
        .exec(),
      this.mongoModel.countDocuments({ productId }).exec(),
    ]);

    // Map straight to lightweight DTOs
    const dtos = docs.map(
      (doc: any) =>
        new ReviewResponseDto(
          doc._id.toString(),
          doc.productId,
          doc.userId,
          doc.rating,
          doc.comment,
          doc.createdAt,
          doc.isPremiumUser,
          doc.isVerifiedUser,
          doc.bookId,
          doc.reportCount,
          doc.isAuthorBlocked,
          doc.isSoftDeleted,
          doc.isHidden,
          doc.editHistory

        ),
    );

    const totalPages = Math.ceil(total / limit);
    return new PaginatedReviewsResponseDto(dtos, total, page, limit, totalPages);
  }


  async findByBookPaginated(bookId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.mongoModel
        .find({
          bookId,
          isSoftDeleted: false,   // 🛡️ Rule: Filter out soft deleted entries
          isHidden: false,        // 🛡️ Rule: Filter out items hidden by blocks or reports
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.mongoModel.countDocuments({ bookId, isSoftDeleted: false, isHidden: false }).exec(),
    ]);

    return new PaginatedReviewsResponseDto(docs, total, page, limit, Math.ceil(total / limit));
  }

  async findByIdDirect(id: string): Promise<any | null> {
    return await this.mongoModel.findById(id).lean().exec();
  }
}