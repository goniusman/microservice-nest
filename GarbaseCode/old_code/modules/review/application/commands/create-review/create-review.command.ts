export class CreateReviewCommand {
  constructor(
    public readonly userId: string,
    public readonly bookId: string,
    public readonly rating: number,
    public readonly content: string,
  ) {}
}