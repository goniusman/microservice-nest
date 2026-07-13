export class InvalidReviewContentException extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid review content.');
    this.name = InvalidReviewContentException.name;
  }
}


