export class ReviewAlreadyDeletedException extends Error {
  constructor() {
    super('Review has already been deleted.');
    this.name = ReviewAlreadyDeletedException.name;
  }
}