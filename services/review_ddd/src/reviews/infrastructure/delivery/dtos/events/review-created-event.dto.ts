export class ReviewCreatedExternalEvent {
  constructor(
    public readonly reviewId: string,
    public readonly productId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly timestamp: Date,
  ) {}
}