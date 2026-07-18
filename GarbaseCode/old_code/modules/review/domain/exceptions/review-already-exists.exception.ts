export class ReviewAlreadyExistsException extends Error {
  constructor() {
    super('User has already reviewed this book.');
    this.name = ReviewAlreadyExistsException.name;
  }
}