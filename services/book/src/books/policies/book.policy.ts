// book-service/src/books/policies/book.policy.ts
import { Injectable } from '@nestjs/common';
import { UserContext, ResourceDocument } from '../../auth/interfaces/policy.interface';

@Injectable()
export class BookPolicy {
  
  /**
   * Rule: A user can read a book if it's public, OR if they are the owner,
   * OR if they are an enterprise administrator/moderator.
   */
  canRead(user: UserContext, book: ResourceDocument): boolean {
    if (user.roles.includes('administrator') || user.roles.includes('moderator')) {
      return true;
    }
    return book.isPublic === true || book.authorId === user.id;
  }

  /**
   * Rule: A user can update a book ONLY if they are the designated author (owner)
   * or a system administrator.
   */
  canUpdate(user: UserContext, book: ResourceDocument): boolean {
    if (user.roles.includes('administrator')) {
      return true;
    }
    return book.author === user.id;
  }

  /**
   * Rule: A user can delete a book ONLY if they are the author OR a global moderator/admin.
   */
  canDelete(user: UserContext, book: ResourceDocument): boolean {
    const isPrivilegedRole = user.roles.some(role => ['administrator', 'moderator'].includes(role));
    if (isPrivilegedRole) {
      return true;
    }
    return book.author === user.id;
  }
}