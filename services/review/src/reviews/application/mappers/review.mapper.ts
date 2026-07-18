import { ReviewEntity } from '../../infrastructure/persistence/postgres/review.entity';
import { EditHistoryEntry, Review } from '../../domain/models/review.model';
import { ReviewDocument } from '../../infrastructure/persistence/mongo/review.document';

export class ReviewMapper {
    // Domain Model -> Database Document
    static toPersistence(review: Review): any {
        return {
            id: review.id,
            productId: review.productId,
            userId: review.userId,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            bookId: review.bookId,
            isVerifiedUser: review.isVerifiedUser,
            isPremiumUser: review.isPremiumUser,
            reportCount: review.reportCount,
            isAuthorBlocked: review.isAuthorBlocked,
            isSoftDeleted: review.isSoftDeleted,
            isHidden: review.isHidden,
            editHistory: review.editHistory,
        };
    }

    // Database Document -> Domain Model
    static toDomain(document: ReviewDocument): Review {
        return Review.create({
            id: document.id,
            productId: document.productId,
            userId: document.userId,
            rating: document.rating,
            comment: document.comment,
            createdAt: document.createdAt,
            editHistory: document.editHistory,
            bookId: document.bookId,
            isVerifiedUser: document.isVerifiedUser,
            isPremiumUser: document.isPremiumUser,
            reportCount: document.reportCount,
            isAuthorBlocked: document.isAuthorBlocked,
            isSoftDeleted: document.isSoftDeleted,
            isHidden: document.isHidden,
        });
    }




    // Just add these functions to application/mappers/review.mapper.ts
    static toPostgres(review: Review): Partial<ReviewEntity> {
        return {
            id: review.id,
            productId: review.productId,
            userId: review.userId,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            editHistory: review.editHistory,
            bookId: review.bookId,
            isVerifiedUser: review.isVerifiedUser,
            isPremiumUser: review.isPremiumUser,
            reportCount: review.reportCount,
            isAuthorBlocked: review.isAuthorBlocked,
            isSoftDeleted: review.isSoftDeleted,
            isHidden: review.isHidden,

        };
    }

    static toDomainFromPostgres(entity: ReviewEntity): Review {
        return Review.create({
            id: entity.id,
            productId: entity.productId,
            userId: entity.userId,
            rating: entity.rating,
            comment: entity.comment,
            createdAt: entity.createdAt,
            editHistory: entity.editHistory,
            bookId: entity.bookId,
            isVerifiedUser: entity.isVerifiedUser,
            isPremiumUser: entity.isPremiumUser,
            reportCount: entity.reportCount,
            isAuthorBlocked: entity.isAuthorBlocked,
            isSoftDeleted: entity.isSoftDeleted,
            isHidden: entity.isHidden,
                
        });
    }









}