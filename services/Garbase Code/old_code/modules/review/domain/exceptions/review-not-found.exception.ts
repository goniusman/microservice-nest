export class ReviewNotFoundException extends Error {
  constructor() {
    super('Review not found.');
    this.name = ReviewNotFoundException.name;
  }
}

