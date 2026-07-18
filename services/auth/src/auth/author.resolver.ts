import { Resolver, Query, Args, ID, ResolveReference } from '@nestjs/graphql';
import { Author } from './entities/author.model';

@Resolver(() => Author)
export class AuthorResolver {
  private authors: any = [
    { id: '101', name: 'G.J. Born' },
    { id: '102', name: 'Martin Fowler' },
  ];

  @Query(() => Author, { name: 'author' })
  async getAuthor(@Args('id', { type: () => ID }) id: string): Promise<Author> {
    return this.authors.find((a) => a.id === id);
  }

  // CRITICAL: Apollo Router uses this to resolve authors when requested by the Book service
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }): Author {
    return this.authors.find((a) => a.id === reference.id);
  }
}
