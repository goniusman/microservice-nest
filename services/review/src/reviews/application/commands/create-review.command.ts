import { EditHistoryEntry } from "../../domain/models/review.model";

export class CreateReviewCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly isPremiumUser: boolean,
    public readonly isVerifiedUser: boolean,
    public readonly bookId: string,
    // public readonly reportCount: number,
    // public readonly isAuthorBlocked: boolean,
    // public readonly isSoftDeleted: boolean,
    // public readonly isHidden: boolean,
    // public readonly createdAt: Date,
    // public readonly editHistory: EditHistoryEntry[],
    // public readonly comment: string,
  ) { }
}







