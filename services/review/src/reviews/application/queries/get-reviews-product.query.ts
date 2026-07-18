export class GetReviewsByProductQuery {
   constructor(
    public readonly productId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}