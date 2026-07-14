// book-user.resolver.ts (Inside Book Service)
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BookType, UserType } from './graphql-type/book.type';
import { BooksService } from './books.service';

@Resolver(() => UserType)
export class BookUserResolver {
  constructor(private readonly bookService: BooksService) {}

  @ResolveField(() => [BookType])
  async books(@Parent() user: UserType) {
    return this.bookService.findByAuthorId(user.id);
  }
}