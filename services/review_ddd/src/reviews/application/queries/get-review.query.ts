export class GetReviewByIdQuery {
  constructor(
    public readonly id: string,
    public readonly page: number,
    public readonly limit: number,
  ) { }

}