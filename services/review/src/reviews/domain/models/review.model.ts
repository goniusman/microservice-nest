export interface EditHistoryEntry {
  rating: number;
  comment: string;
  editedAt: Date;
}

export interface ReviewProps {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  productId: string;
  isVerifiedUser: boolean;
  isPremiumUser: boolean;
  reportCount: number;
  isAuthorBlocked: boolean;
  isSoftDeleted: boolean;
  isHidden: boolean;
  createdAt: Date;
  editHistory: EditHistoryEntry[];
}

export class Review {
  private readonly props: ReviewProps;

  constructor(props: ReviewProps) {
    this.props = props;
  }

  // Pure domain getters mapping out the current entity state matrix
  public get id(): string { return this.props.id; }
  public get bookId(): string { return this.props.bookId; }
  public get userId(): string { return this.props.userId; }
  public get rating(): number { return this.props.rating; }
  public get productId(): string { return this.props.productId; }
  public get isVerifiedUser(): boolean { return this.props.isVerifiedUser; }
  public get isPremiumUser(): boolean { return this.props.isPremiumUser; }
  public get reportCount(): number { return this.props.reportCount; }
  public get isAuthorBlocked(): boolean { return this.props.isAuthorBlocked; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get comment(): string { return this.props.comment; }
  public get isSoftDeleted(): boolean { return this.props.isSoftDeleted; }
  public get isHidden(): boolean { return this.props.isHidden; }
  public get editHistory(): EditHistoryEntry[] { return [...this.props.editHistory]; }

  // 🛡️ Rule: Only verified users can rate
  public static validateVerification(isVerifiedUser: boolean, rating: number): void {
    if (rating > 0 && !isVerifiedUser) {
      throw new Error('Only verified users are permitted to assign star ratings to books.');
    }
  }

  // 🛡️ Rules: Premium edit windows, Edit history preservation, Autohide on reports
  public updateReview(newRating: number, newComment: string,
    isPremiumUser: boolean,
    isVerifiedUser: boolean,
    reportCount: number,
    isAuthorBlocked: boolean,
    isHidden: boolean): void {
    if (this.props.isSoftDeleted) throw new Error('Cannot modify a deleted review.');

    // Enforce user verification state validation constraints
    Review.validateVerification(this.props.isVerifiedUser, newRating);

    // Enforce Tiered Edit Windows (Premium vs Normal User)
    const daysSinceCreation = (Date.now() - this.props.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (!this.props.isPremiumUser && daysSinceCreation > 7) {
      throw new Error('Standard users are restricted from editing reviews after 7 days.');
    }

    // Capture state modifications into the immutable audit history collection
    this.props.editHistory.push({
      rating: this.props.rating,
      comment: this.props.comment,
      // isPremiumUser: this.props.isPremiumUser
      editedAt: new Date(),
    });

    this.props.rating = newRating;
    this.props.comment = newComment;
    this.props.isPremiumUser = isPremiumUser;
    this.props.isVerifiedUser = isVerifiedUser;
    this.props.reportCount = reportCount;
    this.props.isAuthorBlocked = isAuthorBlocked;
    this.props.isHidden = isHidden;

  }

  // 🛡️ Rule: If review gets more than 50 reports, hide automatically
  public addReport(): void {
    this.props.reportCount += 1;
    if (this.props.reportCount > 50) {
      this.props.isHidden = true;
    }
  }

  // 🛡️ Rule: If author blocks reviewer, review becomes invisible
  public setAuthorBlockStatus(isBlocked: boolean): void {
    this.props.isAuthorBlocked = isBlocked;
    if (isBlocked) {
      this.props.isHidden = true;
    }
  }

  // 🛡️ Rule: Soft Delete strategy configuration
  public softDelete(): void {
    this.props.isSoftDeleted = true;
    this.props.isHidden = true;
  }

  public static create(props: ReviewProps): Review {
    return new Review(props);
  }

  private validate(): void {
    if (this.props.rating < 1 || this.props.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!this.props.comment || this.props.comment.trim() === '') {
      throw new Error('Comment cannot be empty');
    }
  }


  // 👇 Core Invariant Business Rules implemented directly on the object state
  public static validateContent(rating: number, comment: string): void {
    const cleanComment = comment ? comment.trim() : '';

    if (rating === 1 && cleanComment.length === 0) {
      throw new Error('A 1-star review must include an explanatory comment.');
    }

    const bannedWords = ['garbage', 'trash'];
    const hasProfanity = bannedWords.some(word => cleanComment.toLowerCase().includes(word));
    if (hasProfanity) {
      throw new Error('Review comments must adhere to community guidelines and contain no profanity.');
    }
  }

  public updateCommentAndRating(rating: number, comment: string): void {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5.');

    // Evaluate internal business rule validations before mapping mutations
    Review.validateContent(rating, comment);

    this.props.rating = rating;
    this.props.comment = comment;
  }

}