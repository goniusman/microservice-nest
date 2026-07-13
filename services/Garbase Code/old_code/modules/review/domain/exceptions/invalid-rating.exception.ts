export class InvalidRatingException extends Error {
  constructor() {
    super('Rating must be between 1 and 5.');
    this.name = InvalidRatingException.name;
  }
}