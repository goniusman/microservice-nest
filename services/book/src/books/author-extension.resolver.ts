import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Book, Author } from './schemas/book.model';

@Resolver(() => Author)
export class AuthorExtensionResolver {
  private bookss: any = [
    { id: '1', title: 'Cloud Native Microservices', price: 49.99, authorId: '101' },
    { id: '2', title: 'Patterns of Enterprise Architecture', price: 59.99, authorId: '102' },
  ];

  @ResolveField(() => [Book])
  async books(@Parent() author: Author): Promise<Book[]> {
    return this.bookss.filter(b => b.authorId === author.id);
  }
}