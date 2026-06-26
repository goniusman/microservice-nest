import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Book, Author } from './schemas/book.model';

@Resolver(() => Book)
export class BookResolver {
  private books = [
    { id: '1', title: 'Cloud Native Microservices', price: 49.99, authorId: '101' },
    { id: '2', title: 'Patterns of Enterprise Architecture', price: 59.99, authorId: '102' },
  ];

  @Query(() => [Book], { name: 'books' })
  async getBooks(): Promise<Book[]> {
    return this.books;
  }

  // Resolves the Author stub when a client queries books -> author
  @ResolveField(() => Author)
  author(@Parent() book: Book) {
    return { __typename: 'Author', id: book.authorId };
  }
}








