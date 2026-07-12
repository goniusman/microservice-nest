import { Resolver, Query, Args } from '@nestjs/graphql';
// import { BookItem, CatalogItem } from './models/book.model';
// import { CatalogService } from './catalog.service';
// import { Book, BookSchema } from './schemas/book.schema';
import { BooksService } from './books.service';
import { Book } from './schemas/book.model';
 


@Resolver(() => Book)
export class BookResolver {
  // In a real microservice, this constructor injects a service that communicates
  // with 'book-service' or 'order-service' over gRPC/REST.
  constructor(private readonly bookService: BooksService) { }

  // @Query(() => [BookSchema], { name: 'catalog', description: 'Get all catalog items' })
  // async getCatalog(): Promise<Book[]> {
  //   return [
  //     { id: '1', title: 'The Cloud Native Architecture Blueprint', price: 49.99 },
  //     { id: '2', title: 'Mastering NestJS and GraphQL', price: 39.99 }
  //   ];
  // }

  // YOUR NEW QUERY: Fetches dynamically from the /books microservice
  @Query(() => [Book], { name: 'externalBooks', description: 'Fetches books from the legacy REST service' })
  async getExternalBooks(): Promise<Book[]> {
    const books = await this.bookService.findAll();
    console.log('Books fetched from book-service:', books);
    // Map the incoming REST JSON data keys to match your GraphQL ObjectType fields if necessary
    // return books?.map((book: any) => ({
    //   id: book.id || book._id,
    //   title: book.title,
    //   price: book.price || 0.0,
    //   description: book.description || '',
    //   quantity: book.quantity || 0
    // }));

    return books
  }


}