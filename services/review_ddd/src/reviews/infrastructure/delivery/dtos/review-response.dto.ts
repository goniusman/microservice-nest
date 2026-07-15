export class ReviewResponseDto {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly createdAt: Date,
    public readonly isPremiumUser: boolean,
    public readonly isVerifiedUser: boolean,
    public readonly bookId: string,
    public readonly reportCount: number,
    public readonly isAuthorBlocked: boolean,
    public readonly isSoftDeleted: boolean,
    public readonly isHidden: boolean,
    public readonly editHistory: any,
  ) {}
}