import { EditHistoryEntry } from "../../domain/models/review.model";

// application/commands/update-review.command.ts
export class UpdateReviewCommand {
  constructor(
    public readonly id: string,
    public readonly rating: number,
    public readonly comment: string,
    // public readonly reviewId: string,
    // public readonly productId: string,
    // public readonly userId: string,
    public readonly isPremiumUser: boolean,
    public readonly isVerifiedUser: boolean,
    // public readonly bookId: string,
    public readonly reportCount: number,
    public readonly isAuthorBlocked: boolean,
    public readonly isSoftDeleted: boolean,
    public readonly isHidden: boolean,
    // public readonly createdAt: Date,
    // public readonly editHistory: EditHistoryEntry[],
  ) { }
}

