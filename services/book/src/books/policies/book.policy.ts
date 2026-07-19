// apps/book-service/src/books/policies/book.policy.ts
import { Injectable } from '@nestjs/common';
import { Book } from '../schemas/book.schema';

@Injectable()
export class BookPolicy {
  // Pass the user payload extracted from the JWT (not a database entity)
  canDelete(user: { sub: string; permissions: string[] }, book: Book): boolean {
    // If they have an absolute override permission like 'books:delete:any'
    if (user.permissions.includes('books:delete:any')) return true;

    // Standard ReBAC check: Match JWT User ID against the Book domain record
    return book.author === user.sub;
  }
}